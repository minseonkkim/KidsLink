FROM openjdk:17-jdk-buster
# ffmpeg 설치
RUN apt-get update && apt-get install -y ffmpeg
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
COPY src/main/resources/static/profiles /app/src/main/resources/static/profiles
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]