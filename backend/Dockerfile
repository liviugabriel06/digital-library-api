# Pasul 1: Build
FROM maven:3.8.5-openjdk-17 AS build
# Setăm directorul de lucru în interiorul containerului
WORKDIR /app
# Copiem fișierele proiectului
COPY . .
# Construim fișierul jar
RUN mvn clean package -DskipTests

# Pasul 2: Run
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copiem jar-ul generat anterior
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
