FROM python:3.12-slim

# Variables de entorno de optimización de Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Incluir /packages en el PYTHONPATH para importar modelos compartidos
ENV PYTHONPATH=/

WORKDIR /app

# Actualización segura de pip e instalación de capas (caché de Docker)
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# El código se carga vía volumen en modo Dev, pero se copia pacotizado para Producción
COPY . .

EXPOSE 3001

# Comando por defecto (será sobreescrito en el compose por el modo --reload)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]
