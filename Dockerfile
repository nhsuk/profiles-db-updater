FROM node:7.9-alpine

ENV USERNAME nodeuser

RUN adduser -D "$USERNAME" && \
    mkdir -p /code && \
    chown "$USERNAME":"$USERNAME" /code

USER $USERNAME
WORKDIR /code

COPY yarn.lock package.json /code/
RUN  yarn install --ignore-optional

COPY . /code

USER root
RUN find /code/data -user 0 -print0 | xargs -0 chown "$USERNAME":"$USERNAME"
RUN find /code/input -user 0 -print0 | xargs -0 chown "$USERNAME":"$USERNAME"
USER $USERNAME

VOLUME /code/data

CMD [ "node", "app" ]

