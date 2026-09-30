==========================================================
   LOOka
   Marketplace de muebles con IA y Realidad Aumentada
==========================================================

Universidad Don Bosco · Ciclo 02-2026
Asignatura: Diseño y Programación de Software Multiplataforma
Docente: Ing. Mario Alvarado


==========================================================
   DESCRIPCION
==========================================================

LOOka es una aplicación multiplataforma (iOS, Android y Web)
que permite:

  - Explorar un catálogo de muebles en 3D
  - Generar muebles únicos con IA describiéndolos con tus
    propias palabras
  - Proyectar los muebles en tu espacio real con Realidad
    Aumentada
  - Guardar favoritos, publicar muebles y simular compras


==========================================================
   INICIO RAPIDO
==========================================================

REQUISITOS PREVIOS

  - Node.js v20 LTS        -> https://nodejs.org
  - Docker Desktop         -> https://www.docker.com/products/docker-desktop
  - Git                    -> https://git-scm.com/downloads
  - Expo Go en el celular  -> App Store o Play Store


INSTALACION

  1. Clonar el repositorio
     git clone https://github.com/DannLpz/ProyectoFinal_DPS_2026.git
     cd ProyectoFinal_DPS_2026/Looka

  2. Configurar variables de entorno
     Copy-Item .env.example .env
     (editar .env con tus API keys de Gemini y Tripo3D)

  3. Arrancar todo
     .\start.ps1


CREDENCIALES DE PRUEBA

  Usuario:     demo
  Contraseña:  demo123


==========================================================
   API KEYS NECESARIAS
==========================================================

El proyecto necesita 2 API keys gratuitas:

  GEMINI (clasificación de prompts)
    Obtener en: https://aistudio.google.com/apikey
    La key empieza con "AQ." o "AIza..."

  TRIPO3D (generación de modelos 3D)
    Obtener en: https://platform.tripo3d.ai/
    La key empieza con "tsk_"

Ambas tienen tier gratuito.
Ver Looka/INSTRUCCIONES.txt para el paso a paso completo.


==========================================================
   ARQUITECTURA
==========================================================

  +---------------------------------------------+
  |  FRONTEND · React Native + Expo             |
  |  (iOS · Android · Web)                      |
  +----------------------+----------------------+
                         | REST API
  +----------------------v----------------------+
  |  BACKEND · Node.js + Express + TypeScript   |
  |  · Auth JWT · CRUD · IA Pipeline · AR       |
  +------+--------------------------+-----------+
         |                          |
  +------v----------+    +----------v-----------+
  |  PostgreSQL 16  |    |  Servicios externos  |
  |  (Prisma ORM)   |    |  · Google Gemini     |
  +-----------------+    |  · Tripo3D           |
                         +----------------------+


==========================================================
   STACK TECNOLOGICO
==========================================================

  Frontend:        React Native · Expo 57 · TypeScript
                   Zustand · React Navigation

  Backend:         Node.js 20 · Express 4 · Prisma ORM
                   JWT · bcrypt

  Base de datos:   PostgreSQL 16

  IA:              Google Gemini (cascada de 5 modelos)

  Generación 3D:   Tripo3D API v3

  AR:              model-viewer 4.0 + ARKit (iOS)

  DevOps:          Docker · Docker Compose · Kubernetes


==========================================================
   FUNCIONALIDADES
==========================================================

  Login            Autenticación JWT con bcrypt
  Catálogo         6 muebles predeterminados con filtros
  Generación IA    Texto -> modelo 3D en 1.5-2.5 minutos
  Realidad Aum.    Proyección en espacio real con ARKit
  Favoritos        Persistencia local con Zustand
  Publicaciones    Publicar muebles con precio
  Carrito          Simulación de compra


==========================================================
   DOCUMENTACION
==========================================================

  Guía de instalación completa:
    Looka/INSTRUCCIONES.txt

  Documentación técnica:
    Comentarios JSDoc en el código fuente

  API REST:
    Looka/backend/src/routes/


==========================================================
   ESTRUCTURA DEL REPOSITORIO
==========================================================

  ProyectoFinal_DPS_2026/
  |
  |-- README.md                     Este archivo
  |
  +-- Looka/                        Proyecto completo
      |
      |-- backend/                  API REST (Node.js)
      |   |-- prisma/               Esquema de BD
      |   |-- public/models/        Modelos .glb
      |   |-- src/                  Código fuente
      |   |-- Dockerfile
      |   +-- package.json
      |
      |-- ProyectoDPS_FrontEnd-main/  App móvil (React Native)
      |   |-- src/                  Pantallas, servicios, stores
      |   |-- Dockerfile
      |   +-- package.json
      |
      |-- k8s/                      Manifiestos Kubernetes
      |-- docker-compose.yml        Orquestación
      |-- start.ps1                 Script de inicio
      |-- INSTRUCCIONES.txt         Guía detallada
      +-- .env.example              Plantilla de entorno


==========================================================
   COMANDOS FRECUENTES
==========================================================

  Arrancar todo:
    .\start.ps1

  Levantar Docker:
    docker-compose up -d

  Ver logs del backend:
    docker logs looka_backend -f

  Detener todo:
    docker-compose stop

  Ver contenedores:
    docker ps


==========================================================
   EQUIPO
==========================================================

  Daniel David      Coordinador · Backend
  Sebastian         Frontend · IA
  William           DevOps · AR
  Enrique           QA · Documentación

  Universidad Don Bosco · Ciclo 02-2026


==========================================================
   LICENCIA
==========================================================

  Proyecto académico · Uso educativo · 2026


==========================================================
Fin del documento
==========================================================