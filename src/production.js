// FPassos Suplementos — arquivo ÚNICO de produção.
// Regra: este é o único entrypoint ativo do Worker. Não criar v2/v3/v7 paralelos.
// O frontend é lido do KV atual e recebe somente alterações pontuais aprovadas; imagens e estrutura visual não são substituídas.
import api from './backend.js';

const RELEASE = 'production-approved-cart-email-2026-08-20-02';
const CEP_RELEASE = 'production-cep-autofill-2026-08-21-01';
const CEP_MARKER = 'FPASSOS_CEP_AUTOFILL_V1';

const PRODUCT_PATCHES = [
  ['detail:"Baunilha",price:149.99', 'detail:"Baunilha",price:119.9'],
  ['detail:"Chocolate",price:149.99', 'detail:"Chocolate",price:119.9'],
  ['detail:"Cookies & Cream",price:132', 'detail:"Cookies & Cream",price:129.9'],
  ['detail:"Morango",price:132', 'detail:"Morango",price:129.9'],
  ['detail:"Chocolate",price:132', 'detail:"Chocolate",price:129.9'],
  ['detail:"Baunilha",price:132', 'detail:"Baunilha",price:129.9'],
  ['detail:"Toddy",price:330,badge:"WHEY"', 'detail:"Toddy",price:330,unavailable:!0,badge:"WHEY"'],
  ['detail:"Original",price:330,badge:"WHEY"', 'detail:"Original",price:330,unavailable:!0,badge:"WHEY"'],
  ['detail:"Creatina monohidratada",price:88,badge:"CREATINA"', 'detail:"Creatina monohidratada",price:49.9,badge:"CREATINA"'],
  ['detail:"7Belo Framboesa",price:60,badge:"CREATINA"', 'detail:"7Belo Framboesa",price:59.9,badge:"CREATINA"'],
  ['detail:"Sem sabor",price:60.8,badge:"CREATINA"', 'detail:"Sem sabor",price:59.9,badge:"CREATINA"'],
  ['detail:"Creatina monohidratada",price:65,badge:"CREATINA"', 'detail:"Creatina monohidratada",price:64.9,badge:"CREATINA"'],
  ['detail:"100% L-Glutamina",price:77,badge:"GLUTAMINA"', 'detail:"100% L-Glutamina",price:79.9,badge:"GLUTAMINA"'],
  ['detail:"L-Glutamina",price:73,badge:"GLUTAMINA"', 'detail:"L-Glutamina",price:69.9,badge:"GLUTAMINA"'],
  ['detail:"5.000 mg por porção",price:32.9,badge:"GLUTAMINA"', 'detail:"5.000 mg por porção",price:29.9,badge:"GLUTAMINA"'],
  ['detail:"Tangerina",price:77,badge:"VITAMINAS"', 'detail:"Tangerina",price:79.9,badge:"VITAMINAS"'],
  ['detail:"Vitaminas A, C e E + zinco e selênio",price:28,badge:"VITAMINAS"', 'detail:"Vitaminas A, C e E + zinco e selênio",price:27.9,badge:"VITAMINAS"']
];

const CHECKOUT_PRICES = new Map([
  [2,119.9],[3,119.9],[5,129.9],[9,129.9],[10,129.9],[11,129.9],
  [12,330],[13,330],[19,49.9],[22,59.9],[25,59.9],[26,64.9],
  [28,79.9],[29,69.9],[30,29.9],[32,79.9],[33,27.9]
]);

function patchFrontendIndex(html) {
  let out = html;
  for (const [from,to] of PRODUCT_PATCHES) {
    if (!out.includes(to) && out.includes(from)) out = out.replace(from,to);
  }

  const oldCard='(0,f.jsx)("p",{children:l.detail}),(0,f.jsxs)("div",{className:"price-line",children:[(0,f.jsx)("small",{children:"POR APENAS"}),(0,f.jsx)("strong",{children:lt.format(l.price)}),(0,f.jsx)("span",{children:"ou em at\\xE9 12x no cart\\xE3o"})]}),(0,f.jsxs)("button",{className:`add-cart-button ${a?"added":""}`,onClick:t,children:[(0,f.jsx)("span",{children:a?"ADICIONADO":"ADICIONAR"}),(0,f.jsx)("b",{children:a?`\\u2713 ${a} NO CARRINHO`:"\\u{1F6D2}"})]})';
  const newCard='(0,f.jsx)("p",{children:l.detail}),l.unavailable?(0,f.jsx)("div",{className:"price-line unavailable",children:(0,f.jsx)("strong",{children:"INDISPON\\xCDVEL"})}):(0,f.jsxs)("div",{className:"price-line",children:[(0,f.jsx)("small",{children:"POR APENAS"}),(0,f.jsx)("strong",{children:lt.format(l.price)}),(0,f.jsx)("span",{children:"ou em at\\xE9 12x no cart\\xE3o"})]}),(0,f.jsxs)("button",{className:`add-cart-button ${a?"added":""} ${l.unavailable?"unavailable":""}`,onClick:l.unavailable?void 0:t,disabled:!!l.unavailable,children:[(0,f.jsx)("span",{children:l.unavailable?"INDISPON\\xCDVEL":a?"ADICIONADO":"ADICIONAR"}),(0,f.jsx)("b",{children:l.unavailable?"":a?`\\u2713 ${a} NO CARRINHO`:"\\u{1F6D2}"})]})';
  if (!out.includes('price-line unavailable') && out.includes(oldCard)) out=out.replace(oldCard,newCard);

  const oldModal='(0,f.jsx)("strong",{className:"modal-price",children:lt.format(h.price)})';
  const newModal='(0,f.jsx)("strong",{className:"modal-price",children:h.unavailable?"INDISPON\\xCDVEL":lt.format(h.price)})';
  if (!out.includes(newModal) && out.includes(oldModal)) out=out.replace(oldModal,newModal);

  const oldBtn='(0,f.jsx)("button",{onClick:()=>r(h.id),children:"ADICIONAR \\u{1F6D2}"})';
  const newBtn='(0,f.jsx)("button",{onClick:h.unavailable?void 0:()=>r(h.id),disabled:!!h.unavailable,children:h.unavailable?"INDISPON\\xCDVEL":"ADICIONAR \\u{1F6D2}"})';
  if (!out.includes(newBtn) && out.includes(oldBtn)) out=out.replace(oldBtn,newBtn);

  const oldAdd='r=b=>c(A=>({...A,[b]:(A[b]??0)+1}))';
  const newAdd='r=b=>{let A=Pa.products.find(O=>O.id===b);A&&!A.unavailable&&c(O=>({...O,[b]:(O[b]??0)+1}))}';
  if (!out.includes(newAdd) && out.includes(oldAdd)) out=out.replace(oldAdd,newAdd);

  // Alteração aprovada: carrinho amarelo quando houver itens e contador maior em círculo azul.
  const oldCartCss='.header-cart{color:#050505;background:#fff;border-radius:999px;align-items:center;gap:8px;min-height:48px;padding:5px 16px 5px 12px;display:flex;position:relative}';
  const newCartCss='.header-cart{color:#050505;background:#fff;border-radius:999px;align-items:center;gap:8px;min-height:48px;padding:5px 16px 5px 12px;display:flex;position:relative;transition:background .18s,box-shadow .18s}.header-cart.has-items{background:var(--gold);box-shadow:0 0 0 2px #ffc40045,0 0 22px #ffc40038}.header-cart.has-items i{background:var(--blue);color:#fff;min-width:30px;height:30px;padding:0 7px;font-size:16px;line-height:1;top:-9px;right:-7px;box-shadow:0 0 0 3px #050607,0 4px 12px #0008}';
  if (!out.includes('.header-cart.has-items{') && out.includes(oldCartCss)) out=out.replace(oldCartCss,newCartCss);

  const oldCartButton='className:"header-cart",onClick:()=>m(!0)';
  const newCartButton='className:`header-cart ${s>0?"has-items":""}`,onClick:()=>m(!0)';
  if (!out.includes('className:`header-cart ${s>0?"has-items":""}`') && out.includes(oldCartButton)) out=out.replace(oldCartButton,newCartButton);

  // Alteração aprovada: e-mail público oficial do rodapé.
  out=out.replaceAll('mailto:felipefpassos@hotmail.com','mailto:contato@fpassossuplementos.com.br');
  out=out.replaceAll('E-mail: felipefpassos@hotmail.com','E-mail: contato@fpassossuplementos.com.br');
  return out;
}

function patchCheckout(js) {
  return js.replace(/(\d+):\{name:'([^']+)',detail:'([^']+)',price:([0-9.]+)(,unavailable:true)?\}/g,
    (m,id,name,detail,_price,flag)=>{
      id=Number(id);
      if (!CHECKOUT_PRICES.has(id)) return m;
      const unavailable=id===12||id===13;
      return `${id}:{name:'${name}',detail:'${detail}',price:${CHECKOUT_PRICES.get(id)}${unavailable?',unavailable:true':''}}`;
    });
}

function patchCep(js) {
  if (js.includes(CEP_MARKER)) return js;
  return js + `
/* ${CEP_MARKER} — consulta automática de endereço por CEP via ViaCEP. */
(()=>{
  'use strict';
  let timer = 0;
  let activeController = null;
  let lastCep = '';
  function digits(value){ return String(value || '').replace(/[^0-9]/g, ''); }
  function status(input, message, kind){
    const label = input?.closest('label');
    if (!label) return;
    let node = label.querySelector('.fp-cep-status');
    if (!node) {
      node = document.createElement('small');
      node.className = 'fp-cep-status';
      node.style.cssText = 'display:none;min-height:0;font-size:10px;line-height:1.2;letter-spacing:0;font-weight:700;color:#9ba3ae';
      label.appendChild(node);
    }
    node.textContent = message || '';
    node.style.display = message ? 'block' : 'none';
    node.style.color = kind === 'error' ? '#ff7b7b' : (kind === 'ok' ? '#67dc91' : '#9ba3ae');
  }
  function field(form, name){ return form?.elements?.namedItem(name); }
  async function lookup(input){
    const cep = digits(input?.value);
    const form = input?.form;
    if (!form || cep.length !== 8 || cep === lastCep) return;
    lastCep = cep;
    if (activeController) activeController.abort();
    activeController = new AbortController();
    input.setCustomValidity('');
    status(input, 'Consultando endereço…');
    try {
      const response = await fetch('https://viacep.com.br/ws/' + cep + '/json/', {headers:{'Accept':'application/json'}, signal: activeController.signal});
      if (!response.ok) throw new Error('Não foi possível consultar este CEP.');
      const data = await response.json();
      if (data.erro) throw new Error('CEP não encontrado.');
      const street = field(form, 'street');
      const neighborhood = field(form, 'neighborhood');
      const city = field(form, 'city');
      const state = field(form, 'state');
      if (street) street.value = data.logradouro || '';
      if (neighborhood) neighborhood.value = data.bairro || '';
      if (city) city.value = data.localidade || '';
      if (state) state.value = data.uf || '';
      input.setCustomValidity('');
      status(input, 'Endereço preenchido automaticamente.', 'ok');
      window.setTimeout(() => { if (digits(input.value) === cep) status(input, ''); }, 3500);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      input.setCustomValidity(error?.message || 'Confira o CEP.');
      status(input, error?.message || 'Confira o CEP.', 'error');
    }
  }
  document.addEventListener('input', event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.matches('.fp-customer-form input[name="zip"]')) return;
    const cep = digits(input.value);
    if (cep.length !== 8) { lastCep = ''; input.setCustomValidity(''); status(input, ''); }
    window.clearTimeout(timer);
    if (cep.length === 8) timer = window.setTimeout(() => lookup(input), 350);
  }, true);
  document.addEventListener('blur', event => {
    const input = event.target;
    if (input instanceof HTMLInputElement && input.matches('.fp-customer-form input[name="zip"]')) lookup(input);
  }, true);
})();
`;
}

async function syncFrontend(env) {
  if (!env.FPASSOS_FRONTEND_CODE || !env.FPASSOS_STORE) return;
  const marker=`frontend:published:${RELEASE}`;
  const cepMarker=`frontend:published:${CEP_RELEASE}`;
  const mainPending = !(await env.FPASSOS_STORE.get(marker));
  const cepPending = !(await env.FPASSOS_STORE.get(cepMarker));
  if (!mainPending && !cepPending) return;

  const [html,checkout]=await Promise.all([
    env.FPASSOS_FRONTEND_CODE.get('index.html'),
    env.FPASSOS_FRONTEND_CODE.get('fpassos-checkout.js')
  ]);
  if (!html || !checkout) throw new Error('Frontend atual não encontrado no KV.');

  const nextHtml = mainPending ? patchFrontendIndex(html) : html;
  let nextCheckout = mainPending ? patchCheckout(checkout) : checkout;
  if (cepPending) nextCheckout = patchCep(nextCheckout);

  await Promise.all([
    nextHtml!==html ? env.FPASSOS_FRONTEND_CODE.put('index.html',nextHtml) : Promise.resolve(),
    nextCheckout!==checkout ? env.FPASSOS_FRONTEND_CODE.put('fpassos-checkout.js',nextCheckout) : Promise.resolve(),
    mainPending ? env.FPASSOS_STORE.put(marker,new Date().toISOString()) : Promise.resolve(),
    cepPending ? env.FPASSOS_STORE.put(cepMarker,new Date().toISOString()) : Promise.resolve()
  ]);
}

export default {
  async fetch(request,env,ctx){
    try { await syncFrontend(env); } catch (error) { console.error('Falha ao sincronizar frontend aprovado:',error); }
    return api.fetch(request,env,ctx);
  }
};
