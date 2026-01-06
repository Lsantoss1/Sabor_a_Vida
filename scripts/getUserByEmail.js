#!/usr/bin/env node
/*
  scripts/getUserByEmail.js
  Uso:
    node scripts/getUserByEmail.js --serviceAccount=./scripts/serviceAccountKey.json --email=user@example.com

  Esse script usa Firebase Admin SDK para buscar o usuário por email e imprimir informações básicas
  (uid, email, disabled, customClaims). Útil para checar se o usuário existe e se a claim `admin` foi aplicada.
*/

const admin = require("firebase-admin");
const fs = require("fs");

function getArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

async function main() {
  const serviceAccountPath =
    getArg("serviceAccount") || "./scripts/serviceAccountKey.json";
  const email = getArg("email");

  if (!email) {
    console.error(
      "Uso: node scripts/getUserByEmail.js --serviceAccount=./scripts/serviceAccountKey.json --email=user@example.com"
    );
    process.exit(1);
  }

  if (!fs.existsSync(serviceAccountPath)) {
    console.error(
      "Arquivo de service account não encontrado em:",
      serviceAccountPath
    );
    process.exit(1);
  }

  const serviceAccount = require(serviceAccountPath);

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e) {
    // se já inicializado, ignora
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log("Usuário encontrado:");
    console.log(" UID:", user.uid);
    console.log(" Email:", user.email);
    console.log(" EmailVerified:", user.emailVerified);
    console.log(" Disabled:", user.disabled);
    console.log(" CustomClaims:", user.customClaims);
    process.exit(0);
  } catch (err) {
    console.error("Erro ao buscar usuário:", err.message || err);
    process.exit(1);
  }
}

main();
