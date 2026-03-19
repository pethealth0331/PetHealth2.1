FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Exponer el puerto
EXPOSE 3001

# Iniciar servidor FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]
