FROM python:3

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY server.py server.py
COPY /src /src

ENTRYPOINT [ "python" ]
CMD ["server.py" ]