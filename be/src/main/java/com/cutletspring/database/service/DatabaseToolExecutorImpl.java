package com.cutletspring.database.service;

import com.cutletspring.database.config.DatabaseBackupProperties;
import com.cutletspring.database.model.DatabaseConnectionInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseToolExecutorImpl implements DatabaseToolExecutor {

    private final DatabaseBackupProperties backupProperties;

    // PostgreSQL custom dump header magic bytes: 'P', 'G', 'D', 'M', 'P'
    private static final byte[] PGDMP_MAGIC = new byte[]{0x50, 0x47, 0x44, 0x4D, 0x50};

    @Override
    public boolean isToolsAvailable() {
        try {
            Process process = new ProcessBuilder(backupProperties.getTools().getPgDumpPath(), "--version").start();
            boolean finished = process.waitFor(5, TimeUnit.SECONDS);
            return finished && process.exitValue() == 0;
        } catch (Exception e) {
            log.debug("PostgreSQL client tools (pg_dump) not available: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean validateDumpHeader(File archiveFile) {
        if (archiveFile == null || !archiveFile.exists() || archiveFile.length() < 5) {
            return false;
        }
        try (InputStream is = new FileInputStream(archiveFile)) {
            byte[] header = new byte[5];
            int read = is.read(header);
            return read == 5 && Arrays.equals(header, PGDMP_MAGIC);
        } catch (Exception e) {
            log.error("Failed to read archive header for {}: {}", archiveFile.getName(), e.getMessage());
            return false;
        }
    }

    @Override
    public void executeDump(DatabaseConnectionInfo connInfo, File targetFile) {
        List<String> command = new ArrayList<>();
        command.add(backupProperties.getTools().getPgDumpPath());
        command.add("-h");
        command.add(connInfo.getHost());
        command.add("-p");
        command.add(String.valueOf(connInfo.getPort()));
        command.add("-U");
        command.add(connInfo.getUsername());
        command.add("-d");
        command.add(connInfo.getDatabase());
        command.add("-Fc"); // Custom format (compressed + TOC)
        command.add("-f");
        command.add(targetFile.getAbsolutePath());

        log.info("Executing database dump to {}", targetFile.getName());
        runProcess(command, connInfo, 600, false);

        if (!targetFile.exists() || targetFile.length() == 0) {
            throw new IllegalStateException("Database dump produced an empty or missing file");
        }
        if (!validateDumpHeader(targetFile)) {
            throw new IllegalStateException("Generated dump file failed PostgreSQL header validation");
        }
    }

    @Override
    public String executeRestoreList(File archiveFile) {
        if (!archiveFile.exists()) {
            throw new IllegalArgumentException("Backup archive file does not exist: " + archiveFile.getName());
        }
        if (!validateDumpHeader(archiveFile)) {
            throw new IllegalArgumentException("Invalid backup archive format: file does not contain valid PostgreSQL PGDMP header");
        }

        List<String> command = List.of(
                backupProperties.getTools().getPgRestorePath(),
                "-l",
                archiveFile.getAbsolutePath()
        );

        return runProcess(command, null, 60, true);
    }

    @Override
    public void executeRestore(DatabaseConnectionInfo connInfo, File archiveFile) {
        if (!archiveFile.exists()) {
            throw new IllegalArgumentException("Archive file not found: " + archiveFile.getName());
        }
        if (!validateDumpHeader(archiveFile)) {
            throw new IllegalArgumentException("Invalid backup archive format: file does not contain valid PostgreSQL PGDMP header");
        }

        List<String> command = new ArrayList<>();
        command.add(backupProperties.getTools().getPgRestorePath());
        command.add("--clean");
        command.add("--if-exists");
        command.add("--no-owner");
        command.add("--no-privileges");
        command.add("-h");
        command.add(connInfo.getHost());
        command.add("-p");
        command.add(String.valueOf(connInfo.getPort()));
        command.add("-U");
        command.add(connInfo.getUsername());
        command.add("-d");
        command.add(connInfo.getDatabase());
        command.add(archiveFile.getAbsolutePath());

        log.info("Executing database restore from {}", archiveFile.getName());
        // pg_restore with --clean may exit with code 1 for harmless warnings (e.g., table does not exist to drop).
        // Code > 1 indicates fatal execution errors.
        runProcess(command, connInfo, 900, false);
    }

    private String runProcess(List<String> command, DatabaseConnectionInfo connInfo, int timeoutSeconds, boolean captureStdout) {
        ProcessBuilder pb = new ProcessBuilder(command);

        if (connInfo != null) {
            if (connInfo.getPassword() != null && !connInfo.getPassword().isEmpty()) {
                pb.environment().put("PGPASSWORD", connInfo.getPassword());
            }
            if (connInfo.getSslMode() != null && !connInfo.getSslMode().isEmpty()) {
                pb.environment().put("PGSSLMODE", connInfo.getSslMode());
            }
        }

        StringBuilder stdoutBuf = new StringBuilder();
        StringBuilder stderrBuf = new StringBuilder();

        try {
            Process process = pb.start();

            Thread outThread = new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        if (captureStdout) {
                            stdoutBuf.append(line).append("\n");
                        }
                    }
                } catch (IOException ignored) {
                }
            });

            Thread errThread = new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        stderrBuf.append(line).append("\n");
                    }
                } catch (IOException ignored) {
                }
            });

            outThread.start();
            errThread.start();

            boolean completed = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
            outThread.join(2000);
            errThread.join(2000);

            if (!completed) {
                process.destroyForcibly();
                throw new IllegalStateException("Process timed out after " + timeoutSeconds + " seconds: " + command.get(0));
            }

            int exitCode = process.exitValue();
            // pg_restore allows code 0 or code 1 (warnings/notices)
            boolean isRestore = command.get(0).contains("pg_restore") && !command.contains("-l");
            if (exitCode != 0 && (!isRestore || exitCode > 1)) {
                String sanitizedError = sanitizeError(stderrBuf.toString());
                log.error("Command {} failed with exit code {}: {}", command.get(0), exitCode, sanitizedError);
                throw new IllegalStateException("Database tool execution failed (exit code " + exitCode + "): " + sanitizedError);
            }

            return stdoutBuf.toString();
        } catch (Exception e) {
            if (e instanceof IllegalStateException || e instanceof IllegalArgumentException) {
                throw (RuntimeException) e;
            }
            throw new IllegalStateException("Failed to execute database tool: " + e.getMessage(), e);
        }
    }

    private String sanitizeError(String rawError) {
        if (rawError == null) return "";
        // Strip potential credentials or connection parameters
        return rawError.replaceAll("(?i)password=[^\\s]+", "password=***")
                .replaceAll("(?i)://[^:]+:[^@]+@", "://***:***@")
                .trim();
    }
}

