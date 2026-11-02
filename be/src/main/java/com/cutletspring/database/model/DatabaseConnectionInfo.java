package com.cutletspring.database.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatabaseConnectionInfo {
    private String host;
    private int port;
    private String database;
    private String username;
    private String password;
    private String sslMode;
    private boolean isPostgres;

    public static DatabaseConnectionInfo parse(String jdbcUrl, String username, String password) {
        if (jdbcUrl == null || !jdbcUrl.startsWith("jdbc:postgresql://")) {
            return DatabaseConnectionInfo.builder()
                    .host("localhost")
                    .port(5432)
                    .database("cutlet_spring")
                    .username(username != null ? username : "postgres")
                    .password(password != null ? password : "")
                    .sslMode("prefer")
                    .isPostgres(false)
                    .build();
        }

        try {
            // Strip "jdbc:" to parse as standard URI: postgresql://host:port/database?params
            String cleanUri = jdbcUrl.substring(5);
            URI uri = URI.create(cleanUri);

            String host = uri.getHost() != null ? uri.getHost() : "localhost";
            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String path = uri.getPath() != null ? uri.getPath() : "";
            String database = path.startsWith("/") ? path.substring(1) : path;
            if (database.isEmpty()) {
                database = "cutlet_spring";
            }

            Map<String, String> queryParams = parseQueryParams(uri.getQuery());
            String sslMode = queryParams.getOrDefault("sslmode", "prefer");
            if (queryParams.containsKey("ssl") && "true".equalsIgnoreCase(queryParams.get("ssl"))) {
                sslMode = "require";
            }

            String effectiveUsername = username;
            String effectivePassword = password;

            if (uri.getUserInfo() != null) {
                String[] userParts = uri.getUserInfo().split(":", 2);
                if (userParts.length > 0 && (effectiveUsername == null || effectiveUsername.isEmpty())) {
                    effectiveUsername = userParts[0];
                }
                if (userParts.length > 1 && (effectivePassword == null || effectivePassword.isEmpty())) {
                    effectivePassword = userParts[1];
                }
            }

            return DatabaseConnectionInfo.builder()
                    .host(host)
                    .port(port)
                    .database(database)
                    .username(effectiveUsername != null ? effectiveUsername : "postgres")
                    .password(effectivePassword != null ? effectivePassword : "")
                    .sslMode(sslMode)
                    .isPostgres(true)
                    .build();
        } catch (Exception e) {
            return DatabaseConnectionInfo.builder()
                    .host("localhost")
                    .port(5432)
                    .database("cutlet_spring")
                    .username(username != null ? username : "postgres")
                    .password(password != null ? password : "")
                    .sslMode("prefer")
                    .isPostgres(true)
                    .build();
        }
    }

    private static Map<String, String> parseQueryParams(String query) {
        Map<String, String> params = new HashMap<>();
        if (query == null || query.isBlank()) {
            return params;
        }
        for (String param : query.split("&")) {
            String[] entry = param.split("=", 2);
            if (entry.length == 2) {
                params.put(entry[0].toLowerCase(), entry[1]);
            }
        }
        return params;
    }
}
