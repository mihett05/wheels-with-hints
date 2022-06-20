FROM python:3.10

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /server

RUN pip install pipenv

COPY . .

RUN pipenv install --system --deploy --ignore-pipfile

EXPOSE 8080
CMD ["python3", "main.py", "0.0.0.0", "8080"]
