FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y cmake g++ && apt-get clean

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]
