// FPassos — correção direta no frontend publicado: e-mail do rodapé + destaque do carrinho.
// Não altera catálogo, preços, imagens, frete, pagamento ou regras do checkout.
import current from './sync_frontend_footer_cart_v2.js';

const RELEASE = '2026-08-20-footer-cart-v3';
const OLD_EMAIL = 'felipefpassos@hotmail.com';
const NEW_EMAIL = 'contato@fpassossuplementos.com.br';
const STYLE_MARKER = 'FPASSOS_CART_HIGHLIGHT_V3_STYLE';
const SCRIPT_MARKER = 'FPASSOS_CART_HIGHLIGHT_V3_SCRIPT';

const STYLE = `\n<style id="${STYLE_MARKER}">\n.header-cart{transition:background .18s ease,color .18s ease,box-shadow .18s ease,transform .18s ease!important}\n.header-cart.fp-has-items{background:#ffc400!important;color:#050505!important;border-color:#ffc400!important;box-shadow:0 0 0 2px rgba(255,196,0,.22),0 8px 24px rgba(255,196,0,.24)!important}\n.header-cart.fp-has-items span,.header-cart.fp-has-items b{color:#050505!important}\n.header-cart.fp-has-items i{background:#1268e8!important;color:#fff!important;border:3px solid #fff!important;border-radius:999px!important;display:grid!important;place-items:center!important;min-width:34px!important;height:34px!important;padding:0 8px!important;font-size:18px!important;line-height:1!important;font-weight:1000!important;top:-8px!important;right:-8px!important;box-shadow:0 4px 12px rgba(18,104,232,.48)!important}\n</style>\n`;

const SCRIPT = `\n<script id="${SCRIPT_MARKER}">\n(()=>{\n'use strict';\nlet scheduled=false;\nfunction update(){\n  scheduled=false;\n  const cart=document.querySelector('.header-cart');\n  if(!cart)return;\n  const badge=cart.querySelector('i');\n  const count=parseInt(String(badge?.textContent||'0').replace(/\\D/g,''),10)||0;\n  cart.classList.toggle('fp-has-items',count>0);\n}\nfunction schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(update)}\nnew MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,characterData:true});\ndocument.addEventListener('click',schedule,true);\nschedule();\n})();\n</script>\n`;

async function syncFrontendFooterCartV3(env) {
  if (!env.FPASSOS_FRONTEND_CODE || !env.FPASSOS_STORE) return;
  const marker = `frontend:published:${RELEASE}`;
  if (await env.FPASSOS_STORE.get(marker)) return;

  const indexHtml = await env.FPASSOS_FRONTEND_CODE.get('index.html');
  if (!indexHtml) throw new Error('index.html não encontrado no KV do frontend.');

  let nextIndex = indexHtml;
  if (nextIndex.includes(OLD_EMAIL)) {
    nextIndex = nextIndex.split(OLD_EMAIL).join(NEW_EMAIL);
  }

  if (!nextIndex.includes(STYLE_MARKER)) {
    nextIndex = nextIndex.includes('</head>') ? nextIndex.replace('</head>', `${STYLE}</head>`) : STYLE + nextIndex;
  }
  if (!nextIndex.includes(SCRIPT_MARKER)) {
    nextIndex = nextIndex.includes('</body>') ? nextIndex.replace('</body>', `${SCRIPT}</body>`) : nextIndex + SCRIPT;
  }

  if (nextIndex !== indexHtml) {
    await env.FPASSOS_FRONTEND_CODE.put('index.html', nextIndex);
  }
  await env.FPASSOS_STORE.put(marker, new Date().toISOString());
}

export default {
  async fetch(request, env, ctx) {
    try { await syncFrontendFooterCartV3(env); } catch (error) { console.error('Falha no ajuste direto do rodapé/carrinho v3:', error); }
    return current.fetch(request, env, ctx);
  }
};
