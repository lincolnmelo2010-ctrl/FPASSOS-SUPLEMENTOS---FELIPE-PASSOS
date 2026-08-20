// FPassos — destaque visual do carrinho quando houver itens.
// Alteração isolada: não muda preços, catálogo, imagens, frete, pagamento ou lógica do carrinho.
import current from './sync_frontend_v6_toast.js';

const RELEASE = '2026-08-20-cart-highlight-v1';
const MARKER = 'FPASSOS_CART_HIGHLIGHT_V1';
const APPEND = `\n\n/* ${MARKER} */\n(()=>{\n'use strict';\nif(document.getElementById('fp-cart-highlight-style')) return;\nconst style=document.createElement('style');\nstyle.id='fp-cart-highlight-style';\nstyle.textContent=\`\n.header-cart{transition:background .18s ease,color .18s ease,box-shadow .18s ease,transform .18s ease}\n.header-cart.fp-has-items{background:var(--gold)!important;color:#050505!important;box-shadow:0 0 0 2px rgba(255,196,0,.22),0 8px 24px rgba(255,196,0,.18)}\n.header-cart.fp-has-items i{background:#050505!important;color:var(--gold)!important;border:2px solid var(--gold);min-width:27px;height:27px;padding:0 6px;font-size:14px!important;line-height:1;font-weight:1000}\n\`;\ndocument.head.appendChild(style);\nlet scheduled=false;\nfunction update(){\n  scheduled=false;\n  const cart=document.querySelector('.header-cart');\n  if(!cart)return;\n  const badge=cart.querySelector('i');\n  const count=parseInt(String(badge?.textContent||'0').replace(/\\D/g,''),10)||0;\n  cart.classList.toggle('fp-has-items',count>0);\n}\nfunction schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(update)}\nnew MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,characterData:true});\ndocument.addEventListener('click',schedule,true);\nschedule();\n})();\n`;

async function syncHighlight(env) {
  if (!env.FPASSOS_FRONTEND_CODE || !env.FPASSOS_STORE) return;
  const marker = `frontend:published:${RELEASE}`;
  if (await env.FPASSOS_STORE.get(marker)) return;

  const checkoutJs = await env.FPASSOS_FRONTEND_CODE.get('fpassos-checkout.js');
  if (!checkoutJs) throw new Error('fpassos-checkout.js não encontrado no KV do frontend.');

  if (!checkoutJs.includes(MARKER)) {
    await env.FPASSOS_FRONTEND_CODE.put('fpassos-checkout.js', checkoutJs + APPEND);
  }
  await env.FPASSOS_STORE.put(marker, new Date().toISOString());
}

export default {
  async fetch(request, env, ctx) {
    try { await syncHighlight(env); } catch (error) { console.error('Falha ao publicar destaque do carrinho:', error); }
    return current.fetch(request, env, ctx);
  }
};
