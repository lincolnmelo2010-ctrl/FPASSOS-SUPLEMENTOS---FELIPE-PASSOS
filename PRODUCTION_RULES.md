# Regras de produção — FPassos Suplementos

1. O único entrypoint ativo do Worker é `src/production.js`.
2. O backend canônico é `src/backend.js`.
3. Não criar arquivos paralelos `v2`, `v3`, `v6`, `v7` etc. para produção.
4. Ao fazer uma atualização: primeiro criar/salvar a nova versão, conferir que `wrangler.jsonc` aponta para ela e validar o conteúdo; somente depois remover o arquivo anterior do branch ativo.
5. Nunca apagar o arquivo atualmente referenciado por `wrangler.jsonc`.
6. Antes de remover qualquer versão anterior, conferir o diff/commit. O histórico do GitHub permanece como backup.
7. Alterações de preço/status não podem substituir imagens, CSS, layout ou a versão visual atual do frontend.
8. Alterações de imagem devem preservar `index.html`, JavaScript, CSS, carrinho, e-mail, frete e pagamento, salvo pedido explícito.
9. Os produtos Best Whey Toddy 900g e Best Whey 900g Original devem permanecer visíveis, sem preço e marcados como `INDISPONÍVEL` enquanto esse status não for alterado explicitamente.
10. O e-mail público do rodapé é `contato@fpassossuplementos.com.br`; o e-mail técnico configurado para integrações não deve ser trocado automaticamente.
