FROM node:7.9-alpine

ENV USERNAME nodeuser

RUN adduser -D "$USERNAME" && \
    mkdir -p /code/data && \
    chown "$USERNAME":"$USERNAME" /code

USER $USERNAME
WORKDIR /code

COPY .snyk yarn.lock package.json /code/
RUN  yarn install --ignore-optional

COPY . /code

USER root
RUN find /code -user 0 -print0 | xargs -0 chown "$USERNAME":"$USERNAME"
USER $USERNAME

VOLUME /code/data

CMD [ "node", "app" ]

