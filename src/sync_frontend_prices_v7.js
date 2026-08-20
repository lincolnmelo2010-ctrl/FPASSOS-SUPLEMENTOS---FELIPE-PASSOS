// FPassos — restaura SOMENTE preços e status dos produtos no frontend atual.
// A rotina lê o HTML/JS que já está no KV (incluindo as melhorias visuais do Manus)
// e aplica alterações cirúrgicas. Não substitui layout, imagens, e-mail, carrinho,
// frete, pagamento ou demais elementos visuais.
import current from './sync_frontend_footer_cart_v3.js';

const RELEASE = '2026-08-20-prices-v7-preserve-manus-ui';
const FALLBACK_MARKER = 'FPASSOS_PRICES_V7_FALLBACK';

const PRICE_RULES = [
  // Whey
  [/detail:"Baunilha",price:(?:149\.99|119\.9)/g, 'detail:"Baunilha",price:119.9'],
  [/detail:"Chocolate",price:(?:149\.99|119\.9)/g, 'detail:"Chocolate",price:119.9'],
  [/detail:"Cookies & Cream",price:(?:132|129\.9)/g, 'detail:"Cookies & Cream",price:129.9'],
  [/detail:"Morango",price:(?:132|129\.9)/g, 'detail:"Morango",price:129.9'],
  [/detail:"Chocolate",price:(?:132|129\.9)/g, 'detail:"Chocolate",price:129.9'],
  [/detail:"Baunilha",price:(?:132|129\.9)/g, 'detail:"Baunilha",price:129.9'],

  // Best Whey indisponíveis
  [/detail:"Toddy",price:330(?:,unavailable:!0)?/g, 'detail:"Toddy",price:330,unavailable:!0'],
  [/detail:"Original",price:330(?:,unavailable:!0)?/g, 'detail:"Original",price:330,unavailable:!0'],

  // Creatinas
  [/detail:"Creatina monohidratada",price:(?:88|49\.9)/g, 'detail:"Creatina monohidratada",price:49.9'],
  [/detail:"7Belo Framboesa",price:(?:60|59\.9)/g, 'detail:"7Belo Framboesa",price:59.9'],
  [/detail:"Sem sabor",price:(?:60\.8|59\.9)/g, 'detail:"Sem sabor",price:59.9'],
  [/detail:"Creatina monohidratada",price:(?:65|64\.9)/g, 'detail:"Creatina monohidratada",price:64.9'],

  // Glutaminas
  [/detail:"100% L-Glutamina",price:(?:77|79\.9)/g, 'detail:"100% L-Glutamina",price:79.9'],
  [/detail:"L-Glutamina",price:(?:73|69\.9)/g, 'detail:"L-Glutamina",price:69.9'],
  [/detail:"5.000 mg por porção",price:(?:32\.9|29\.9)/g, 'detail:"5.000 mg por porção",price:29.9'],

  // Colágenos
  [/detail:"Tangerina",price:(?:77|79\.9)/g, 'detail:"Tangerina",price:79.9'],
  [/detail:"Vitaminas A, C e E \+ zinco e selênio",price:(?:28|27\.9)/g, 'detail:"Vitaminas A, C e E + zinco e selênio",price:27.9']
];

const CHECKOUT_RULES = [
  [2, 119.9, true], [3, 119.9, true], [5, 129.9, true], [9, 129.9, true],
  [10, 129.9, true], [11, 129.9, true], [12, 330, false], [13, 330, false],
  [19, 49.9, true], [22, 59.9, true], [25, 59.9, true], [26, 64.9, true],
  [28, 79.9, true], [29, 69.9, true], [30, 29.9, true], [32, 79.9, true], [33, 27.9, true]
];

function patchIndex(text) {
  let out = text;
  for (const [re, replacement] of PRICE_RULES) out = out.replace(re, replacement);

  // Se a versão atual não tiver a renderização de indisponível, aplica a mesma
  // lógica já validada anteriormente, sem tocar na identidade visual.
  const oldCard = '(0,f.jsx)("p",{children:l.detail}),(0,f.jsxs)("div",{className:"price-line",children:[(0,f.jsx)("small",{children:"POR APENAS"}),(0,f.jsx)("strong",{children:lt.format(l.price)}),(0,f.jsx)("span",{children:"ou em at\\xE9 12x no cart\\xE3o"})]}),(0,f.jsxs)("button",{className:`add-cart-button ${a?"added":""}`,onClick:t,children:[(0,f.jsx)("span",{children:a?"ADICIONADO":"ADICIONAR"}),(0,f.jsx)("b",{children:a?`\\u2713 ${a} NO CARRINHO`:"\\u{1F6D2}"})]})';
  const newCard = '(0,f.jsx)("p",{children:l.detail}),l.unavailable?(0,f.jsx)("div",{className:"price-line unavailable",children:(0,f.jsx)("strong",{children:"INDISPON\\xCDVEL"})}):(0,f.jsxs)("div",{className:"price-line",children:[(0,f.jsx)("small",{children:"POR APENAS"}),(0,f.jsx)("strong",{children:lt.format(l.price)}),(0,f.jsx)("span",{children:"ou em at\\xE9 12x no cart\\xE3o"})]}),(0,f.jsxs)("button",{className:`add-cart-button ${a?"added":""} ${l.unavailable?"unavailable":""}`,onClick:l.unavailable?void 0:t,disabled:!!l.unavailable,children:[(0,f.jsx)("span",{children:l.unavailable?"INDISPON\\xCDVEL":a?"ADICIONADO":"ADICIONAR"}),(0,f.jsx)("b",{children:l.unavailable?"":a?`\\u2713 ${a} NO CARRINHO`:"\\u{1F6D2}"})]})';
  if (!out.includes('price-line unavailable') && out.includes(oldCard)) out = out.replace(oldCard, newCard);

  const oldModalPrice = '(0,f.jsx)("strong",{className:"modal-price",children:lt.format(h.price)})';
  const newModalPrice = '(0,f.jsx)("strong",{className:"modal-price",children:h.unavailable?"INDISPON\\xCDVEL":lt.format(h.price)})';
  if (!out.includes(newModalPrice) && out.includes(oldModalPrice)) out = out.replace(oldModalPrice, newModalPrice);

  const oldModalBtn = '(0,f.jsx)("button",{onClick:()=>r(h.id),children:"ADICIONAR \\u{1F6D2}"})';
  const newModalBtn = '(0,f.jsx)("button",{onClick:h.unavailable?void 0:()=>r(h.id),disabled:!!h.unavailable,children:h.unavailable?"INDISPON\\xCDVEL":"ADICIONAR \\u{1F6D2}"})';
  if (!out.includes(newModalBtn) && out.includes(oldModalBtn)) out = out.replace(oldModalBtn, newModalBtn);

  // Trava também a função de adicionar caso o bundle ainda não tenha essa proteção.
  const oldAdd = 'r=b=>c(A=>({...A,[b]:(A[b]??0)+1}))';
  const newAdd = 'r=b=>{let A=Pa.products.find(O=>O.id===b);A&&!A.unavailable&&c(O=>({...O,[b]:(O[b]??0)+1}))}';
  if (!out.includes(newAdd) && out.includes(oldAdd)) out = out.replace(oldAdd, newAdd);

  // Fallback visual: atua somente nos dois cards indisponíveis se a estrutura do
  // bundle mudou e os padrões acima não forem encontrados.
  if (!out.includes(FALLBACK_MARKER)) {
    const fallback = `\n<script id="${FALLBACK_MARKER}">(()=>{const names=['BEST WHEY TODDY 900G','BEST WHEY 900G'];function run(){document.querySelectorAll('.product-card,.product-modal').forEach(card=>{const text=(card.textContent||'').toUpperCase();const isToddy=text.includes('BEST WHEY TODDY 900G');const isOriginal=text.includes('BEST WHEY 900G')&&text.includes('ORIGINAL');if(!isToddy&&!isOriginal)return;const price=card.querySelector('.price-line,.modal-price');if(price){price.innerHTML='<strong>INDISPONÍVEL</strong>';price.classList.add('unavailable')}card.querySelectorAll('.add-cart-button,.modal-actions button').forEach(btn=>{btn.disabled=true;btn.classList.add('unavailable');btn.textContent='INDISPONÍVEL'})})}new MutationObserver(run).observe(document.documentElement,{subtree:true,childList:true});run()})();</script>\n`;
    out = out.includes('</body>') ? out.replace('</body>', `${fallback}</body>`) : out + fallback;
  }
  return out;
}

function patchCheckout(text) {
  let out = text;
  for (const [id, price, available] of CHECKOUT_RULES) {
    const re = new RegExp(`${id}:\\{name:'([^']+)',detail:'([^']+)',price:[0-9.]+(?:,unavailable:true)?\\}`);
    out = out.replace(re, (_m, name, detail) => `${id}:{name:'${name}',detail:'${detail}',price:${price}${available ? '' : ',unavailable:true'}}`);
  }
  return out;
}

async function syncPrices(env) {
  if (!env.FPASSOS_FRONTEND_CODE || !env.FPASSOS_STORE) return;
  const marker = `frontend:published:${RELEASE}`;
  if (await env.FPASSOS_STORE.get(marker)) return;

  const [indexHtml, checkoutJs] = await Promise.all([
    env.FPASSOS_FRONTEND_CODE.get('index.html'),
    env.FPASSOS_FRONTEND_CODE.get('fpassos-checkout.js')
  ]);
  if (!indexHtml || !checkoutJs) throw new Error('Frontend não encontrado no KV.');

  const nextIndex = patchIndex(indexHtml);
  const nextCheckout = patchCheckout(checkoutJs);

  await Promise.all([
    nextIndex !== indexHtml ? env.FPASSOS_FRONTEND_CODE.put('index.html', nextIndex) : Promise.resolve(),
    nextCheckout !== checkoutJs ? env.FPASSOS_FRONTEND_CODE.put('fpassos-checkout.js', nextCheckout) : Promise.resolve()
  ]);
  await env.FPASSOS_STORE.put(marker, new Date().toISOString());
}

export default {
  async fetch(request, env, ctx) {
    try { await syncPrices(env); } catch (error) { console.error('Falha ao restaurar preços/status v7:', error); }
    return current.fetch(request, env, ctx);
  }
};
