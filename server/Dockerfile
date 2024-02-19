FROM python:3.9

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY server.py server.py
COPY /src /src

CMD ["gunicorn", "server:app", "--access-logfile", "-" ]
