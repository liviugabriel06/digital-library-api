# Pasul 1: Build
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copiem DOAR conținutul folderului backend
# (Când Render rulează build-ul, el se află în rădăcina proiectului)
COPY backend/ .

# Acum că pom.xml este în /app, rulăm build-ul
RUN mvn clean package -DskipTests

# Pasul 2: Run
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
