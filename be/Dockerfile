# ==========================================
# Build Stage
# ==========================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and dependencies specification
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Make wrapper executable
RUN chmod +x ./mvnw

# Pre-fetch dependencies in a cached layer
RUN ./mvnw dependency:go-offline -B || true

# Copy source code
COPY src src

# Package production application
RUN ./mvnw clean package -DskipTests -B

# Extract layered jar for optimal container caching
RUN java -Djarmode=tools -jar target/*.jar extract --layers --launcher --destination target/extracted

# ==========================================
# Production Runtime Stage
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create unprivileged system user for secure container execution
RUN addgroup -S cutlet && adduser -S cutlet -G cutlet

# Install PostgreSQL client tools (pg_dump, pg_restore) and initialize backup directory
RUN apk add --no-cache postgresql-client && \
    mkdir -p /app/backups && \
    chown -R cutlet:cutlet /app/backups

# Copy extracted application layers from build stage
COPY --from=builder --chown=cutlet:cutlet /app/target/extracted/dependencies/ ./
COPY --from=builder --chown=cutlet:cutlet /app/target/extracted/spring-boot-loader/ ./
COPY --from=builder --chown=cutlet:cutlet /app/target/extracted/snapshot-dependencies/ ./
COPY --from=builder --chown=cutlet:cutlet /app/target/extracted/application/ ./

USER cutlet:cutlet

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]

