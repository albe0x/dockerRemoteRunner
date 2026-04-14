#!/bin/bash
set -e

echo "--- [STEP 1] Aggiornamento sorgenti ---"
# Siamo già dentro la cartella Progetto-Informatica quando Node lo chiama
git fetch origin
git reset --hard origin/main

echo "--- [STEP 2] Verifica permessi ---"
chmod +x serverDeploy.sh

echo "--- [STEP 3] Riavvio container progetto ---"
# Lancia il compose del progetto (quello che sta qui dentro)
docker compose up --build -d

echo "--- DEPLOY COMPLETATO ---"