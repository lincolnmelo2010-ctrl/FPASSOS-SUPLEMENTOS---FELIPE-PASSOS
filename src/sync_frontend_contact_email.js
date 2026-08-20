// FPassos — atualiza somente o e-mail público exibido no frontend.
// Não altera o e-mail técnico do Melhor Envio, checkout, preços, catálogo, imagens ou layout.
import current from './sync_frontend_cart_highlight.js';

const RELEASE = '2026-08-20-contact-email-v1';
const OLD_EMAIL = 'felipefpassos@hotmail.com';
const NEW_EMAIL = 'contato@fpassossuplementos.com.br';

async function syncContactEmail(env) {
  if (!env.FPASSOS_FRONTEND_CODE || !env.FPASSOS_STORE) return;
  const marker = `frontend:published:${RELEASE}`;
  if (await env.FPASSOS_STORE.get(marker)) return;

  const indexHtml = await env.FPASSOS_FRONTEND_CODE.get('index.html');
  if (!indexHtml) throw new Error('index.html não encontrado no KV do frontend.');

  let nextIndex = indexHtml;
  if (indexHtml.includes(OLD_EMAIL)) {
    nextIndex = indexHtml.split(OLD_EMAIL).join(NEW_EMAIL);
    await env.FPASSOS_FRONTEND_CODE.put('index.html', nextIndex);
  } else if (!indexHtml.includes(NEW_EMAIL)) {
    console.warn('E-mail antigo não encontrado no frontend; nenhuma alteração aplicada.');
  }

  await env.FPASSOS_STORE.put(marker, new Date().toISOString());
}

export default {
  async fetch(request, env, ctx) {
    try { await syncContactEmail(env); } catch (error) { console.error('Falha ao atualizar e-mail público:', error); }
    return current.fetch(request, env, ctx);
  }
};
