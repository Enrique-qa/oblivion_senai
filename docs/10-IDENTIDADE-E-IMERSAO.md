# Identidade e imersão

O cenário é o foco da campanha. A interface comum fica fora da exploração: não há cabeçalho, descrição em painel ou barra lateral permanente sobre a casa. Os controles gerais ficam no menu de pausa. `dev.html` continua sendo uma bancada separada, com seletores, estados e ferramentas de depuração.

A identidade combina azul e preto, com cenários escuros e controles discretos. O tutorial **A primeira porta** usa duas artes criadas para o projeto. O menu usa o novo vestíbulo como fundo. As imagens anexadas pelo professor orientam o conceito visual e ficam preservadas como referência.

## Imagem inteira e hitboxes

O motor mantém a proporção natural de cada cenário. Imagens podem ser largas, quadradas ou ter outros formatos. A cena ocupa o espaço disponível sem recorte ou distorção; margens pretas completam a janela quando as proporções diferem.

As camadas de objetos, saídas e mecânica acompanham a própria imagem. Uma área com `x: 50` começa na metade da imagem, mesmo quando há margens pretas. Não calcule hitboxes a partir da largura total do navegador nem transforme a arte em 16:9 para compensar uma área configurada incorretamente.

## Saídas que já estão desenhadas

Quando a arte contém sua própria seta, a configuração usa uma área clicável sobre ela:

```js
saidas: {
    esquerda: {
        cena: "casa",
        rotulo: "Voltar para a casa",
        area: { x: 5, y: 44, largura: 9, altura: 17 },
        aparencia: "integrada"
    }
}
```

O botão continua tendo rótulo e interação, mas o motor não desenha outro símbolo por cima. Ajuste os números à sua imagem. Quando a arte não tiver uma seta, use `aparencia: "padrao"` ou omita essa propriedade para mostrar o controle padrão. As saídas antigas com apenas o ID da cena continuam válidas.

O controle padrão usa um chevron vetorial azul gelo, com uma área de clique maior que o desenho, contraste sobre fundos escuros e foco visível. A animação de aproximação respeita a preferência por movimento reduzido. Sua aparência fica em `css/navigation.css` e funciona tanto na campanha quanto na prévia de desenvolvimento.

## Bilhetes ilustrados

`apresentacao: "nota"` mostra a imagem do bilhete em destaque, preservando o papel, as bordas e a escrita da arte, sem a moldura habitual dos modais. `titulo` e `texto` continuam no contrato e são usados por leitores de tela. Escreva uma transcrição útil da pista, sem acrescentar ao texto acessível uma solução que não esteja disponível visualmente.

Se o jogador precisar de uma instrução extra visível ou de um campo de resposta, use o modal `"padrao"`. Uma nota exige `imagem` e não aceita `enigma`. Consulte o exemplo de configuração em [Como criar um nível](02-COMO-CRIAR-UM-NIVEL.md).

## Pausa e tela cheia

| Controle | Comportamento |
| --- | --- |
| **Esc** ou **clique direito sobre o cenário** | Abrir as opções durante a exploração |
| **Esc** na pausa ou **Continuar explorando** | Fechar as opções e voltar ao cenário |
| **Tela cheia** na pausa ou **F** | Alternar o modo do documento usando a Fullscreen API, mediante ação do jogador |
| **F11** do navegador | Usar a tela cheia do próprio navegador, recomendada para permanecer nesse modo entre páginas |

O layout já usa a janela disponível mesmo sem tela cheia. A Fullscreen API pode ser encerrada quando `concluirNivel()` navega para outra página. A preferência do jogador não autoriza uma nova ativação automática: o navegador exige outra ação de mouse ou teclado. Não prometa que esse modo continuará ativo entre níveis. O modo do próprio navegador é controlado pelo navegador e pelo usuário.

Quando um bilhete ou enigma está aberto, **Esc** fecha a aproximação; outra pressão em **Esc** abre as opções. O menu de pausa não suspende os temporizadores das mecânicas; ele apresenta os controles gerais do jogo.

## Tipografia e marca

O tema compartilhado fica em `css/theme.css`. Ele declara a família de CSS `Oblivion Display`, procurando a fonte instalada com `local("Divergent")`, e usa Georgia e as alternativas declaradas no tema quando ela não está disponível.

Nenhum arquivo `.ttf`, `.otf` ou `.woff` da Divergent foi fornecido ou incorporado. A fonte exata não foi validada sem esse arquivo. Para distribuí-la no projeto, o professor deve fornecer o arquivo adequado e sua autorização de uso; a configuração local atual não baixa a fonte de um serviço externo.

A marca vetorial de apoio fica em `assets/shared/marca-oblivion.svg`. Ela não comprova a presença da fonte Divergent no computador. A referência visual fornecida permanece guardada com os demais materiais originais.

## Origem e organização dos assets

Os cenários do tutorial foram criados com ImageGen para este projeto. O bilhete foi feito em SVG, com o código `314` escrito como texto para preservar a legibilidade. Os prompts e o registro das novas artes estão em [Arte do tutorial](ARTE-TUTORIAL.md).

As imagens fornecidas pelo professor são referências de conceito. Seus nomes locais não indicam uma autoria ou licença diferente da origem. Mantenha os créditos do material de origem quando forem fornecidos.

| Material | Arquivos no projeto | Uso |
| --- | --- | --- |
| Cenários próprios, criados com ImageGen | `assets/shared/tutorial/vestibulo.png` e `porta.png` na mesma pasta | Tutorial do professor; o vestíbulo também aparece no menu |
| Bilhete tipográfico em SVG | `assets/shared/tutorial/bilhete.svg` | Pista do código `314` |
| Cenários anexados pelo professor | `assets/shared/original/casa.png`, `escadaria.png`, `porta.png`, `passagem.png` e `sacada.png` na mesma pasta | Referência de conceito |
| Bilhetes anexados pelo professor | `assets/shared/original/nota-ciano.png` e `nota-lilas.png` na mesma pasta | Referência de conceito |
| Outras referências fornecidas | `assets/shared/original/referencias/identidade.png` e `notas.png` na mesma pasta | Consulta da identidade e das notas |
| SVGs de apoio já existentes | `assets/shared/` | Exemplo didático, templates e outros recursos da estrutura |

O tutorial não reproduz o percurso nem os enigmas das imagens de conceito. Ele ensina a examinar o bilhete, mudar de cena e resolver uma única fechadura. Textos antigos que apareçam nas referências não mudam as regras atuais do projeto, a API nem as permissões dos estúdios. O contrato válido está na documentação e nos arquivos mantidos pelo professor.

Os estudantes continuam guardando suas próprias imagens em `assets/studios/estudio-NN/`. Eles podem consultar o material compartilhado, sem editar os originais, a marca ou o tema. Alterações nesses recursos pertencem ao professor.

## Arquivos envolvidos

| Área | Arquivos |
| --- | --- |
| Páginas | `index.html`, `jogo.html`, `dev.html` |
| Aparência | `css/menu.css`, `css/theme.css`, `css/immersive.css` |
| Opções e tela cheia | `js/immersive.js`, `js/play.js` |
| Proporções, notas e setas | `js/core/game.js`, `navigation.js`, `modal.js` e `validation.js` na mesma pasta |
| Abertura do professor | `js/campaign/inicio.js`, `js/campaign/tutorial.js`, `js/campaign/registry.js` |
| Materiais | `assets/shared/tutorial/`, `assets/shared/original/`, `assets/shared/marca-oblivion.svg` |
| Registro da arte criada | `docs/ARTE-TUTORIAL.md` |
| Testes | `tests/immersion.test.mjs` |
| Guias e prévias | `README.md`, documentos atualizados em `docs/` e `docs/imagens/` |
