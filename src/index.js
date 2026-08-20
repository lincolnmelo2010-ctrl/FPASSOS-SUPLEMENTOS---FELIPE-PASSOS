// FPassos Suplementos — API Worker v3
// Backend separado para: Melhor Envio (cotação por produtos + OAuth2) e Mercado Pago Payment Brick.
// Nenhuma credencial secreta deve ser colocada neste arquivo ou no GitHub.

const PRODUCTS = {
  1: { name: "Thermo Abdomen 120 cápsulas", price: 44.9, weight: 0.25, height: 16, width: 9, length: 9 },
  2: { name: "Whey Test-Boost 900g Baunilha", price: 119.9, weight: 1.08, height: 31, width: 22, length: 10 },
  3: { name: "Whey Test-Boost 900g Chocolate", price: 119.9, weight: 1.08, height: 31, width: 22, length: 10 },
  4: { name: "Pure Protein Concentrated / Isolated 1,8kg - Baunilha", price: 169.9, weight: 2.05, height: 38, width: 27, length: 13 },
  42: { name: "Pure Protein Concentrated / Isolated 1,8kg - Cookies", price: 169.9, weight: 2.05, height: 38, width: 27, length: 13 },
  43: { name: "Pure Protein Concentrated / Isolated 1,8kg - Chocolate", price: 169.9, weight: 2.05, height: 38, width: 27, length: 13 },
  5: { name: "Refil 100% Whey 900g Cookies & Cream", price: 129.9, weight: 1.08, height: 31, width: 22, length: 10 },
  6: { name: "100% Whey Crush 900g Doce de Leite", price: 142.99, weight: 1.12, height: 27, width: 18, length: 18 },
  8: { name: "100% Whey Crush 900g Chocolate", price: 142.99, weight: 1.12, height: 27, width: 18, length: 18 },
  9: { name: "Whey 100% HD 900g Morango", price: 129.9, weight: 1.08, height: 31, width: 22, length: 10 },
  10: { name: "Whey 100% HD 900g Chocolate", price: 129.9, weight: 1.08, height: 31, width: 22, length: 10 },
  11: { name: "Refil 100% Whey 900g Baunilha", price: 129.9, weight: 1.08, height: 31, width: 22, length: 10 },
  12: { name: "Best Whey Toddy 900g", price: 330, unavailable: true, weight: 1.12, height: 27, width: 18, length: 18 },
  13: { name: "Best Whey 900g Original", price: 330, unavailable: true, weight: 1.12, height: 27, width: 18, length: 18 },
  14: { name: "Best Whey 900g Churros", price: 219.99, weight: 1.12, height: 27, width: 18, length: 18 },
  15: { name: "Best Whey 900g Abacaxi Frapê", price: 219.99, weight: 1.12, height: 27, width: 18, length: 18 },
  16: { name: "Chef Whey 907g Morango com Chantilly", price: 197.99, weight: 1.12, height: 28, width: 18, length: 18 },
  17: { name: "Chef Whey 907g Mousse de Coco", price: 197.99, weight: 1.12, height: 28, width: 18, length: 18 },
  18: { name: "Creatine Max Titanium 300g", price: 64.5, weight: 0.43, height: 14, width: 12, length: 12 },
  19: { name: "Creatine Pure Dark Lab 300g", price: 49.9, weight: 0.43, height: 14, width: 12, length: 12 },
  20: { name: "Creatine Black Skull 150g", price: 47.85, weight: 0.25, height: 12, width: 10, length: 10 },
  21: { name: "Creatine Turbo Black Skull 300g", price: 54.99, weight: 0.43, height: 14, width: 12, length: 12 },
  22: { name: "Creatina Max Titanium 7Belo 300g", price: 59.9, weight: 0.43, height: 14, width: 12, length: 12 },
  23: { name: "Optimum Micronized Creatine 300g", price: 164.99, weight: 0.43, height: 14, width: 12, length: 12 },
  24: { name: "Darkness Creapure 200g", price: 139.99, weight: 0.33, height: 13, width: 11, length: 11 },
  25: { name: "Profit Creatine 300g", price: 59.9, weight: 0.43, height: 14, width: 12, length: 12 },
  26: { name: "Dynamo Pure Creatine 300g", price: 64.9, weight: 0.43, height: 14, width: 12, length: 12 },
  27: { name: "Integralmédica Glutamine 300g", price: 59.8, weight: 0.43, height: 14, width: 12, length: 12 },
  28: { name: "Max Titanium L-Glutamina 300g", price: 79.9, weight: 0.43, height: 14, width: 12, length: 12 },
  29: { name: "DUX Glutamina 300g", price: 69.9, weight: 0.43, height: 14, width: 12, length: 12 },
  30: { name: "Muscle Labs Glutamina 150g", price: 29.9, weight: 0.25, height: 12, width: 10, length: 10 },
  31: { name: "Lauton Colágeno 60 cápsulas", price: 49.4, weight: 0.18, height: 15, width: 8, length: 8 },
  32: { name: "Max Titanium Colágeno 240g", price: 79.9, weight: 0.36, height: 14, width: 11, length: 11 },
  33: { name: "Fisionutri Colágeno 60 tabletes", price: 27.9, weight: 0.18, height: 15, width: 8, length: 8 },
  34: { name: "Nutrata Ômega 3 60 cápsulas", price: 36.99, weight: 0.18, height: 15, width: 8, length: 8 },
  35: { name: "ApisNutri Ômega 3 120 cápsulas", price: 89.5, weight: 0.24, height: 16, width: 9, length: 9 },
  36: { name: "ApisNutri Colágeno II 60 comprimidos", price: 31.9, weight: 0.18, height: 15, width: 8, length: 8 }
};

const digits = (value) => String(value || '').replace(/\D/g, '');
const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

function allowedOrigins(env) {
  const configured = String(env.FRONTEND_ORIGINS || 'https://fpassos-suplementos.lincolnmelo2010.workers.dev')
    .split(',').map((x) => x.trim()).filter(Boolean);
  return new Set(configured);
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  const allowed = allowedOrigins(env);
  const headers = {
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
  if (origin && allowed.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(corsHeaders(request, env))) headers.set(k, v);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders
    }
  });
}

function validateCart(raw) {
  if (!Array.isArray(raw) || raw.length === 0) throw new Error('Carrinho vazio.');
  if (raw.length > 50) throw new Error('Carrinho excede o limite de itens.');

  const cart = raw.map((item) => {
    const id = Number(item.id);
    const product = PRODUCTS[id];
    if (!product) throw new Error(`Produto ${id} inválido.`);
    if (product.unavailable) throw new Error(`Produto ${id} indisponível.`);
    const quantity = Number.parseInt(item.quantity, 10);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new Error(`Quantidade inválida para o produto ${id}.`);
    }
    return { id, quantity };
  });

  const subtotal = round2(cart.reduce((sum, item) => sum + PRODUCTS[item.id].price * item.quantity, 0));
  return { cart, subtotal };
}

function publicCart(cart) {
  return cart.map((item) => ({ id: item.id, quantity: item.quantity, name: PRODUCTS[item.id].name, unit_price: PRODUCTS[item.id].price }));
}

function storeRequired(env) {
  if (!env.FPASSOS_STORE) throw new Error('Binding KV FPASSOS_STORE ainda não foi configurado.');
  return env.FPASSOS_STORE;
}

function meBase(env) { return String(env.MELHOR_ENVIO_BASE_URL || 'https://www.melhorenvio.com.br').replace(/\/$/, ''); }
function meUserAgent(env) { return env.MELHOR_ENVIO_USER_AGENT || 'FPassos Suplementos (felipefpassos@hotmail.com)'; }
function meHeaders(token, env) { return { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'User-Agent': meUserAgent(env) }; }

async function readTokens(env) {
  try { return JSON.parse(await storeRequired(env).get('melhorenvio:tokens') || 'null'); } catch { return null; }
}
async function saveTokens(env, tokens) {
  tokens.expires_at = Date.now() + Number(tokens.expires_in || 2592000) * 1000;
  await storeRequired(env).put('melhorenvio:tokens', JSON.stringify(tokens));
  return tokens;
}
async function refreshMeToken(env, tokens) {
  if (!tokens?.refresh_token || !env.MELHOR_ENVIO_CLIENT_ID || !env.MELHOR_ENVIO_CLIENT_SECRET) throw new Error('Melhor Envio precisa ser autorizado novamente.');
  const body = new URLSearchParams({ grant_type: 'refresh_token', client_id: String(env.MELHOR_ENVIO_CLIENT_ID), client_secret: env.MELHOR_ENVIO_CLIENT_SECRET, refresh_token: tokens.refresh_token });
  const response = await fetch(`${meBase(env)}/oauth/token`, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': meUserAgent(env) }, body });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error_description || 'Falha ao renovar Melhor Envio.');
  return saveTokens(env, data);
}
async function getMeToken(env, forceRefresh = false) {
  let tokens = await readTokens(env);
  if (tokens?.access_token) {
    if (forceRefresh || (tokens.expires_at && tokens.expires_at - Date.now() < 21600000)) tokens = await refreshMeToken(env, tokens);
    return tokens.access_token;
  }
  if (env.MELHOR_ENVIO_ACCESS_TOKEN) return env.MELHOR_ENVIO_ACCESS_TOKEN;
  const error = new Error('Melhor Envio ainda não conectado.');
  error.code = 'MELHOR_ENVIO_NOT_CONNECTED';
  throw error;
}
async function meFetch(env, path, init = {}) {
  let token = await getMeToken(env);
  let response = await fetch(`${meBase(env)}${path}`, { ...init, headers: { ...meHeaders(token, env), ...(init.headers || {}) } });
  if (response.status === 401 && (await readTokens(env))?.refresh_token) {
    token = await getMeToken(env, true);
    response = await fetch(`${meBase(env)}${path}`, { ...init, headers: { ...meHeaders(token, env), ...(init.headers || {}) } });
  }
  return response;
}

async function shippingQuote(request, env) {
  try {
    const body = await request.json();
    const postalCode = digits(body.postal_code);
    if (postalCode.length !== 8) return json({ error: 'CEP inválido.' }, 422);
    const { cart, subtotal } = validateCart(body.cart);
    const origin = digits(env.ORIGIN_ZIP || '04236290');
    if (origin.length !== 8) return json({ error: 'CEP de origem não configurado.' }, 500);
    const products = cart.map((item) => { const p = PRODUCTS[item.id]; return { id: String(item.id), width: p.width, height: p.height, length: p.length, weight: p.weight, insurance_value: round2(p.price), quantity: item.quantity }; });
    const response = await meFetch(env, '/api/v2/me/shipment/calculate', { method: 'POST', body: JSON.stringify({ from: { postal_code: origin }, to: { postal_code: postalCode }, products, options: { receipt: false, own_hand: false } }) });
    const data = await response.json();
    if (!response.ok) return json({ error: data.message || data.error || 'Melhor Envio recusou a cotação.', details: data }, response.status);
    const handlingFee = Math.max(0, Number(env.SHIPPING_HANDLING_FEE || 0));
    const extraDays = Math.max(0, Number(env.SHIPPING_EXTRA_DAYS || 0));
    const services = (Array.isArray(data) ? data : []).filter((service) => !service.error && (service.custom_price ?? service.price) != null).map((service) => ({ id: String(service.id), name: service.name || 'Entrega', company: service.company?.name || '', price: round2(Number(service.custom_price ?? service.price) + handlingFee), delivery_time: Number(service.custom_delivery_time ?? service.delivery_time ?? 0) + extraDays })).sort((a, b) => a.price - b.price);
    if (services.length === 0) return json({ error: 'Nenhuma transportadora retornou cotação para este carrinho/CEP.' }, 422);
    const quoteId = crypto.randomUUID();
    await storeRequired(env).put(`quote:${quoteId}`, JSON.stringify({ postalCode, cart, subtotal, services, created_at: Date.now() }), { expirationTtl: 1800 });
    return json({ quote_id: quoteId, subtotal, services });
  } catch (error) {
    return json({ error: error.message || 'Erro no frete.', code: error.code || undefined }, error.code === 'MELHOR_ENVIO_NOT_CONNECTED' ? 503 : 400);
  }
}

async function meConnect(request, env) {
  if (!env.MELHOR_ENVIO_CLIENT_ID || !env.MELHOR_ENVIO_CLIENT_SECRET) return json({ error: 'Cadastre MELHOR_ENVIO_CLIENT_ID e MELHOR_ENVIO_CLIENT_SECRET como Secrets.' }, 503);
  const url = new URL(request.url);
  const callback = `${url.origin}/api/melhor-envio/callback`;
  const state = crypto.randomUUID();
  await storeRequired(env).put(`oauth:${state}`, '1', { expirationTtl: 600 });
  const auth = new URL(`${meBase(env)}/oauth/authorize`);
  auth.searchParams.set('client_id', String(env.MELHOR_ENVIO_CLIENT_ID));
  auth.searchParams.set('redirect_uri', callback);
  auth.searchParams.set('response_type', 'code');
  auth.searchParams.set('state', state);
  auth.searchParams.set('scope', 'shipping-calculate');
  return Response.redirect(auth.toString(), 302);
}

async function meCallback(request, env) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    if (!code || !state || !(await storeRequired(env).get(`oauth:${state}`))) return new Response('Autorização inválida ou expirada.', { status: 400 });
    await storeRequired(env).delete(`oauth:${state}`);
    const callback = `${url.origin}/api/melhor-envio/callback`;
    const body = new URLSearchParams({ grant_type: 'authorization_code', client_id: String(env.MELHOR_ENVIO_CLIENT_ID), client_secret: env.MELHOR_ENVIO_CLIENT_SECRET, redirect_uri: callback, code });
    const response = await fetch(`${meBase(env)}/oauth/token`, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': meUserAgent(env) }, body });
    const data = await response.json();
    if (!response.ok) return new Response(`Falha na autorização: ${data.message || data.error_description || response.status}`, { status: 400 });
    await saveTokens(env, data);
    return new Response('<!doctype html><meta charset="utf-8"><title>FPassos</title><style>body{font-family:Arial;background:#080a0d;color:#fff;display:grid;place-items:center;height:100vh;margin:0}div{max-width:600px;text-align:center;padding:24px}h1{color:#ffc400}</style><div><h1>Melhor Envio conectado ✓</h1><p>A FPassos já pode calcular frete real. Você pode fechar esta página.</p></div>', { headers: { 'content-type': 'text/html; charset=utf-8' } });
  } catch (error) { return new Response(`Erro: ${error.message}`, { status: 500 }); }
}

async function meStatus(env) {
  const tokens = await readTokens(env);
  return json({ connected: Boolean(tokens?.access_token || env.MELHOR_ENVIO_ACCESS_TOKEN), oauth_ready: Boolean(env.MELHOR_ENVIO_CLIENT_ID && env.MELHOR_ENVIO_CLIENT_SECRET), origin_zip: digits(env.ORIGIN_ZIP || '04236290') });
}

function cleanPayer(formData, customer) {
  const payer = { ...(formData?.payer || {}) };
  const parts = String(customer.name || '').trim().split(/\s+/).filter(Boolean);
  payer.email = payer.email || customer.email;
  payer.first_name = payer.first_name || parts[0] || undefined;
  payer.last_name = payer.last_name || parts.slice(1).join(' ') || undefined;
  payer.identification = payer.identification || { type: 'CPF', number: digits(customer.cpf) };
  payer.address = payer.address || { zip_code: digits(customer.zip), street_name: customer.street, street_number: customer.number, neighborhood: customer.neighborhood, city: customer.city, federal_unit: customer.state };
  return payer;
}

async function processPayment(request, env) {
  try {
    if (!env.MERCADO_PAGO_ACCESS_TOKEN) return json({ error: 'MERCADO_PAGO_ACCESS_TOKEN ainda não foi cadastrado como Secret.' }, 503);
    const body = await request.json();
    const quote = JSON.parse(await storeRequired(env).get(`quote:${body.quote_id}`) || 'null');
    if (!quote) return json({ error: 'Cotação de frete expirou. Calcule o CEP novamente.' }, 409);
    const { cart, subtotal } = validateCart(body.cart);
    if (JSON.stringify(cart) !== JSON.stringify(quote.cart)) return json({ error: 'O carrinho mudou após a cotação. Calcule o frete novamente.' }, 409);
    const service = quote.services.find((item) => String(item.id) === String(body.service_id));
    if (!service) return json({ error: 'Opção de frete inválida.' }, 409);
    const customer = body.customer || {};
    const formData = body.form_data || {};
    const total = round2(subtotal + Number(service.price));
    const orderRef = `FP-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const url = new URL(request.url);
    const payment = { transaction_amount: total, description: `FPassos Suplementos - ${cart.reduce((n, item) => n + item.quantity, 0)} item(ns)`, payment_method_id: formData.payment_method_id, payer: cleanPayer(formData, customer), external_reference: orderRef, notification_url: `${url.origin}/api/mercadopago/webhook?source_news=webhooks`, metadata: { quote_id: body.quote_id, shipping_service_id: String(service.id), shipping_service: service.name, shipping_price: Number(service.price) } };
    if (formData.token) payment.token = formData.token;
    if (formData.installments) payment.installments = Number(formData.installments);
    if (formData.issuer_id) payment.issuer_id = Number(formData.issuer_id);
    if (!payment.payment_method_id) return json({ error: 'Meio de pagamento não informado pelo Mercado Pago.' }, 422);
    const response = await fetch('https://api.mercadopago.com/v1/payments', { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`, 'X-Idempotency-Key': crypto.randomUUID() }, body: JSON.stringify(payment) });
    const data = await response.json();
    if (!response.ok) return json({ error: data.message || data.error || 'Mercado Pago recusou a solicitação.', cause: data.cause || data }, response.status);
    const order = { order_reference: orderRef, payment_id: String(data.id), status: data.status, status_detail: data.status_detail, total, subtotal, shipping: service, cart: publicCart(cart), customer, created_at: new Date().toISOString() };
    await storeRequired(env).put(`order:${data.id}`, JSON.stringify(order), { expirationTtl: 15552000 });
    await storeRequired(env).put(`orderref:${orderRef}`, String(data.id), { expirationTtl: 15552000 });
    const transaction = data.point_of_interaction?.transaction_data || {};
    return json({ id: String(data.id), order_reference: orderRef, status: data.status, status_detail: data.status_detail, payment_method_id: data.payment_method_id, pix: { qr_code: transaction.qr_code || null, qr_code_base64: transaction.qr_code_base64 || null }, ticket_url: transaction.ticket_url || data.transaction_details?.external_resource_url || null });
  } catch (error) { return json({ error: error.message || 'Erro ao processar pagamento.' }, 400); }
}

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
async function validMpWebhook(request, env, dataId) {
  if (!env.MERCADO_PAGO_WEBHOOK_SECRET) return true;
  const xSignature = request.headers.get('x-signature') || '';
  const requestId = request.headers.get('x-request-id') || '';
  const parts = Object.fromEntries(xSignature.split(',').map((piece) => piece.trim().split('=')));
  if (!parts.ts || !parts.v1 || !requestId || !dataId) return false;
  const template = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
  return (await hmacHex(env.MERCADO_PAGO_WEBHOOK_SECRET, template)) === parts.v1;
}
async function mpWebhook(request, env) {
  try {
    const url = new URL(request.url);
    let dataId = url.searchParams.get('data.id') || url.searchParams.get('id');
    if (!dataId && request.method === 'POST') { try { const body = await request.clone().json(); dataId = body?.data?.id || body?.id; } catch {} }
    if (!dataId) return new Response('ok');
    if (!(await validMpWebhook(request, env, dataId))) return new Response('invalid signature', { status: 401 });
    if (!env.MERCADO_PAGO_ACCESS_TOKEN) return new Response('missing token', { status: 503 });
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(dataId)}`, { headers: { 'Authorization': `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`, 'Accept': 'application/json' } });
    if (!response.ok) return new Response('ok');
    const payment = await response.json();
    const key = `order:${payment.id}`;
    const old = JSON.parse(await storeRequired(env).get(key) || '{}');
    await storeRequired(env).put(key, JSON.stringify({ ...old, status: payment.status, status_detail: payment.status_detail, updated_at: new Date().toISOString() }), { expirationTtl: 15552000 });
    return new Response('ok');
  } catch { return new Response('ok'); }
}

async function health(env) {
  let melhorEnvio = false;
  try { melhorEnvio = Boolean((await readTokens(env))?.access_token || env.MELHOR_ENVIO_ACCESS_TOKEN); } catch {}
  return json({ ok: true, version: '2026-08-20-api-v3', store: Boolean(env.FPASSOS_STORE), mercado_pago: Boolean(env.MERCADO_PAGO_ACCESS_TOKEN), melhor_envio: melhorEnvio, origin_zip: digits(env.ORIGIN_ZIP || '04236290') });
}

async function dispatch(request, env) {
  const path = new URL(request.url).pathname;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (path === '/api/health') return health(env);
  if (path === '/api/shipping/quote' && request.method === 'POST') return shippingQuote(request, env);
  if (path === '/api/payment' && request.method === 'POST') return processPayment(request, env);
  if (path === '/api/melhor-envio/connect') return meConnect(request, env);
  if (path === '/api/melhor-envio/callback') return meCallback(request, env);
  if (path === '/api/melhor-envio/status') return meStatus(env);
  if (path === '/api/mercadopago/webhook') return mpWebhook(request, env);
  return json({ error: 'Not Found' }, 404);
}

export default {
  async fetch(request, env) {
    const response = await dispatch(request, env);
    const path = new URL(request.url).pathname;
    if (path === '/api/mercadopago/webhook') return response;
    return withCors(response, request, env);
  }
};
