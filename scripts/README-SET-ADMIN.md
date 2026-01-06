Instruções: atribuir claim `admin: true` via Firebase Admin SDK

1. Preparar:

- Faça download da chave JSON da Service Account (Firebase Console -> Project Settings -> Service accounts -> Generate new private key).
- Salve o arquivo como `serviceAccountKey.json` na pasta `scripts/` ou informe o caminho ao rodar o script.

2. Instalar dependência (Node.js):

```bash
npm init -y
npm install firebase-admin
```

3. Executar o script:

- Por email:

```bash
node scripts/setAdminClaim.js --serviceAccount=./scripts/serviceAccountKey.json --email=admin@example.com
```

- Por UID:

```bash
node scripts/setAdminClaim.js --serviceAccount=./scripts/serviceAccountKey.json --uid=USER_UID
```

4. Observações de segurança:

- Não comite a `serviceAccountKey.json` no repositório.
- Atribuir `admin: true` concede privilégios para atualizar/deletar documentos nas regras que verificam `request.auth.token.admin`.
- Para remover a claim, rode:

```js
admin.auth().setCustomUserClaims(uid, null);
```

5. Passos pós-atribuição:

- O cliente autenticado precisará deslogar e logar novamente para que os novos claims sejam refletidos no token JWT.
- Verifique as regras do Firestore para garantir que `update`/`delete` exijam `request.auth.token.admin == true`.
