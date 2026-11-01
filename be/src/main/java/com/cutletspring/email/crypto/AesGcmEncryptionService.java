package com.cutletspring.email.crypto;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Provides authenticated encryption and decryption using AES-256-GCM.
 * Protects SMTP credentials at rest in the database.
 */
@Service
@Slf4j
public class AesGcmEncryptionService {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH_BYTES = 12;
    private static final int GCM_TAG_LENGTH_BITS = 128;

    private final SecretKey secretKey;
    private final SecureRandom secureRandom = new SecureRandom();

    public AesGcmEncryptionService(@Value("${app.config.encryption-key:}") String rawKey) {
        if (rawKey == null || rawKey.trim().isEmpty()) {
            this.secretKey = null;
            log.warn("Application configuration encryption key (APP_CONFIG_ENCRYPTION_KEY) is not set.");
        } else {
            this.secretKey = deriveSecretKey(rawKey.trim());
        }
    }

    private SecretKey deriveSecretKey(String rawKey) {
        try {
            byte[] keyBytes;
            try {
                byte[] decoded = Base64.getDecoder().decode(rawKey);
                if (decoded.length == 32) {
                    keyBytes = decoded;
                } else {
                    keyBytes = MessageDigest.getInstance("SHA-256").digest(rawKey.getBytes(StandardCharsets.UTF_8));
                }
            } catch (IllegalArgumentException e) {
                // Not valid Base64, fallback to SHA-256 hash of UTF-8 string
                keyBytes = MessageDigest.getInstance("SHA-256").digest(rawKey.getBytes(StandardCharsets.UTF_8));
            }
            return new SecretKeySpec(keyBytes, "AES");
        } catch (Exception e) {
            throw new IllegalStateException("Failed to initialize AES-256-GCM encryption key.", e);
        }
    }

    /**
     * Encrypts plaintext string using AES-256-GCM with a fresh random 12-byte IV.
     *
     * @param plaintext Secret plaintext to encrypt
     * @return Base64-encoded string combining IV and ciphertext with authentication tag
     */
    public String encrypt(String plaintext) {
        if (plaintext == null || plaintext.isEmpty()) {
            return null;
        }
        ensureKeyConfigured();

        try {
            byte[] iv = new byte[GCM_IV_LENGTH_BYTES];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, parameterSpec);

            byte[] cipherText = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

            ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + cipherText.length);
            byteBuffer.put(iv);
            byteBuffer.put(cipherText);

            return Base64.getEncoder().encodeToString(byteBuffer.array());
        } catch (Exception e) {
            log.error("Authenticated encryption failure: {}", e.getMessage());
            throw new IllegalStateException("Failed to securely encrypt sensitive credential.", e);
        }
    }

    /**
     * Decrypts an AES-256-GCM encrypted payload.
     *
     * @param encryptedPayload Base64-encoded combined IV and ciphertext
     * @return Decrypted plaintext string
     */
    public String decrypt(String encryptedPayload) {
        if (encryptedPayload == null || encryptedPayload.trim().isEmpty()) {
            return null;
        }
        ensureKeyConfigured();

        try {
            byte[] decoded = Base64.getDecoder().decode(encryptedPayload.trim());
            if (decoded.length < GCM_IV_LENGTH_BYTES + (GCM_TAG_LENGTH_BITS / 8)) {
                throw new IllegalArgumentException("Invalid encrypted payload size.");
            }

            ByteBuffer byteBuffer = ByteBuffer.wrap(decoded);
            byte[] iv = new byte[GCM_IV_LENGTH_BYTES];
            byteBuffer.get(iv);

            byte[] cipherText = new byte[byteBuffer.remaining()];
            byteBuffer.get(cipherText);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, parameterSpec);

            byte[] plainTextBytes = cipher.doFinal(cipherText);
            return new String(plainTextBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Authenticated decryption failure: {}", e.getMessage());
            throw new IllegalStateException("Failed to securely decrypt credential. Key or payload invalid.", e);
        }
    }

    public boolean isKeyConfigured() {
        return secretKey != null;
    }

    private void ensureKeyConfigured() {
        if (secretKey == null) {
            throw new IllegalStateException("APP_CONFIG_ENCRYPTION_KEY is not configured on this server.");
        }
    }
}

