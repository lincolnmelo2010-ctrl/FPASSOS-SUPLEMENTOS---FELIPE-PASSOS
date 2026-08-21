# FPassos Suplementos — Felipe Passos

Repositório oficial do site FPassos Suplementos.

## Produção atual

- Entrypoint único do Worker: `src/production.js`
- Backend: `src/backend.js`
- Configuração de deploy: `wrangler.jsonc`
- Hospedagem: Cloudflare Workers
- Frontend público: lido do KV `FPASSOS_FRONTEND_CODE`

### Regra de versões

Sempre manter apenas a versão atual no branch principal. Ao substituir uma versão, primeiro confirmar que a nova está completa e apontada no `wrangler.jsonc`; somente depois remover o arquivo antigo. Não criar arquivos paralelos `v2`, `v3`, `v6`, `v7` etc. salvo se houver pedido explícito para preservar uma versão antiga.

### Regra de segurança do frontend

Atualizações de preço/status não devem substituir imagens, layout, carrinho, e-mail, frete ou pagamento. Imagens devem ser restauradas/publicadas separadamente para evitar sobrescrever o frontend atual.

## Segurança

Tokens privados do Mercado Pago e Melhor Envio nunca devem ser armazenados neste repositório público. Eles devem ficar em Secrets/Environment Variables da Cloudflare.
