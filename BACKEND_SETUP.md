# FPassos API — Melhor Envio + Mercado Pago

Backend Cloudflare Worker separado do site estático da FPassos.

## O que este Worker faz

- Recalcula o carrinho no servidor com a tabela oficial de preços.
- Envia peso, dimensões, valor e quantidade de cada produto ao Melhor Envio.
- Usa `custom_price` e `custom_delivery_time` quando disponíveis.
- Mantém a cotação por 30 minutos em KV.
- Processa pagamento do Mercado Pago via `/v1/payments` com `X-Idempotency-Key`.
- Recebe Webhooks do Mercado Pago e valida assinatura quando o secret estiver configurado.
- Faz OAuth2 do Melhor Envio e renova o access token.

## Binding obrigatório

Criar um namespace Workers KV e vinculá-lo ao Worker com o nome:

`FPASSOS_STORE`

## Secrets obrigatórios

Adicionar em **Settings > Variables and Secrets** do `fpassos-api`:

- `MERCADO_PAGO_ACCESS_TOKEN`
- `MELHOR_ENVIO_CLIENT_ID`
- `MELHOR_ENVIO_CLIENT_SECRET`

Recomendado:

- `MERCADO_PAGO_WEBHOOK_SECRET`

Nunca salve esses valores no GitHub.

## Variáveis não secretas

Já previstas no `wrangler.jsonc`:

- `ORIGIN_ZIP=04236290`
- `FRONTEND_ORIGINS=https://fpassos-suplementos.lincolnmelo2010.workers.dev`
- `MELHOR_ENVIO_USER_AGENT=FPassos Suplementos (felipefpassos@hotmail.com)`
- `SHIPPING_HANDLING_FEE=0`
- `SHIPPING_EXTRA_DAYS=0`

## Melhor Envio

Callback a cadastrar no aplicativo do Melhor Envio:

`https://fpassos-api.lincolnmelo2010.workers.dev/api/melhor-envio/callback`

Após inserir Client ID/Secret e criar o KV, abrir no navegador:

`https://fpassos-api.lincolnmelo2010.workers.dev/api/melhor-envio/connect`

O escopo solicitado é somente `shipping-calculate`.

## Mercado Pago

Webhook:

`https://fpassos-api.lincolnmelo2010.workers.dev/api/mercadopago/webhook`

A Public Key permanece no frontend. O Access Token fica apenas como Secret no Worker.

## Teste rápido

Abrir:

`https://fpassos-api.lincolnmelo2010.workers.dev/api/health`

O retorno deve indicar `ok: true`. Antes das credenciais, os campos de Mercado Pago/Melhor Envio aparecerão como `false`.
