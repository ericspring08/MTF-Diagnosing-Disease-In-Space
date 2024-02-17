FROM python:3.8

pip install -U setuptools

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY server.py server.py
COPY /src /src

CMD ["gunicorn", "server:app" ]
