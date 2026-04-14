const express = require('express');
const { exec } = require('child_process');
const app = express();

// Recupera il token dalla variabile d'ambiente impostata nel compose
const TOKEN = process.env.GITHUB_TOKEN;
const TARGET_DIR = "Progetto-Informatica";

app.post('/run-deploy', (req, res) => {
    // URL dinamico con il token segreto
    const REPO_URL = `https://${TOKEN}@github.com/albe0x/Progetto-Informatica.git`;

    const command = `
        if [ ! -d "${TARGET_DIR}" ]; then
            git clone ${REPO_URL} ${TARGET_DIR}
        fi
        cd ${TARGET_DIR} && bash serverDeploy.sh
    `;

    exec(command, (error, stdout, stderr) => {
        const output = stdout + (stderr ? "\n--- LOG ---\n" + stderr : "");
        if (error) return res.status(500).send(`<h2>Errore</h2><pre>${output}</pre>`);
        res.send(`<h2>Successo</h2><pre>${output}</pre>`);
    });
});

// ... resto del codice (app.get e app.listen) identico a prima ...const express = require('express');
const { exec } = require('child_process');
const app = express();

const REPO_URL = "https://github.com/albe0x/Progetto-Informatica.git";
const TARGET_DIR = "Progetto-Informatica";

app.get('/', (req, res) => {
    res.send(`
        <body style="text-align:center; font-family:sans-serif; padding-top:100px; background:#f4f4f4;">
            <div style="display:inline-block; background:white; padding:40px; border-radius:15px; shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <h1>🚀 GitHub Deployer</h1>
                <p>Progetto: <b>${TARGET_DIR}</b></p>
                <form action="/run-deploy" method="POST">
                    <button type="submit" style="padding:15px 30px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer; font-size:18px;">
                        ESEGUI PULL E RESTART
                    </button>
                </form>
            </div>
        </body>
    `);
});

app.post('/run-deploy', (req, res) => {
    // Logica: se non esiste clona, altrimenti entra ed esegue lo script auto-aggiornante
    const command = `
        if [ ! -d "${TARGET_DIR}" ]; then
            git clone ${REPO_URL} ${TARGET_DIR}
        fi
        cd ${TARGET_DIR} && bash serverDeploy.sh
    `;

    exec(command, (error, stdout, stderr) => {
        const output = stdout + (stderr ? "\n--- LOG ---\n" + stderr : "");
        if (error) return res.status(500).send(`<h2>Errore</h2><pre>${output}</pre><a href="/">Indietro</a>`);
        res.send(`<h2>Deploy Completato!</h2><pre>${output}</pre><a href="/">Indietro</a>`);
    });
});

app.listen(8080, '0.0.0.0', () => console.log('Runner pronto su porta 8080'));
