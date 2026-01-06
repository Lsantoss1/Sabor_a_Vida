#!/usr/bin/env node
/*
  scripts/setAdminClaim.js
  Uso:
    node setAdminClaim.js --serviceAccount=./serviceAccountKey.json --email=user@example.com
    ou
    node setAdminClaim.js --serviceAccount=./serviceAccountKey.json --uid=USER_UID

  Nota: este script requer que você tenha uma chave de serviço (Service Account) do Firebase
  com permissões de Admin SDK. Não compartilhe essa chave publicamente.
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
    getArg("serviceAccount") || "./serviceAccountKey.json";
  const email = getArg("email");
  const uid = getArg("uid");

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
    console.error("Falha ao inicializar Admin SDK:", e.message || e);
    process.exit(1);
  }

  try {
    if (!email && !uid) {
      console.log(
        "Uso: node setAdminClaim.js --serviceAccount=./serviceAccountKey.json --email=user@example.com"
      );
      console.log(
        "   ou: node setAdminClaim.js --serviceAccount=./serviceAccountKey.json --uid=USER_UID"
      );
      process.exit(0);
    }

    let targetUid = uid;
    if (email && !targetUid) {
      const user = await admin.auth().getUserByEmail(email);
      targetUid = user.uid;
    }

    if (!targetUid) {
      console.error("UID do usuário não encontrado.");
      process.exit(1);
    }

    await admin.auth().setCustomUserClaims(targetUid, { admin: true });
    console.log(`Claim 'admin: true' atribuída ao usuário UID=${targetUid}`);

    // Para forçar atualização no cliente, é comum que o usuário faça logout/login.
    process.exit(0);
  } catch (error) {
    console.error("Erro ao atribuir claim:", error.message || error);
    process.exit(1);
  }
}

main();
