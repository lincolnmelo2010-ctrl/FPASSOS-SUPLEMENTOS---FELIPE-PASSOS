// FPassos — acrescenta apenas a confirmação visual de produto adicionado ao carrinho.
// Não altera preços, imagens, layout, lógica do carrinho, frete ou pagamento.
import current from './sync_frontend_v6.js';

const RELEASE = '2026-08-20-v6-cart-toast-v1';
const TOAST_MARKER = 'FPASSOS_CART_TOAST_V1';
const TOAST_APPEND = `\n\n/* ${TOAST_MARKER} */\n(()=>{\n'use strict';\nlet fpCartToastTimer;\nfunction fpShowCartToast(){\n  let toast=document.getElementById('fp-cart-toast');\n  if(!toast){\n    toast=document.createElement('div');\n    toast.id='fp-cart-toast';\n    toast.setAttribute('role','status');\n    toast.setAttribute('aria-live','polite');\n    Object.assign(toast.style,{position:'fixed',top:'20px',left:'50%',transform:'translate(-50%,-8px)',zIndex:'99999',background:'#101216',color:'#fff',border:'1px solid #ffc400',borderRadius:'999px',padding:'12px 18px',fontSize:'13px',fontWeight:'900',letterSpacing:'.01em',boxShadow:'0 12px 35px rgba(0,0,0,.35)',opacity:'0',transition:'opacity .18s ease, transform .18s ease',pointerEvents:'none',whiteSpace:'nowrap',maxWidth:'calc(100vw - 32px)',overflow:'hidden',textOverflow:'ellipsis'});\n    document.body.appendChild(toast);\n  }\n  toast.textContent='Produto adicionado ao carrinho ✓';\n  clearTimeout(fpCartToastTimer);\n  requestAnimationFrame(()=>{toast.style.opacity='1';toast.style.transform='translate(-50%,0)';});\n  fpCartToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%,-8px)';},1900);\n}\ndocument.addEventListener('click',e=>{\n  const btn=e.target.closest('.add-cart-button:not(.unavailable):not(:disabled), .product-modal .modal-actions button:not(:disabled)');\n  if(!btn)return;\n  setTimeout(fpShowCartToast,0);\n});\n})();\n`;

async function syncToast(env) {
  if (!env.FPASSOS_FRONTEND_CODE || !env.FPASSOS_STORE) return;
  const marker = `frontend:published:${RELEASE}`;
  if (await env.FPASSOS_STORE.get(marker)) return;

  const checkoutJs = await env.FPASSOS_FRONTEND_CODE.get('fpassos-checkout.js');
  if (!checkoutJs) throw new Error('fpassos-checkout.js não encontrado no KV do frontend.');

  if (!checkoutJs.includes(TOAST_MARKER)) {
    await env.FPASSOS_FRONTEND_CODE.put('fpassos-checkout.js', checkoutJs + TOAST_APPEND);
  }
  await env.FPASSOS_STORE.put(marker, new Date().toISOString());
}

export default {
  async fetch(request, env, ctx) {
    try { await syncToast(env); } catch (error) { console.error('Falha ao publicar aviso do carrinho:', error); }
    return current.fetch(request, env, ctx);
  }
};
