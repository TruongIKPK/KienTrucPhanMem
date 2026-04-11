FROM eclipse-temurin:11-jre-jammy

WORKDIR /app

RUN apt-get update && apt-get install -y maven && apt-get clean

COPY pom.xml .
RUN mvn dependency:resolve -q

COPY src ./src
RUN mvn package -q

EXPOSE 8080

CMD ["java", "-jar", "target/worker-1.0-SNAPSHOT.jar"]
