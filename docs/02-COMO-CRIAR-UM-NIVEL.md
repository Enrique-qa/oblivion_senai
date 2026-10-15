# Como criar um nível

Comece abrindo o `nivel1.js` que já existe na pasta do seu estúdio. Consulte o [mapa de pastas e números lógicos](01-COMO-O-PROJETO-FUNCIONA.md) e compare com `examples/nivel-exemplo.js`. Não substitua o ID pelo de outro estúdio nem crie um HTML novo.

## IDs obrigatórios

| Arquivo do Estúdio 2 | ID dentro do objeto |
| --- | --- |
| `js/studios/kiss-02/nivel1.js` | `estudio-02-nivel-01` |
| `js/studios/kiss-02/nivel2.js` | `estudio-02-nivel-02` |
| `js/studios/kiss-02/nivel3.js` | `estudio-02-nivel-03` |

Use o mesmo padrão de ID para o seu número lógico de estúdio, preservando os IDs que já estão nos arquivos. O sufixo da pasta JavaScript não determina esse número. Cada arquivo usa `export default` para entregar um objeto ao motor.

## Um nível pequeno e completo

Este exemplo pode ser adaptado no `nivel1.js` do Estúdio 2. Antes de executá-lo, coloque uma imagem chamada `sala.svg` em `assets/studios/estudio-02/`.

```js
export default {
    id: "estudio-02-nivel-01",
    nome: "A porta da sala",
    cenaInicial: "sala",
    estadoInicial: { leuBilhete: false },

    cenas: {
        sala: {
            imagem: "../../../assets/studios/estudio-02/sala.svg",
            descricao: "Há um bilhete perto da porta.",
            objetos: [
                {
                    id: "bilhete",
                    rotulo: "Examinar bilhete",
                    area: { x: 20, y: 55, largura: 15, altura: 15 },
                    acao: { tipo: "modal", id: "bilhete" }
                },
                {
                    id: "fechadura",
                    rotulo: "Examinar fechadura",
                    area: { x: 70, y: 35, largura: 10, altura: 20 },
                    habilitadoSe: { chave: "leuBilhete", valor: true },
                    acao: { tipo: "modal", id: "fechadura" }
                }
            ],
            saidas: {}
        }
    },

    modais: {
        bilhete: {
            titulo: "Um recado antigo",
            texto: "A fechadura guarda o ano 1947.",
            aoAbrir(api) {
                api.definirEstado("leuBilhete", true);
            }
        },
        fechadura: {
            titulo: "Fechadura",
            texto: "Digite o código de quatro números.",
            enigma: {
                resposta: "1947",
                rotulo: "Código da porta",
                placeholder: "Quatro números",
                mensagemErro: "A porta continua trancada.",
                mensagemSucesso: "A porta se abre.",
                aoAcertar(api) {
                    api.concluirNivel();
                }
            }
        }
    }
};
```

As hitboxes devem coincidir com os objetos desenhados na sua imagem. Os números do exemplo precisam ser ajustados ao cenário real.

## Campos do nível

| Campo | O que informar |
| --- | --- |
| `id` | ID fixo registrado para o seu arquivo |
| `nome` | Nome legível do nível |
| `cenaInicial` | Chave de uma cena existente em `cenas` |
| `estadoInicial` | Objeto com as chaves de estado e seus valores iniciais |
| `cenas` | Objeto com pelo menos uma cena |
| `modais` | Objeto com seus modais; use `{}` se não houver |
| `mecanica` | Opcional: função importada de `mecanica.js` |

Use valores simples no estado: textos, números finitos, `true`, `false` ou `null`. Não guarde arrays, elementos HTML ou objetos no estado. Declare todas as chaves antes de usar `api.definirEstado()`.

## Imagens e áreas clicáveis

O caminho de uma imagem começa na **pasta do arquivo do nível**, não no HTML. Saindo de `js/studios/kiss-02/` até a raiz são três `../`:

```js
imagem: "../../../assets/studios/estudio-02/cozinha.webp"
```

Use nomes simples em minúsculas, como `cozinha.webp`, e confira as letras: `Cozinha.webp` é outro nome em alguns servidores. As cenas podem ter qualquer proporção. O motor ajusta a área da cena à proporção original da imagem, sem recortar nem esticar, e usa margens pretas quando a janela tem outro formato. Não é necessário converter uma arte original para 16:9.

`area` usa porcentagens da própria imagem exibida, sem incluir as margens pretas da janela. `x` e `y` definem o canto superior esquerdo; `largura` e `altura` definem o tamanho. `x: 25` começa a um quarto da largura da imagem. Todos os valores devem caber entre 0 e 100; largura e altura precisam ser maiores que zero, e o fim da área não pode ultrapassar 100.

Cada objeto precisa de `id`, `rotulo`, `area` e **uma** forma de interação: `acao` ou `aoClicar`. IDs de objetos não podem se repetir dentro da mesma cena. `rotulo` explica o que o jogador pode examinar.

## As quatro ações prontas

```js
acao: { tipo: "mensagem", texto: "Há marcas na parede." }
acao: { tipo: "modal", id: "retrato" }
acao: { tipo: "cena", id: "corredor" }
acao: { tipo: "concluir" }
```

O modal ou a cena referenciado pelo ID precisa existir no nível. Quando precisar de lógica, substitua `acao` por uma função:

```js
aoClicar(api) {
    if (api.obterEstado("leuBilhete")) {
        api.abrirModal("fechadura");
    } else {
        api.mostrarMensagem("É melhor procurar uma pista primeiro.");
    }
}
```

Não coloque `acao` e `aoClicar` no mesmo objeto.

## Mostrar e habilitar objetos por estado

```js
visivelSe: { chave: "leuBilhete", valor: true }
habilitadoSe: { chave: "leuBilhete", valor: true }
```

`visivelSe` oculta a área quando a condição não é atendida. `habilitadoSe` deixa o objeto sem interação enquanto a condição não for atendida. A chave precisa existir em `estadoInicial`. A comparação exige o mesmo valor e tipo: `true` é diferente de `"true"`.

## Navegação por setas

Uma cena pode usar `esquerda`, `direita`, `cima` e `baixo` em `saidas`:

```js
saidas: {
    esquerda: "sala",
    direita: {
        cena: "cozinha",
        rotulo: "Entrar na cozinha",
        condicao: { chave: "abriuPorta", valor: true },
        mensagemBloqueio: "A porta está trancada."
    }
}
```

Esse exemplo requer as cenas `sala` e `cozinha` e o estado `abriuPorta`. A primeira saída é livre. A segunda exige uma condição e apresenta a mensagem quando está bloqueada. Ausência de uma direção significa que não há seta ali.

Para colocar uma seta no próprio caminho do cenário, informe `area` na saída. Escolha a direção que aponta para esse caminho: `cima` para avançar até uma porta ao fundo, por exemplo. No tutorial, a seta de ida fica no piso diante da porta e a de retorno aponta para trás, em vez de ocupar a margem da tela.

Quando a imagem já contém uma seta desenhada, configure a saída na área exata da arte:

```js
saidas: {
    direita: {
        cena: "cozinha",
        rotulo: "Entrar na cozinha",
        area: { x: 84, y: 44, largura: 10, altura: 16 },
        aparencia: "integrada"
    }
}
```

`area` usa as mesmas porcentagens dos objetos. Ela é opcional nas saídas padrão e obrigatória com `aparencia: "integrada"`, que mantém um botão acessível e clicável sem desenhar outra seta por cima da imagem. Use essa opção somente quando o jogador puder reconhecer a saída na arte. O valor `"padrao"`, também usado quando `aparencia` é omitida, mostra a seta fornecida pelo motor. Uma saída simples como `direita: "cozinha"` continua funcionando.

## Modais e enigmas

Cada modal possui `titulo` e `texto`. Pode ter `imagem` com caminho relativo ao nível e `aoAbrir(api)` para registrar uma pista.

A propriedade opcional `apresentacao` aceita `"padrao"` ou `"nota"`. O padrão mostra a janela habitual. Use `"nota"` para exibir uma imagem de bilhete grande, com seu formato preservado e sem a moldura habitual:

```js
bilhete: {
    titulo: "Bilhete encontrado na mesa",
    texto: "Transcrição acessível do texto que aparece no bilhete.",
    imagem: "../../../assets/studios/estudio-02/bilhete.png",
    apresentacao: "nota"
}
```

Em uma nota, `imagem` é necessária; `titulo` e `texto` continuam obrigatórios e ficam disponíveis para leitores de tela. A imagem deve conter a pista visível. Notas não podem conter `enigma`. Para campos de resposta ou instruções visíveis fora da imagem, use a apresentação padrão.

O campo opcional `enigma` cria um input e um botão de resposta. `resposta` deve ser um texto não vazio, incluindo códigos numéricos: escreva `"0042"`, preservando os zeros. A comparação ignora maiúsculas e minúsculas e espaços nas pontas, mas não remove acentos nem espaços no meio. `aoAcertar(api)` define o que acontece após o acerto e é obrigatório no enigma. As mensagens, `rotulo` e `placeholder` são opcionais.

O tutorial **A primeira porta**, na abertura do professor, usa o código `"314"`. O exemplo didático em `examples/nivel-exemplo.js` continua usando o bilhete e o ano `"1947"`. Em ambos os casos, a resposta é uma string e o motor cuida do campo de entrada e da comparação.

## Usar a mecânica

```js
import ativarMecanica from "./mecanica.js";

export default {
    // ... mantenha todos os campos do nível
    mecanica: ativarMecanica
};
```

Não chame a função no objeto: informe `mecanica: ativarMecanica`, sem `()`. O motor chama a função ao iniciar e encerra seus recursos quando sair ou reiniciar. Consulte [Mecânica exclusiva](04-MECANICA-EXCLUSIVA.md).

Depois de editar, use [Como testar](05-COMO-TESTAR.md). Somente o professor altera `registry.js` para liberar os níveis na campanha.
