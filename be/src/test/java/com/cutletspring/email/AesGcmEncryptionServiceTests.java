package com.cutletspring.email;

import com.cutletspring.email.crypto.AesGcmEncryptionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AES-256-GCM Encryption Service Unit Tests")
class AesGcmEncryptionServiceTests {

    private static final String TEST_BASE64_KEY = "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY="; // 32 bytes

    @Test
    @DisplayName("Successfully encrypts and decrypts sensitive SMTP credentials")
    void shouldEncryptAndDecryptSuccessfully() {
        AesGcmEncryptionService service = new AesGcmEncryptionService(TEST_BASE64_KEY);
        String secret = "SuperSecretSmtpAppPassword123!@#";

        String encrypted = service.encrypt(secret);
        assertNotNull(encrypted);
        assertNotEquals(secret, encrypted);

        String decrypted = service.decrypt(encrypted);
        assertEquals(secret, decrypted);
    }

    @Test
    @DisplayName("Encrypting same plaintext twice produces different ciphertexts due to random IV")
    void shouldProduceDifferentCiphertextsForSamePlaintext() {
        AesGcmEncryptionService service = new AesGcmEncryptionService(TEST_BASE64_KEY);
        String secret = "mySecretPassword";

        String encrypted1 = service.encrypt(secret);
        String encrypted2 = service.encrypt(secret);

        assertNotNull(encrypted1);
        assertNotNull(encrypted2);
        assertNotEquals(encrypted1, encrypted2);

        assertEquals(secret, service.decrypt(encrypted1));
        assertEquals(secret, service.decrypt(encrypted2));
    }

    @Test
    @DisplayName("Supports arbitrary UTF-8 string keys via SHA-256 derivation")
    void shouldSupportRawStringKeysViaSha256() {
        AesGcmEncryptionService service = new AesGcmEncryptionService("MyCustomPassphraseForCutletSpring");
        String secret = "AnotherSmtpPassword!";

        String encrypted = service.encrypt(secret);
        String decrypted = service.decrypt(encrypted);
        assertEquals(secret, decrypted);
    }

    @Test
    @DisplayName("Throws exception when decryption key is invalid or data is tampered with")
    void shouldFailWhenTampered() {
        AesGcmEncryptionService service = new AesGcmEncryptionService(TEST_BASE64_KEY);
        String encrypted = service.encrypt("validSecret");

        // Tamper with base64 string
        String tampered = encrypted.substring(0, encrypted.length() - 4) + "AAAA";

        assertThrows(IllegalStateException.class, () -> service.decrypt(tampered));
    }

    @Test
    @DisplayName("Throws IllegalStateException when encryption key is not configured")
    void shouldFailWhenKeyMissing() {
        AesGcmEncryptionService service = new AesGcmEncryptionService("");
        assertFalse(service.isKeyConfigured());

        assertThrows(IllegalStateException.class, () -> service.encrypt("test"));
        assertThrows(IllegalStateException.class, () -> service.decrypt("test"));
    }

    @Test
    @DisplayName("Null or empty inputs return null gracefully")
    void shouldHandleNullOrEmptyGracefully() {
        AesGcmEncryptionService service = new AesGcmEncryptionService(TEST_BASE64_KEY);

        assertNull(service.encrypt(null));
        assertNull(service.encrypt(""));
        assertNull(service.decrypt(null));
        assertNull(service.decrypt(""));
    }
}

