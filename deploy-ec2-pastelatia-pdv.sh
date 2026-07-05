#!/bin/bash

if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Erro: Arquivo .env do script não encontrado!"
    exit 1
fi

echo "Atualizando pacotes do sistema..."
echo "${password_user}" | sudo -S apt upgrade -y
sleep 3

if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_BACKEND_PDV}$" && \
   docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_FRONTEND_PDV}$"; then
    echo "Containers encontrados. Sistema já implantado. Parando o processo de deploy."
    exit 0
fi

echo "Os containers não foram encontrados. Iniciando processo de deploy..."
sleep 3

echo "${PASSWORD_DOCKER}" | docker login -u "${USER_DOCKER}" --password-stdin

if [ $? -eq 0 ]; then
    echo "Autenticado no Docker Hub com sucesso."
    sleep 3
else
    echo "Erro na autenticação do Docker Hub. Abortando."
    exit 1
fi

echo "Baixando imagens atualizadas..."
docker pull "${IMAGE_BACKEND_PDV}" && docker pull "${IMAGE_FRONTEND_PDV}"  

if [ $? -eq 0 ]; then
    echo "Imagens baixadas com sucesso."
    sleep 3
else
    echo "Erro ao baixar as imagens (Verifique as permissões do repositório privado). Abortando."
    exit 1
fi

echo "Executando deploy com Compose Production..."
docker compose -f "${DOCKER_COMPOSE_PRD}" --env-file .env up -d
sleep 3

echo "Deploy realizado com sucesso!"