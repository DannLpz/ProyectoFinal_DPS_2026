# Despliegue en Kubernetes - LOOka

## Requisitos previos

- Tener instalado **Minikube** o **Docker Desktop con Kubernetes habilitado**.
- Tener las imágenes `projectov3-backend:latest` y `projectov3-frontend:latest` construidas localmente (ya las tenemos gracias a docker-compose).

## Pasos para el despliegue

### 1. Iniciar Minikube

```bash
minikube start