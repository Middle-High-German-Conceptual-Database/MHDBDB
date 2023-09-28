FROM eclipse-temurin:17-jre

RUN apt-get update && apt-get install -y \
    curl git make gcc \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /opt/teic

RUN git clone https://github.com/TEIC/Stylesheets.git /opt/teic/Stylesheets

WORKDIR /opt/teic/Stylesheets
RUN make install

RUN mkdir /opt/app
COPY target/*.jar /opt/app/mhdbdb.jar
CMD ["java", "-jar", "/opt/app/mhdbdb.jar"]
