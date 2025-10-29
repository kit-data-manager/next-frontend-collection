## Next Frontend Collection

This repository contains a collection of frontends for the KIT Data Manager service portfolio.

## Build and run as single Docker container

```bash
# 1. Pull the release image
docker pull ghcr.io/kit-data-manager/next-frontend-collection:v0.0.1

# 2. Run container interactively, mounting your environment files
docker run --rm -it \
  -v $(pwd)/.env:/app/.env \
  -v $(pwd)/next.config.js:/app/next.config.js \
  ghcr.io/kit-data-manager/next-frontend-collection:v0.0.1 \
  bash -c "npm run build && npm start"
```

## Include in docker-compose setup

```yaml
version: "3.8"

services:
  nextjs:
    image: ghcr.io/kit-data-manager/next-frontend-collection:v0.0.1
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - ./next.config.js:/app/next.config.js
    command: bash -c "npm run build && npm start"
```