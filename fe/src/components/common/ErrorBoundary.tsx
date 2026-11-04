import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorScreen } from './ErrorScreen';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error | null; errorInfo: ErrorInfo | null; resetError: () => void }) => ReactNode);
  sectionName?: string;
  isFullScreen?: boolean;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[ErrorBoundary] Caught error in "${this.props.sectionName || 'Application Root'}":`, error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, sectionName, isFullScreen } = this.props;

    if (hasError) {
      if (typeof fallback === 'function') {
        return fallback({ error, errorInfo, resetError: this.resetError });
      }
      if (fallback) {
        return fallback;
      }

      return (
        <ErrorScreen
          error={error}
          errorInfo={errorInfo}
          sectionName={sectionName}
          isFullScreen={isFullScreen}
          onRetry={this.resetError}
        />
      );
    }

    return children;
  }
}

