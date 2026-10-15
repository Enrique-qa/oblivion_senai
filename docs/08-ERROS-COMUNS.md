# Erros comuns

Leia a mensagem inteira no ambiente de desenvolvimento. Ela normalmente informa o nível e o campo que precisam de correção. Depois teste novamente com **Reiniciar nível** ou **Testar nível**.

| Problema | O que conferir |
| --- | --- |
| Tela vazia ao abrir com dois cliques | Abra pelo servidor HTTP, usando `npm start` ou Live Server |
| Arquivo não carrega | Nome, extensão `.js`, pasta e caminhos dos imports |
| Erro de sintaxe | Vírgulas, aspas, chaves e parênteses; confira o console com `F12` |
| ID diferente do registro | Preserve o ID original do template; o nome físico da pasta JavaScript não redefine o número lógico |
| Cena inicial inexistente | `cenaInicial` deve ser uma chave de `cenas` |
| Seta aponta para cena inexistente | O destino precisa existir no mesmo nível |
| Modal não existe | O ID em `acao` ou `abrirModal` deve ser uma chave de `modais` |
| Área clicável inválida | Valores numéricos, tamanho positivo e área inteira entre 0 e 100 |
| IDs de objetos repetidos | Cada objeto precisa de ID diferente dentro da mesma cena |
| Objeto tem duas interações | Use apenas `acao` ou `aoClicar` |
| Estado não existe | Declare a chave em `estadoInicial` e confira a grafia |
| Resposta obrigatória ausente | Use uma string não vazia em `enigma.resposta` e declare `aoAcertar` |
| Imagem não encontrada | O caminho parte da pasta do arquivo do nível; confira maiúsculas e extensão |
| Imagem esticada ou área desalinhada | Preserve a proporção original; `area` usa porcentagens da imagem, sem incluir as margens pretas |
| Duas setas no mesmo lugar | Se a seta já faz parte da arte, use `aparencia: "integrada"` e configure sua `area` |
| Nota aparece sem imagem | `apresentacao: "nota"` exige `imagem`, além de `titulo` e `texto` acessíveis |
| Enigma dentro de nota foi rejeitado | Use `apresentacao: "padrao"` para modais com campo de resposta |
| Tela cheia encerrou ao mudar de nível | A Fullscreen API pode ser encerrada entre páginas; reative com uma ação ou use F11 no navegador |
| Campo fora do contrato | Confira a grafia na documentação, por exemplo `saidas`, no plural |
| Nível é rascunho na campanha | Teste em `dev.html`; só o professor altera a disponibilidade |
| Check rejeita branch ou pastas | Use o padrão da branch e edite só suas duas pastas |

## Caminho de imagem errado

No `js/studios/maismais-03/nivel1.js`, do Estúdio lógico 3, o caminho para sua imagem pode ser:

```js
imagem: "../../../assets/studios/estudio-03/sala.webp"
```

`"assets/studios/estudio-03/sala.webp"` procuraria uma pasta `assets` dentro da pasta do nível. Não coloque um caminho do computador, como `C:\\Users\\...`: os colegas não têm esse caminho.

## Saída com nome diferente

```js
// Se a cena se chama corredor, use esse mesmo ID.
saidas: { direita: "corredor" }
```

`"Corredor"`, `"corredor "` e `"corredor"` são IDs diferentes. Não use o título visível da cena como destino por engano.

## Estado não liberou a porta

Declare a chave, atualize-a e compare o mesmo tipo:

```js
// No objeto do nível:
estadoInicial: { abriuPorta: false }

// Na função que resolve o enigma:
api.definirEstado("abriuPorta", true);

// Na condição da saída:
condicao: { chave: "abriuPorta", valor: true }
```

Esses trechos pertencem a lugares diferentes do nível; não copie os três como um objeto único. A string `"true"` não é o booleano `true`. Use o painel de estados para acompanhar o valor.

## A resposta parece correta, mas não é aceita

`validarResposta` ignora maiúsculas e minúsculas e espaços nas extremidades. Ela preserva acentos e espaços no meio. Se o código é `"0042"`, use o texto com os zeros. Escreva a pista para que o jogador saiba o formato esperado.

No tutorial **A primeira porta**, o bilhete informa `314`. Digite somente esses três números no campo da fechadura. A leitura do bilhete ajuda a descobrir a resposta, mas não é uma condição para abrir o enigma ou passar de cena.

## Apareceram margens pretas

Isso pode acontecer quando a proporção da imagem difere da janela. O motor mantém a arte inteira, sem cortar nem esticar. Meça as hitboxes em porcentagens da imagem, não da janela toda. Não altere a imagem original para eliminar essas margens.

## A tela cheia não continuou no próximo nível

A passagem de nível abre outro documento. O navegador pode encerrar a tela cheia iniciada pela opção do jogo ou pela tecla **F**, que usam a Fullscreen API. O jogo não pode prometer reativação automática sem uma nova ação do jogador. Use o botão ou o atalho novamente; para manter o modo entre páginas, prefira **F11**, controlado pelo próprio navegador.

## A fonte está diferente em outro computador

O tema procura a fonte Divergent instalada localmente. Sem ela, usa uma fonte alternativa. Nenhum arquivo dessa fonte é distribuído neste projeto. O professor precisa fornecer o arquivo e a autorização de uso adequados antes de incorporá-la ao site. Veja [Identidade e imersão](10-IDENTIDADE-E-IMERSAO.md).

## A mecânica bloqueou os cliques

Um efeito visual sobre a cena deve usar `pointer-events: none`. Elementos próprios que precisam receber cliques podem usar `pointer-events: auto`. Registre eventos com `contexto.ouvir` depois de inserir o elemento em `contexto.camada`. Não use `document` ou `window` como alvo desse recurso.

Se um efeito ou evento continuar após o nível acabar, confira a função de limpeza e substitua timers nativos por `agendar` ou `repetir` do contexto. O motor limpa os recursos que foram registrados pelos seus utilitários.

## Continuar não aparece ou o progresso sumiu

O ponto de retomada fica no `localStorage` do endereço em que você jogou. `localhost:8000` e `localhost:5500` têm armazenamentos diferentes. Outro navegador, modo privado, limpeza de dados do site ou bloqueio de armazenamento pode remover ou impedir o salvamento.

O ponto salvo indica o nível alcançado. Ele não guarda todas as pistas dentro do nível; por isso **Continuar** começa o desafio atual com o estado inicial. Os testes de `dev.html` não criam progresso de campanha.

## Não consigo resolver sem alterar o motor

Descreva ao professor o nível, o que deveria acontecer e a função pública que você tentou usar. Mantenha a alteração dentro das suas pastas. O professor avalia a necessidade de melhorar o motor para todos os grupos.
