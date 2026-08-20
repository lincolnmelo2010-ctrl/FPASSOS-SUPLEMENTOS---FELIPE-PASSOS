// FPassos — ajuste visual isolado do carrinho + e-mail público do rodapé.
// Não altera catálogo, preços, imagens, frete, pagamento ou regras do checkout.
import current from './sync_frontend_contact_email.js';

const RELEASE = '2026-08-20-footer-cart-v2';
const OLD_EMAIL = 'felipefpassos@hotmail.com';
const NEW_EMAIL = 'contato@fpassossuplementos.com.br';
const MARKER = 'FPASSOS_CART_HIGHLIGHT_V2';

const CART_APPEND = `\n\n/* ${MARKER} */\n(()=>{\n'use strict';\nif(!document.getElementById('fp-cart-highlight-v2-style')){\n  const style=document.createElement('style');\n  style.id='fp-cart-highlight-v2-style';\n  style.textContent=\`\n  .header-cart{transition:background .18s ease,color .18s ease,box-shadow .18s ease,transform .18s ease!important}\n  .header-cart.fp-has-items{background:var(--gold)!important;color:#050505!important;box-shadow:0 0 0 2px rgba(255,196,0,.22),0 8px 24px rgba(255,196,0,.22)!important}\n  .header-cart.fp-has-items span,.header-cart.fp-has-items b{color:#050505!important}\n  .header-cart.fp-has-items i{background:#1268e8!important;color:#fff!important;border:2px solid #fff!important;min-width:28px!important;height:28px!important;padding:0 7px!important;font-size:15px!important;line-height:1!important;font-weight:1000!important;box-shadow:0 3px 10px rgba(18,104,232,.45)!important}\n  \`;\n  document.head.appendChild(style);\n}\nlet fpCartV2Scheduled=false;\nfunction fpCartV2Update(){\n  fpCartV2Scheduled=false;\n  const cart=document.querySelector('.header-cart');\n  if(!cart)return;\n  const badge=cart.querySelector('i');\n  const count=parseInt(String(badge?.textContent||'0').replace(/\\D/g,''),10)||0;\n  cart.classList.toggle('fp-has-items',count>0);\n}\nfunction fpCartV2Schedule(){if(fpCartV2Scheduled)return;fpCartV2Scheduled=true;requestAnimationFrame(fpCartV2Update)}\nnew MutationObserver(fpCartV2Schedule).observe(document.documentElement,{subtree:true,childList:true,characterData:true});\ndocument.addEventListener('click',fpCartV2Schedule,true);\nfpCartV2Schedule();\n})();\n`;

async function syncFooterAndCart(env) {
  if (!env.FPASSOS_FRONTEND_CODE || !env.FPASSOS_STORE) return;
  const marker = `frontend:published:${RELEASE}`;
  if (await env.FPASSOS_STORE.get(marker)) return;

  const [indexHtml, checkoutJs] = await Promise.all([
    env.FPASSOS_FRONTEND_CODE.get('index.html'),
    env.FPASSOS_FRONTEND_CODE.get('fpassos-checkout.js')
  ]);
  if (!indexHtml) throw new Error('index.html não encontrado no KV do frontend.');
  if (!checkoutJs) throw new Error('fpassos-checkout.js não encontrado no KV do frontend.');

  let nextIndex = indexHtml;
  if (nextIndex.includes(OLD_EMAIL)) {
    nextIndex = nextIndex.split(OLD_EMAIL).join(NEW_EMAIL);
  }

  let nextCheckout = checkoutJs;
  if (!nextCheckout.includes(MARKER)) {
    nextCheckout += CART_APPEND;
  }

  await Promise.all([
    nextIndex !== indexHtml ? env.FPASSOS_FRONTEND_CODE.put('index.html', nextIndex) : Promise.resolve(),
    nextCheckout !== checkoutJs ? env.FPASSOS_FRONTEND_CODE.put('fpassos-checkout.js', nextCheckout) : Promise.resolve()
  ]);

  await env.FPASSOS_STORE.put(marker, new Date().toISOString());
}

export default {
  async fetch(request, env, ctx) {
    try { await syncFooterAndCart(env); } catch (error) { console.error('Falha no ajuste de rodapé/carrinho v2:', error); }
    return current.fetch(request, env, ctx);
  }
};
