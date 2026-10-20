# Mecânica exclusiva

Cada estúdio desenvolve um recurso próprio no arquivo `mecanica.js`. Os três níveis podem importar a mesma função. A mecânica usa recursos públicos e desenha seus elementos em uma camada criada pelo motor.

Ela pode criar HTML e controlar eventos **dos próprios elementos**. Não consulte nem altere a estrutura interna do motor, não importe módulos de `js/core/` e não crie controles paralelos para modais, progresso ou navegação.

## Contrato da função

```js
export default function ativarMecanica(contexto) {
    const { api, camada } = contexto;

    const aviso = document.createElement("span");
    aviso.textContent = "Procure uma pista no escuro.";
    aviso.style.position = "absolute";
    aviso.style.left = "2%";
    aviso.style.top = "2%";
    aviso.style.color = "white";
    aviso.style.pointerEvents = "none";
    camada.append(aviso);

    api.mostrarMensagem("A mecânica está ativa.");

    return function desativarMecanica() {
        aviso.remove();
    };
}
```

A função recebe um objeto de contexto e retorna uma função de limpeza. O motor chama essa limpeza quando o nível termina, é reiniciado ou é substituído. Use uma função normal, sem `async`, para a ativação e para o retorno de limpeza.

No nível:

```js
import ativarMecanica from "./mecanica.js";

export default {
    // ... todos os demais campos do seu nível
    mecanica: ativarMecanica
};
```

Para consulta, existem `examples/mecanica-template.js` e `examples/mecanica-vela.js`. Copie e adapte o código necessário dentro da pasta do seu estúdio. Mantenha os exemplos compartilhados sem alterações.

No ambiente de testes, escolha **Exemplo completo** e use **Acender vela** para experimentar a iluminação seguindo o mouse. A vela começa apagada. **Reiniciar nível** remove a execução anterior e cria a mecânica novamente, sem acumular botões ou eventos.

## Recursos do contexto

### `contexto.cenaAtual`

**Serve para:** consultar a chave da cena que está aberta no nível. O valor muda quando o jogador navega para outra cena.

```js
const marcaDaCena = MARCAS.find(marca => marca.cena === contexto.cenaAtual);
```

**Resultado esperado:** retorna o ID da cena atual, ou `null` enquanto nenhuma cena estiver carregada. É uma leitura; use `api.irParaCena(id)` para navegar.

**Erro comum:** comparar com o nome que aparece na tela em vez da chave declarada em `cenas`.

### `contexto.api`

**Serve para:** acessar as oito funções públicas do motor.

**Como usar:** não é uma função; é o objeto documentado em [Funções disponíveis](03-FUNCOES-DISPONIVEIS.md).

```js
contexto.api.mostrarMensagem("Você acendeu a vela.");
```

**Resultado esperado:** usa a mesma interface de mensagens do jogo. **Erro comum:** importar uma função interna do motor quando ela já existe na API.

### `contexto.camada`

**Serve para:** receber os elementos criados pela sua mecânica. É um elemento HTML posicionado sobre o cenário, com o mesmo espaço de referência das áreas clicáveis. Ele acompanha a proporção da imagem e não inclui as margens pretas da janela.

**Como usar:** não é uma função; adicione nela os elementos que criar.

```js
const efeito = document.createElement("div");
efeito.style.position = "absolute";
efeito.style.inset = "0";
efeito.style.pointerEvents = "none";
contexto.camada.append(efeito);
```

**Resultado esperado:** mostra o efeito na cena. **Erro comum:** uma camada escura interceptar todos os cliques. Para efeitos visuais, use `pointerEvents: "none"`. Um botão próprio que precise receber cliques pode ter `pointerEvents: "auto"`.

### `contexto.ouvir(alvo, evento, funcao, opcoes)`

**Serve para:** registrar um evento com limpeza automática.

**Parâmetros:** `alvo`, a camada ou um elemento que já esteja dentro dela; `evento`, texto como `"click"`; `funcao`, callback; `opcoes`, configurações opcionais do listener.

```js
const botao = document.createElement("button");
botao.textContent = "Acender vela";
botao.style.pointerEvents = "auto";
contexto.camada.append(botao);

const pararEscuta = contexto.ouvir(botao, "click", () => {
    contexto.api.mostrarMensagem("A vela foi acesa.");
});
```

**Resultado esperado:** executa o callback ao clicar. Retorna uma função que pode ser chamada para remover a escuta antes do fim. O motor também remove a escuta ao encerrar a mecânica.

**Erros comuns:** registrar em `window`, `document` ou elementos internos do motor; esquecer de inserir o botão na camada antes de chamar `ouvir`.

### `contexto.aoMoverPonteiro(funcao)`

**Serve para:** acompanhar o ponteiro dentro da cena, sem acessar listeners internos.

**Parâmetro:** callback que recebe um objeto `{ x, y }`, com posições em porcentagens de 0 a 100.

```js
const pararPonteiro = contexto.aoMoverPonteiro(({ x, y }) => {
    efeito.style.background = `radial-gradient(circle at ${x}% ${y}%, transparent 50px, rgba(0,0,0,.95) 160px)`;
});
```

**Resultado esperado:** atualiza o efeito quando o mouse se move pelo cenário. Retorna uma função para cancelar a escuta. O `efeito` deste exemplo precisa ter sido criado e inserido na camada.

**Erros comuns:** interpretar `x` e `y` como pixels ou esperar coordenadas da janela inteira. São porcentagens do cenário.

Não crie um cabeçalho ou painel permanente na campanha para controlar a navegação geral. O motor já oferece o menu de pausa. Os controles específicos da mecânica podem ficar na camada que ela recebe, desde que façam sentido para o recurso e não encubram pistas ou saídas.

O menu de pausa abre as opções do jogo. Ele não suspende os temporizadores de `agendar` e `repetir`; esses recursos continuam contando enquanto o nível estiver ativo. Considere esse comportamento ao criar uma mecânica que dependa de tempo.

### `contexto.agendar(funcao, ms)`

**Serve para:** executar algo uma vez depois de um intervalo de tempo.

**Parâmetros:** callback e duração em milissegundos, como `1000` para um segundo.

```js
const cancelarAviso = contexto.agendar(() => {
    contexto.api.mostrarMensagem("A chama está ficando fraca.");
}, 3000);
```

**Resultado esperado:** apresenta o aviso após três segundos se a mecânica continuar ativa. O recurso é cancelado quando o nível encerra. O retorno permite cancelá-lo antecipadamente.

**Erros comuns:** passar segundos como se fossem milissegundos ou usar `setTimeout` diretamente e esquecer de cancelar na limpeza.

### `contexto.repetir(funcao, ms)`

**Serve para:** executar algo várias vezes enquanto a mecânica está ativa.

**Parâmetros:** callback e intervalo em milissegundos.

```js
let acesa = true;
const pararPiscar = contexto.repetir(() => {
    acesa = !acesa;
    efeito.style.opacity = acesa ? "1" : "0.85";
}, 1000);
```

**Resultado esperado:** alterna a intensidade do efeito a cada segundo. O retorno permite interromper a repetição, e o motor encerra o recurso automaticamente no fim.

**Erros comuns:** usar intervalo zero ou muito curto sem necessidade; criar novas repetições a cada movimento do mouse; esquecer que o código continua sendo chamado até o cancelamento.

## Limpeza e limites

Remova elementos e libere qualquer outro recurso próprio na função de limpeza. Prefira `ouvir`, `aoMoverPonteiro`, `agendar` e `repetir` aos eventos e timers nativos, porque o motor conhece esses recursos e os cancela automaticamente. Não guarde a API para usá-la depois de sair do nível.

Essas regras ajudam a organizar o código e reduzir erros. A mecânica ainda executa JavaScript na mesma página e não está em uma sandbox de segurança. A revisão do professor e as regras de arquivos continuam necessárias.

Se um recurso não puder ser criado com esse contexto, descreva ao professor o que falta antes de tentar acessar a implementação interna.
