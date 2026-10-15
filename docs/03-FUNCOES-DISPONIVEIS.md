# Funções disponíveis

O motor entrega o objeto `api` às funções do seu nível, como `aoClicar(api)`, `aoAbrir(api)` e `aoAcertar(api)`. Na mecânica, ele aparece em `contexto.api`.

Não importe funções de `js/core/`. Use apenas as oito funções públicas abaixo. Os exemplos presumem que as cenas, modais e estados citados já foram declarados no nível.

## `api.irParaCena(id)`

**Para que serve:** abrir outra cena do nível atual.

**Parâmetro:** `id`, texto com a chave de uma cena em `cenas`.

```js
aoClicar(api) {
    api.irParaCena("cozinha");
}
```

**Resultado esperado:** muda o cenário, seus objetos e suas setas. Não troca de nível nem de página. Retorna uma Promise que termina após o carregamento da cena; use `await` em uma função `async` se outra ação depender de a nova cena já estar pronta.

**Erros comuns:** informar o nome de exibição em vez do ID, escrever `"Cozinha"` quando a chave é `cozinha`, ou informar a cena de outro nível.

## `api.mostrarMensagem(texto)`

**Para que serve:** exibir uma mensagem curta ao jogador.

**Parâmetro:** `texto`, uma string não vazia.

```js
aoClicar(api) {
    api.mostrarMensagem("O relógio parou às três horas.");
}
```

**Resultado esperado:** a interface apresenta o texto. Para uma pista longa, use um modal.

**Erros comuns:** enviar um objeto ou número em vez de texto. Escreva `"1947"` para uma mensagem numérica. O conteúdo é texto; não escreva tags HTML esperando que sejam interpretadas.

## `api.abrirModal(id)`

**Para que serve:** abrir um modal configurado no nível.

**Parâmetro:** `id`, texto com a chave de um modal em `modais`.

```js
aoClicar(api) {
    api.abrirModal("bilhete");
}
```

**Resultado esperado:** abre a apresentação configurada no modal. No padrão, mostra título, texto e recursos opcionais; se houver `enigma`, aparecem o input e o botão de resposta. Com `apresentacao: "nota"`, exibe a imagem do bilhete e mantém título e texto acessíveis para leitores de tela. Notas precisam de imagem e não aceitam enigmas. Se houver `aoAbrir`, essa função é executada.

**Erros comuns:** usar um ID inexistente ou passar o objeto do modal. O modal precisa estar declarado, e a chamada recebe somente o ID.

## `api.fecharModal()`

**Para que serve:** fechar o modal aberto e voltar à exploração.

**Parâmetros:** nenhum.

```js
aoAcertar(api) {
    api.definirEstado("abriuPorta", true);
    api.fecharModal();
    api.mostrarMensagem("Você ouviu a fechadura destravar.");
}
```

**Resultado esperado:** o modal desaparece. Também pode ser fechado pelos controles da interface.

**Erros comuns:** passar um ID ou tentar recriar o fechamento acessando o DOM. A função sempre fecha o modal atual.

## `api.validarResposta(valor, resposta)`

**Para que serve:** comparar dois textos em uma lógica personalizada. Os enigmas declarados em `enigma` já usam a validação automaticamente.

**Parâmetros:** `valor`, texto informado pelo jogador; `resposta`, texto correto.

```js
aoClicar(api) {
    const correto = api.validarResposta("  CASA  ", "casa");
    api.mostrarMensagem(correto ? "Resposta correta." : "Tente outra vez.");
}
```

**Resultado esperado:** retorna `true` ou `false`. O exemplo retorna `true`: a comparação remove espaços nas pontas e ignora maiúsculas e minúsculas. Não abre modais, não cria um input e não conclui o nível por conta própria.

**Erros comuns:** passar números em vez de strings; imaginar que `"acao"` será igual a `"ação"`; esperar que `"19 47"` seja igual a `"1947"`. Códigos como `"0042"` devem permanecer textos para preservar os zeros.

O mesmo vale para códigos RGB: `"0,255,255"` é diferente de `"0, 255, 255"`. A função não retira espaços entre os números; o enigma deve explicar o formato esperado.

## `api.definirEstado(chave, valor)`

**Para que serve:** atualizar uma informação do nível, como uma pista encontrada ou porta aberta.

**Parâmetros:** `chave`, texto declarado em `estadoInicial`; `valor`, texto, número finito, booleano ou `null`.

```js
// O nível precisa ter estadoInicial: { leuBilhete: false }.
aoAbrir(api) {
    api.definirEstado("leuBilhete", true);
}
```

**Resultado esperado:** o estado muda, e condições de objetos e saídas passam a refletir o novo valor.

**Erros comuns:** usar uma chave não declarada, escrever `leuBilete` por engano ou passar um objeto/array. O motor informa o erro; ele não cria chaves novas silenciosamente. Esse estado será restaurado quando o nível for reiniciado.

## `api.obterEstado(chave)`

**Para que serve:** consultar o valor atual de um estado.

**Parâmetro:** `chave`, texto declarado em `estadoInicial`.

```js
aoClicar(api) {
    if (api.obterEstado("leuBilhete")) {
        api.abrirModal("fechadura");
    } else {
        api.mostrarMensagem("Procure uma pista antes de tentar o código.");
    }
}
```

**Resultado esperado:** retorna o valor do estado. No exemplo, decide a interação a partir de um booleano.

**Erros comuns:** consultar uma chave inexistente ou usar aspas incorretas. Uma chave desconhecida gera uma mensagem de erro para ajudar a identificar nomes digitados incorretamente.

## `api.concluirNivel()`

**Para que serve:** informar ao motor que o desafio terminou.

**Parâmetros:** nenhum.

```js
aoAcertar(api) {
    api.concluirNivel();
}
```

**Resultado esperado:** na campanha, salva o próximo nível e navega para outra página. No último nível, finaliza a campanha. No teste individual, encerra o teste; na sequência do estúdio, segue somente para o próximo dos três níveis. Cliques repetidos não avançam vários níveis.

**Erros comuns:** passar um caminho, importar o próximo nível ou escrever `window.location` para controlar a campanha. A ordem pertence ao professor e não ao arquivo do aluno.

## Sobre erros e funções atrasadas

Use IDs existentes e tipos corretos. Um erro de conteúdo deve ser corrigido no arquivo do seu estúdio; não modifique o motor para esconder a mensagem.

O motor encerra a API quando o nível é destruído. Um callback atrasado não deve continuar usando a API do nível anterior. Nas mecânicas, use os eventos e temporizadores de [Mecânica exclusiva](04-MECANICA-EXCLUSIVA.md), que são limpos automaticamente.
