/**
 * Real-time Menu Synchronization Channel across components, tabs, and windows.
 * Eliminates the need for manual browser refreshes (Ctrl+R).
 */

const SYNC_CHANNEL_NAME = 'cutlet_menu_sync_channel';
const STORAGE_SYNC_KEY = 'cutlet_menu_last_updated_at';
const CUSTOM_EVENT_NAME = 'cutlet:menu-updated';

type MenuSyncCallback = () => void;

let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  }
} catch {
  broadcastChannel = null;
}

/**
 * Notifies all active menu listeners (in the current tab and other tabs/windows)
 * that menu data (dishes, categories, badges, status) has been updated.
 */
export function notifyMenuUpdated(): void {
  if (typeof window === 'undefined') return;

  const now = Date.now().toString();

  // 1. Same-window custom event
  try {
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME, { detail: { timestamp: now } }));
  } catch {}

  // 2. Cross-tab BroadcastChannel
  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'MENU_UPDATED', timestamp: now });
    }
  } catch {}

  // 3. Cross-tab localStorage storage event fallback
  try {
    localStorage.setItem(STORAGE_SYNC_KEY, now);
  } catch {}
}

/**
 * Subscribes to menu update notifications from any tab, window, or component.
 * Returns an unsubscribe cleanup function.
 */
export function subscribeToMenuUpdates(callback: MenuSyncCallback): () => void {
  if (typeof window === 'undefined') return () => {};

  // Handler for same-window custom event
  const handleCustomEvent = () => {
    callback();
  };

  // Handler for cross-tab BroadcastChannel
  const handleBroadcast = (event: MessageEvent) => {
    if (event?.data?.type === 'MENU_UPDATED') {
      callback();
    }
  };

  // Handler for cross-tab localStorage event fallback
  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_SYNC_KEY) {
      callback();
    }
  };

  window.addEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
}
