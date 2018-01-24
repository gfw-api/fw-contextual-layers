FROM node:8.1
MAINTAINER rodrigo.solis@vizzuality.com

ENV NAME fw-contextual-layer
ENV USER fw-contextual-layer

RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install -y --no-install-recommends bash git openssh-client openssh-server python

RUN apt-get install -y libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++

RUN groupadd $USER && useradd -g $USER $USER

RUN npm install --unsafe-perm -g bunyan  grunt-cli

RUN mkdir -p /opt/$NAME
COPY package.json /opt/$NAME/package.json
RUN cd /opt/$NAME && npm install

COPY entrypoint.sh /opt/$NAME/entrypoint.sh
COPY config /opt/$NAME/config

WORKDIR /opt/$NAME

COPY ./app /opt/$NAME/app
RUN chown $USER:$USER /opt/$NAME

# Tell Docker we are going to use this port
EXPOSE 3025
USER $USER

ENTRYPOINT ["./entrypoint.sh"]
