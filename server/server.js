const express = require('express');
const { exec } = require('child_process');
const rateLimit = require('express-rate-limit');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Fix: Essential for HTML forms
app.set('trust proxy', 1);

process.loadEnvFile();

// Rate Limiter
const deployLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, 
    max: 5,
    keyGenerator: (req) => req.headers['cf-connecting-ip'] || req.ip,
    handler: (req, res) => {
        res.status(429).send(`
            <body style="text-align:center; font-family:sans-serif; padding-top:100px;">
                <h2>⚠️ Troppe richieste</h2>
                <p>Hai superato il limite di 5 deploy ogni 2 minuti.</p>
                <a href="/">Torna alla Home</a>
            </body>
        `);
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const REPO_URL = process.env.GIT_REPO_URL;
const TARGET_DIR = (process.env.TARGET_DIR != "server" ? process.env.TARGET_DIR : "gitRepository") || "gitRepository";

app.get('/', (req, res) => {
    res.send(`
        <body style="text-align:center; font-family:sans-serif; padding-top:100px; background:#f4f4f4;">
            <div style="display:inline-block; background:white; padding:40px; border-radius:15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <h1>🚀 GitHub Deployer</h1>
                <p>Progetto: <b>${TARGET_DIR}</b></p>
                <form action="/run-deploy" method="POST">
                    <input type="password" name="AUTH_TOKEN" placeholder="Inserisci Token" required 
                           style="padding:10px; margin-bottom:20px; border-radius:5px; border:1px solid #ccc;"><br>
                    <button type="submit" style="padding:15px 30px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer; font-size:18px;">
                        ESEGUI PULL E RESTART
                    </button>
                </form>
            </div>
        </body>
    `);
});

app.post('/run-deploy', deployLimiter, (req, res) => {
    const { AUTH_TOKEN } = req.body;

    // Verify the web access token
    if (!AUTH_TOKEN || AUTH_TOKEN !== process.env.AUTH_TOKEN){
        return res.status(401).send('<h2>Accesso Negato</h2><a href="/">Indietro</a>');
    }

    // 1. Get credentials from your .env
    const USER = process.env.GIT_USERNAME;
    const PAT = process.env.GIT_PASSWORD; // This is your GitHub Personal Access Token

    // 2. Clean the REPO_URL and inject the Token
    // We remove any existing 'https://' then rebuild it with credentials
    const cleanUrl = REPO_URL.replace(/^https?:\/\//, '');
    const AUTH_REPO_URL = `https://${USER}:${PAT}@${cleanUrl}`;

    // 3. Execution Logic
    const command = `
        if [ ! -d "${TARGET_DIR}" ]; then
            git clone ${AUTH_REPO_URL} ${TARGET_DIR}
        else
            cd ${TARGET_DIR} && git pull ${AUTH_REPO_URL}
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