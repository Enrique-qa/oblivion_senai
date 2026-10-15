# Como o projeto funciona

OBLIVION é um jogo para navegador em computadores com mouse. O jogador entra em uma casa abandonada, examina objetos, lê pistas e resolve enigmas. Cada estúdio cria três níveis dentro da mesma campanha.

## Motor, nível e mecânica

O **motor** desenha a tela, recebe cliques, mostra modais, compara respostas e controla a progressão. Seus arquivos ficam em `js/core/` e são mantidos pelos professores.

O **nível** é um objeto JavaScript exportado pelo arquivo `nivel1.js`, `nivel2.js` ou `nivel3.js`. Ele informa imagens, textos, áreas clicáveis, saídas e respostas. Para a maioria das interações, você só precisa escrever uma configuração.

A **mecânica exclusiva** é uma função do arquivo `mecanica.js`. Ela acrescenta um recurso próprio do estúdio, como iluminar a cena com uma vela. Usa uma camada e utilitários entregues pelo motor. Veja [Mecânica exclusiva](04-MECANICA-EXCLUSIVA.md).

## As pastas

```text
index.html                  Menu do jogador
jogo.html                   Página compartilhada dos níveis
dev.html                    Testes e ferramentas dos alunos
css/                        Aparência mantida pelo professor
js/core/                    Motor mantido pelo professor
js/campaign/order.js        Ordem da campanha
js/campaign/registry.js     Registro e disponibilidade dos níveis
js/campaign/inicio.js       Nível inicial do professor
js/campaign/final.js        Nível final do professor
js/studios/pentaverso-05/   Código do Estúdio lógico 1
assets/studios/estudio-01/  Imagens e recursos do Estúdio 1
examples/                   Exemplo e templates de consulta
assets/shared/              Imagens compartilhadas do professor
docs/                       Documentação
scripts/                    Servidor e validações
tests/                      Testes das regras do motor
```

O grupo pode **consultar** qualquer arquivo para aprender, mas só pode **modificar** as duas pastas da sua linha:

| Estúdio lógico | Pasta JavaScript | Pasta de assets |
| --- | --- | --- |
| `01` — `estudio-01` | `js/studios/pentaverso-05/` | `assets/studios/estudio-01/` |
| `02` — `estudio-02` | `js/studios/kiss-02/` | `assets/studios/estudio-02/` |
| `03` — `estudio-03` | `js/studios/maismais-03/` | `assets/studios/estudio-03/` |
| `04` — `estudio-04` | `js/studios/bilicoproductions-04/` | `assets/studios/estudio-04/` |
| `05` — `estudio-05` | `js/studios/estudio01-01/` | `assets/studios/estudio-05/` |

O número lógico aparece nos IDs dos níveis, nas pastas de assets e nas branches `studio-01` a `studio-05`. O nome da pasta JavaScript é um nome físico e não muda esse número. Por exemplo, `pentaverso-05` usa IDs iniciados por `estudio-01-`, e `estudio01-01` usa IDs iniciados por `estudio-05-`. A ordem dos níveis continua definida pelo professor na campanha.

## Cenas e níveis são coisas diferentes

Uma cena é um ponto de vista do mesmo nível, como `sala`, `corredor` ou `cozinha`. Ao clicar em uma seta, o motor muda a imagem e os objetos sem trocar de página.

A campanha mostra a cena na janela disponível e preserva a proporção da imagem, com margens pretas quando necessário. Não há painéis permanentes durante a exploração. **Esc** ou **clique direito** abre o menu de pausa. O ambiente `dev.html` mantém seus controles e ferramentas para trabalhar nos níveis.

Um nível é um desafio completo. Ao terminar, chame:

```js
api.concluirNivel();
```

O motor salva o próximo nível e navega para uma URL como `jogo.html?nivel=estudio-01-nivel-02`. Essa navegação recarrega a página e encerra a mecânica anterior.

A opção de tela cheia do jogo usa a Fullscreen API e pode ser encerrada pelo navegador nessa navegação. O jogador pode reativá-la com **F** ou pelo menu de pausa. Para jogar em tela cheia atravessando as páginas, o modo do próprio navegador, ativado normalmente com **F11**, é o caminho recomendado.

## Ordem e disponibilidade

A campanha prevê 17 níveis: início do professor, três de cada um dos cinco estúdios e final do professor. Só `order.js` define a ordem. Os níveis não importam os próximos níveis e não escrevem suas URLs.

O registro central identifica o arquivo de cada nível e a propriedade `pronto`. Os 15 templates começam com `pronto: false`. Isso permite testar os rascunhos em `dev.html` e evita apresentá-los como conteúdo acabado da campanha. Quando estiverem revisados, o professor muda o registro.

## Estados e salvamento

Os estados declarados em `estadoInicial` pertencem somente ao nível atual. Uma pista pode mudar `leuBilhete` de `false` para `true`. Reiniciar, voltar a abrir a página ou usar **Continuar** restaura o estado inicial do nível.

O menu salva apenas o ponto de retomada da campanha. O armazenamento usa `localStorage`, não o cache de imagens do navegador. O modo de desenvolvimento usa dados separados e não sobrescreve o progresso do jogador.

Não existe inventário global nem dependência automática entre pistas de estúdios diferentes. Combine a narrativa com os professores antes de criar uma história que dependa de dados de outro grupo.
