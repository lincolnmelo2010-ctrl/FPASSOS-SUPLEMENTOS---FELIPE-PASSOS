# FPassos Suplementos — Checklist de publicação

Domínio definitivo: `fpassossuplementos.com.br`

## 1. DNS / Cloudflare

- Adicionar `fpassossuplementos.com.br` à conta Cloudflare.
- Trocar no Registro.br os nameservers pelos dois nameservers informados pela Cloudflare.
- Aguardar a zona ficar **Active** na Cloudflare.
- Vincular o Worker do site a `fpassossuplementos.com.br`.
- Fazer `www.fpassossuplementos.com.br` apontar/redirecionar para o domínio principal.
- Vincular o Worker da API a `api.fpassossuplementos.com.br`.
- Confirmar HTTPS ativo nos três endereços.

## 2. Backend

- Confirmar `/api/health` em `https://api.fpassossuplementos.com.br/api/health`.
- Esperado: `ok: true`, `store: true`, `mercado_pago: true`.
- Confirmar CORS para `fpassossuplementos.com.br` e `www.fpassossuplementos.com.br`.
- Manter os endereços `workers.dev` apenas durante a transição.

## 3. Mercado Pago

- Public Key permanece no frontend.
- `MERCADO_PAGO_ACCESS_TOKEN` permanece como Secret no Worker.
- Configurar Webhook para:
  `https://api.fpassossuplementos.com.br/api/mercadopago/webhook`
- Se o Mercado Pago fornecer assinatura secreta, cadastrar como `MERCADO_PAGO_WEBHOOK_SECRET` no Worker.
- Testar Pix e cartão com uma compra controlada antes de liberar vendas reais.

## 4. Melhor Envio

- O aplicativo atual é de Sandbox e não deve ser usado em produção.
- Criar aplicativo de produção no Melhor Envio.
- Callback de produção:
  `https://api.fpassossuplementos.com.br/api/melhor-envio/callback`
- Substituir Client ID e Client Secret do Sandbox pelos de produção.
- Remover `MELHOR_ENVIO_BASE_URL=https://sandbox.melhorenvio.com.br` para voltar ao endpoint de produção padrão.
- Abrir:
  `https://api.fpassossuplementos.com.br/api/melhor-envio/connect`
- Autorizar a conta e confirmar `/api/melhor-envio/status` com `connected: true`.
- Fazer cotação real de teste com CEP conhecido antes de liberar o checkout.

## 5. Frontend

- Publicar somente o pacote final preparado para o domínio próprio.
- Confirmar que o frontend usa `https://api.fpassossuplementos.com.br` quando aberto no domínio final.
- Testar no computador e celular:
  - catálogo;
  - carrinho;
  - CEP e opções de frete;
  - checkout;
  - Pix;
  - cartão e parcelas;
  - confirmação de pagamento;
  - WhatsApp e links principais.

## 6. Liberação

- Só liberar divulgação pública após um fluxo completo de teste:
  produto → carrinho → CEP → frete → pagamento → confirmação.
- Manter os Secrets apenas na Cloudflare; nunca salvar tokens, senhas ou Client Secrets no GitHub ou no HTML.
