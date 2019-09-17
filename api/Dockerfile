FROM python:3.7-alpine

RUN adduser -D gs

WORKDIR /home/gs

COPY requirements.txt requirements.txt
RUN python -m venv venv
RUN venv/bin/pip install -r requirements.txt
RUN venv/bin/pip install gunicorn
RUN apk --no-cache add curl

COPY app app
COPY server.py config.py boot.sh wait-for.sh ./
RUN chmod +x boot.sh
RUN chmod +x wait-for.sh

ENV FLASK_APP server.py

RUN chown -R gs:gs ./
USER gs

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]