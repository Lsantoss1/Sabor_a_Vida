Deploy rápido da Cloud Function para gerenciar claims `admin`

Requisitos:

- Node.js instalado (>=16/18)
- Firebase CLI instalado e autenticado (`npm i -g firebase-tools` e `firebase login`)
- Projeto Firebase configurado localmente (`firebase init functions` ou `firebase use --add`)

Passos resumidos:

1. Posicione-se na raiz do projeto (onde está `functions/`) e instale dependências:

```bash
cd functions
npm install
```

2. Defina o segredo que protege o endpoint (substitua `MEU_SEGREDO_FORTE`):

```bash
firebase functions:config:set admin.secret="MEU_SEGREDO_FORTE"
```

3. Deploy da função (na raiz do projeto):

```bash
firebase deploy --only functions:api
```

4. Usar a função (exemplo com `curl`):

```bash
# adicionar admin por email
curl -X POST "https://us-central1-YOUR_PROJECT.cloudfunctions.net/api/setAdmin" \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: MEU_SEGREDO_FORTE" \
  -d '{"email":"usuario@exemplo.com", "admin": true}'

# remover admin (set null)
curl -X POST "https://us-central1-YOUR_PROJECT.cloudfunctions.net/api/setAdmin" \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: MEU_SEGREDO_FORTE" \
  -d '{"email":"usuario@exemplo.com", "admin": false}'
```

Notas:

- A URL real da função aparece no output do `firebase deploy`; substitua `https://.../api/setAdmin` pela URL do seu deploy.
- Após atribuir claim, o usuário precisa sair e entrar novamente no cliente para que o token JWT seja renovado contendo o claim.
- Proteja o `MEU_SEGREDO_FORTE` e nunca o coloque em código público.

Ajuda extra:

- Se quiser, eu testo a chamada `curl` (mas precisarei da URL pública e do segredo). Não compartilhe segredos em chat público; use este espaço apenas se confiar.
