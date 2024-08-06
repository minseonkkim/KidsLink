FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    cmake \
    g++ \
    libgl1-mesa-glx \
    libglib2.0-0 && \
    apt-get clean

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]
