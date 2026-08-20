// Sincroniza a versão v6 dos preços/status no KV do frontend uma única vez.
import api from './index_v3.js';

const RELEASE = '2026-08-20-v6-live';
const INDEX_REPLACEMENTS = [["detail:\"Baunilha\",price:149.99,badge:\"DESTAQUE\"","detail:\"Baunilha\",price:119.9,badge:\"DESTAQUE\""],["detail:\"Cookies & Cream\",price:132,badge:\"WHEY\"","detail:\"Cookies & Cream\",price:129.9,badge:\"WHEY\""],["detail:\"Morango\",price:132,badge:\"WHEY\"","detail:\"Morango\",price:129.9,badge:\"WHEY\""],["detail:\"Chocolate\",price:132,badge:\"WHEY\"","detail:\"Chocolate\",price:129.9,badge:\"WHEY\""],["detail:\"Baunilha\",price:132,badge:\"WHEY\"","detail:\"Baunilha\",price:129.9,badge:\"WHEY\""],["detail:\"Toddy\",price:330,badge:\"WHEY\"","detail:\"Toddy\",price:330,unavailable:!0,badge:\"WHEY\""],["detail:\"Original\",price:330,badge:\"WHEY\"","detail:\"Original\",price:330,unavailable:!0,badge:\"WHEY\""],["detail:\"Creatina monohidratada\",price:88,badge:\"CREATINA\"","detail:\"Creatina monohidratada\",price:49.9,badge:\"CREATINA\""],["detail:\"7Belo Framboesa\",price:60,badge:\"CREATINA\"","detail:\"7Belo Framboesa\",price:59.9,badge:\"CREATINA\""],["detail:\"Sem sabor\",price:60.8,badge:\"CREATINA\"","detail:\"Sem sabor\",price:59.9,badge:\"CREATINA\""],["detail:\"Creatina monohidratada\",price:65,badge:\"CREATINA\"","detail:\"Creatina monohidratada\",price:64.9,badge:\"CREATINA\""],["detail:\"100% L-Glutamina\",price:77,badge:\"GLUTAMINA\"","detail:\"100% L-Glutamina\",price:79.9,badge:\"GLUTAMINA\""],["detail:\"L-Glutamina\",price:73,badge:\"GLUTAMINA\"","detail:\"L-Glutamina\",price:69.9,badge:\"GLUTAMINA\""],["detail:\"5.000 mg por porção\",price:32.9,badge:\"GLUTAMINA\"","detail:\"5.000 mg por porção\",price:29.9,badge:\"GLUTAMINA\""],["detail:\"Tangerina\",price:77,badge:\"VITAMINAS\"","detail:\"Tangerina\",price:79.9,badge:\"VITAMINAS\""],["detail:\"Vitaminas A, C e E + zinco e selênio\",price:28,badge:\"VITAMINAS\"","detail:\"Vitaminas A, C e E + zinco e selênio\",price:27.9,badge:\"VITAMINAS\""],["(0,f.jsx)(\"p\",{children:l.detail}),(0,f.jsxs)(\"div\",{className:\"price-line\",children:[(0,f.jsx)(\"small\",{children:\"POR APENAS\"}),(0,f.jsx)(\"strong\",{children:lt.format(l.price)}),(0,f.jsx)(\"span\",{children:\"ou em at\\xE9 12x no cart\\xE3o\"})]}),(0,f.jsxs)(\"button\",{className:`add-cart-button ${a?\"added\":\"\"}`,onClick:t,children:[(0,f.jsx)(\"span\",{children:a?\"ADICIONADO\":\"ADICIONAR\"}),(0,f.jsx)(\"b\",{children:a?`\\u2713 ${a} NO CARRINHO`:\"\\u{1F6D2}\"})]})","(0,f.jsx)(\"p\",{children:l.detail}),l.unavailable?(0,f.jsx)(\"div\",{className:\"price-line unavailable\",children:(0,f.jsx)(\"strong\",{children:\"INDISPON\\xCDVEL\"})}):(0,f.jsxs)(\"div\",{className:\"price-line\",children:[(0,f.jsx)(\"small\",{children:\"POR APENAS\"}),(0,f.jsx)(\"strong\",{children:lt.format(l.price)}),(0,f.jsx)(\"span\",{children:\"ou em at\\xE9 12x no cart\\xE3o\"})]}),(0,f.jsxs)(\"button\",{className:`add-cart-button ${a?\"added\":\"\"} ${l.unavailable?\"unavailable\":\"\"}`,onClick:l.unavailable?void 0:t,disabled:!!l.unavailable,children:[(0,f.jsx)(\"span\",{children:l.unavailable?\"INDISPON\\xCDVEL\":a?\"ADICIONADO\":\"ADICIONAR\"}),(0,f.jsx)(\"b\",{children:l.unavailable?\"\":a?`\\u2713 ${a} NO CARRINHO`:\"\\u{1F6D2}\"})]})"],["(0,f.jsx)(\"strong\",{className:\"modal-price\",children:lt.format(h.price)})","(0,f.jsx)(\"strong\",{className:\"modal-price\",children:h.unavailable?\"INDISPON\\xCDVEL\":lt.format(h.price)})"],["(0,f.jsx)(\"button\",{onClick:()=>r(h.id),children:\"ADICIONAR \\u{1F6D2}\"})","(0,f.jsx)(\"button\",{onClick:h.unavailable?void 0:()=>r(h.id),disabled:!!h.unavailable,children:h.unavailable?\"INDISPON\\xCDVEL\":\"ADICIONAR \\u{1F6D2}\"})"],["r=b=>c(A=>({...A,[b]:(A[b]??0)+1}))","r=b=>{let A=Pa.products.find(O=>O.id===b);A&&!A.unavailable&&c(O=>({...O,[b]:(O[b]??0)+1}))}"]];
const CHECKOUT_REPLACEMENTS = [["2:{name:'Whey Test-Boost 900g Baunilha',detail:'Baunilha',price:149.99}","2:{name:'Whey Test-Boost 900g Baunilha',detail:'Baunilha',price:119.9}"],["5:{name:'Refil 100% Whey 900g',detail:'Cookies & Cream',price:132}","5:{name:'Refil 100% Whey 900g',detail:'Cookies & Cream',price:129.9}"],["9:{name:'Whey 100% HD 900g',detail:'Morango',price:132}","9:{name:'Whey 100% HD 900g',detail:'Morango',price:129.9}"],["10:{name:'Whey 100% HD 900g',detail:'Chocolate',price:132}","10:{name:'Whey 100% HD 900g',detail:'Chocolate',price:129.9}"],["11:{name:'Refil 100% Whey 900g',detail:'Baunilha',price:132}","11:{name:'Refil 100% Whey 900g',detail:'Baunilha',price:129.9}"],["12:{name:'Best Whey Toddy 900g',detail:'Toddy',price:330}","12:{name:'Best Whey Toddy 900g',detail:'Toddy',price:330,unavailable:true}"],["13:{name:'Best Whey 900g',detail:'Original',price:330}","13:{name:'Best Whey 900g',detail:'Original',price:330,unavailable:true}"],["19:{name:'Creatine Pure 300g',detail:'Creatina monohidratada',price:88}","19:{name:'Creatine Pure 300g',detail:'Creatina monohidratada',price:49.9}"],["22:{name:'Creatina Monohidratada 300g',detail:'7Belo Framboesa',price:60}","22:{name:'Creatina Monohidratada 300g',detail:'7Belo Framboesa',price:59.9}"],["25:{name:'Creatine Monohydrate Power 300g',detail:'Sem sabor',price:60.8}","25:{name:'Creatine Monohydrate Power 300g',detail:'Sem sabor',price:59.9}"],["26:{name:'Pure Creatine 300g',detail:'Creatina monohidratada',price:65}","26:{name:'Pure Creatine 300g',detail:'Creatina monohidratada',price:64.9}"],["28:{name:'L-Glutamina 300g',detail:'100% L-Glutamina',price:77}","28:{name:'L-Glutamina 300g',detail:'100% L-Glutamina',price:79.9}"],["29:{name:'Glutamina 300g',detail:'L-Glutamina',price:73}","29:{name:'Glutamina 300g',detail:'L-Glutamina',price:69.9}"],["30:{name:'Glutamina 150g',detail:'5.000 mg por porção',price:32.9}","30:{name:'Glutamina 150g',detail:'5.000 mg por porção',price:29.9}"],["32:{name:'Colágeno Hidrolisado 240g',detail:'Tangerina',price:77}","32:{name:'Colágeno Hidrolisado 240g',detail:'Tangerina',price:79.9}"],["33:{name:'Colágeno For Femme 60 tabletes',detail:'Vitaminas A, C e E + zinco e selênio',price:28}","33:{name:'Colágeno For Femme 60 tabletes',detail:'Vitaminas A, C e E + zinco e selênio',price:27.9}"]];
const CSS_APPEND = "\n\n/* Produtos temporariamente indisponíveis */\n.price-line.unavailable{min-height:58px;justify-content:center}\n.price-line.unavailable strong{font-size:22px;letter-spacing:.06em}\n.add-cart-button.unavailable,.add-cart-button:disabled,.modal-actions button:disabled{cursor:not-allowed;opacity:.58;filter:grayscale(1)}\n";

function applyReplacements(text, replacements) {
  let out = text;
  for (const [from, to] of replacements) {
    if (out.includes(to)) continue;
    if (!out.includes(from)) throw new Error(`Padrão de atualização não encontrado: ${from.slice(0,80)}`);
    out = out.replace(from, to);
  }
  return out;
}

async function syncFrontend(env) {
  if (!env.FPASSOS_FRONTEND_CODE || !env.FPASSOS_STORE) return;
  const marker = `frontend:published:${RELEASE}`;
  if (await env.FPASSOS_STORE.get(marker)) return;

  const [indexHtml, checkoutJs, checkoutCss] = await Promise.all([
    env.FPASSOS_FRONTEND_CODE.get('index.html'),
    env.FPASSOS_FRONTEND_CODE.get('fpassos-checkout.js'),
    env.FPASSOS_FRONTEND_CODE.get('fpassos-checkout.css')
  ]);
  if (!indexHtml || !checkoutJs || !checkoutCss) throw new Error('Arquivos do frontend não encontrados no KV.');

  const nextIndex = applyReplacements(indexHtml, INDEX_REPLACEMENTS);
  const nextCheckout = applyReplacements(checkoutJs, CHECKOUT_REPLACEMENTS);
  const nextCss = checkoutCss.includes('Produtos temporariamente indisponíveis') ? checkoutCss : checkoutCss + CSS_APPEND;

  await Promise.all([
    env.FPASSOS_FRONTEND_CODE.put('index.html', nextIndex),
    env.FPASSOS_FRONTEND_CODE.put('fpassos-checkout.js', nextCheckout),
    env.FPASSOS_FRONTEND_CODE.put('fpassos-checkout.css', nextCss)
  ]);
  await env.FPASSOS_STORE.put(marker, new Date().toISOString());
}

export default {
  async fetch(request, env, ctx) {
    try { await syncFrontend(env); } catch (error) { console.error('Falha ao sincronizar frontend v6:', error); }
    return api.fetch(request, env, ctx);
  }
};
