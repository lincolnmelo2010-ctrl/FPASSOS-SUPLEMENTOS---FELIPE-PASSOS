# FPassos API — Melhor Envio + Mercado Pago

Backend Cloudflare Worker separado do site estático da FPassos.

## Endereços planejados de produção

- Loja: `https://fpassossuplementos.com.br`
- Loja (www): `https://www.fpassossuplementos.com.br`
- API: `https://api.fpassossuplementos.com.br`

Enquanto o domínio próprio não estiver ativo, o Worker continua disponível pelo endereço `workers.dev` da conta.

## O que este Worker faz

- Recalcula o carrinho no servidor com a tabela oficial de preços.
- Envia peso, dimensões, valor e quantidade de cada produto ao Melhor Envio.
- Mantém a cotação por 30 minutos em KV.
- Processa pagamentos do Mercado Pago via `/v1/payments` com `X-Idempotency-Key`.
- Recebe Webhooks do Mercado Pago e valida assinatura quando `MERCADO_PAGO_WEBHOOK_SECRET` estiver configurado.
- Faz OAuth2 do Melhor Envio e renova o access token.

## Worker e KV

Worker: `loja-fpassos-suplementos`

Binding KV obrigatório:

`FPASSOS_STORE`

## Secrets / variáveis privadas

Cadastrar em **Settings > Variables and Secrets** do Worker:

- `MERCADO_PAGO_ACCESS_TOKEN` — Secret
- `MELHOR_ENVIO_CLIENT_SECRET` — Secret
- `MERCADO_PAGO_WEBHOOK_SECRET` — Secret recomendado quando o Webhook for ativado

O `MELHOR_ENVIO_CLIENT_ID` é uma variável comum (não secreta).

Nunca salve tokens, senhas ou Client Secrets no GitHub.

## Variáveis de execução

O `wrangler.jsonc` contém:

- `ORIGIN_ZIP=04236290`
- `FRONTEND_ORIGINS` com o domínio final e endereços temporários da transição
- `MELHOR_ENVIO_USER_AGENT`
- `MELHOR_ENVIO_BASE_URL=https://sandbox.melhorenvio.com.br` enquanto os testes estiverem no Sandbox
- `MELHOR_ENVIO_CLIENT_ID=11242` para o aplicativo atual do Sandbox
- `SHIPPING_HANDLING_FEE=0`
- `SHIPPING_EXTRA_DAYS=0`

## Melhor Envio

No domínio final, o callback de produção será:

`https://api.fpassossuplementos.com.br/api/melhor-envio/callback`

Conexão OAuth:

`https://api.fpassossuplementos.com.br/api/melhor-envio/connect`

Status:

`https://api.fpassossuplementos.com.br/api/melhor-envio/status`

O escopo solicitado pelo backend é `shipping-calculate`.

Antes de produção, trocar o aplicativo/credenciais do Sandbox pelas credenciais de produção e remover o `MELHOR_ENVIO_BASE_URL` de Sandbox.

## Mercado Pago

Webhook final:

`https://api.fpassossuplementos.com.br/api/mercadopago/webhook`

A Public Key permanece no frontend. O Access Token fica apenas como Secret no Worker.

## Teste rápido

Após ativar `api.fpassossuplementos.com.br`, abrir:

`https://api.fpassossuplementos.com.br/api/health`

O retorno esperado deve indicar `ok: true`, `store: true` e `mercado_pago: true`. O campo `melhor_envio` só fica `true` após concluir o OAuth.
