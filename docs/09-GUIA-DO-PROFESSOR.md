# Guia do professor

O repositório entrega a infraestrutura, dois níveis do professor, um exemplo e 15 templates de estudantes. A campanha completa depende do conteúdo criado e revisado em aula.

## Tutorial de abertura

O nível **A primeira porta**, com ID `professor-inicio`, apresenta as interações básicas com duas cenas e um único enigma. Começa em `vestibulo`, onde há um bilhete sobre a mesa à esquerda. A seta da direita leva à cena `porta`; a seta da esquerda permite voltar ao vestíbulo.

O bilhete mostra o código **314**. Ao abrir a fechadura na porta, uma resposta errada mantém o jogador no tutorial. Digitar `314` conclui o nível imediatamente por `api.concluirNivel()`: o motor salva o próximo nível e abre sua página, conforme a ordem central.

O estado `leuBilhete` registra a leitura para demonstrar o uso de estados. A pista é opcional para a lógica: ela não bloqueia a seta, a abertura da fechadura ou a validação da resposta. Reiniciar ou usar **Continuar** restaura esse estado, conforme o contrato.

`js/campaign/tutorial.js` apresenta apenas uma mensagem inicial transitória. Ele não adiciona um painel permanente nem outro desafio. As artes próprias das duas cenas ficam em `assets/shared/tutorial/` e foram criadas com ImageGen. O bilhete é um SVG com texto legível. A origem das imagens e os prompts ficam em [Arte do tutorial](ARTE-TUTORIAL.md).

O nível `examples/nivel-exemplo.js` permanece uma referência separada: mostra o bilhete com `1947`, a navegação e a fechadura. Os estudantes podem ler esse arquivo e o tutorial para entender configuração, estados e chamadas da API.

## Preparar a turma

1. Publique a estrutura em seu repositório e prepare as cinco branches conforme [Git e GitHub](06-GIT-E-GITHUB.md).
2. Configure seu usuário ou equipe real em `.github/CODEOWNERS`.
3. Proteja a `main` exigindo Pull Request, revisão e o check obrigatório.
4. Distribua os números lógicos dos estúdios e as duas pastas permitidas, conforme o [mapa de pastas](01-COMO-O-PROJETO-FUNCIONA.md).
5. Demonstre `npm start`, `dev.html` e o nível de exemplo antes de pedir o primeiro nível.

As regras de branch e o script de pastas ajudam a detectar enganos. A revisão e as permissões do repositório são a proteção contra alterações deliberadas da estrutura. Uma branch chamada `professor/...` não autentica a pessoa que a criou.

## Liberar um nível na campanha

Confira o conteúdo pelo `dev.html`, a validação e a sequência do estúdio. Depois edite somente a disponibilidade do nível em `js/campaign/registry.js`:

```js
// Exemplo: após a revisão do primeiro nível do Estúdio 1,
// o quarto argumento muda de false para true.
"estudio-01-nivel-01": registrar(
    "Nome do nível", "estudio-01",
    "../studios/pentaverso-05/nivel1.js", true, 1
)
```

Os nomes podem ser atualizados no registro para aparecerem nos seletores. Preserve os IDs. `registry.js` encontra os arquivos; não determina a sequência. Para mudar a ordem, edite somente `js/campaign/order.js` e execute `npm run validar`.

O nome físico das pastas JavaScript não muda os números lógicos. `pentaverso-05` corresponde a `estudio-01`, enquanto `estudio01-01` corresponde a `estudio-05`. Mantenha os IDs e a sequência existentes ao atualizar caminhos de arquivos; as pastas de assets e as branches continuam seguindo os números lógicos.

Não marque templates como prontos só para atravessar a campanha. Enquanto um próximo nível não estiver disponível, o jogador recebe uma mensagem, e os estudantes continuam testando independentemente no ambiente de desenvolvimento.

## Manter a estrutura

Ao corrigir o motor ou a documentação:

```powershell
npm run validar
npm test
```

Confira no navegador o menu, o exemplo, as setas, os modais, a sequência de um estúdio e a limpeza da mecânica. Para mudanças na progressão, confirme também **Novo jogo**, **Continuar** e o recarregamento real a cada nível.

Confira a campanha sem interface permanente e os controles de pausa por **Esc** e **clique direito**. Teste notas ilustradas e as áreas invisíveis de setas desenhadas na arte em mais de um tamanho de janela. Cenas não precisam ser 16:9: o motor conserva a proporção original e deixa margens pretas quando necessário.

Para uma sessão em tela cheia com navegação entre páginas, recomende **F11**. O botão do jogo e **F** usam a Fullscreen API, que o navegador pode encerrar ao trocar de documento. Uma nova ativação depende de outra ação do jogador. Não substitua as navegações reais apenas para esconder esse comportamento do navegador.

Use uma branch `professor/nome-da-tarefa` para alterações compartilhadas. Avise os grupos quando uma mudança exigir atualizar suas branches ou seus níveis. Procure manter a API pequena e compatível com o conteúdo já criado.

## Disponibilizar para jogar

O jogo é estático: o servidor precisa entregar o HTML, CSS, JavaScript e assets da pasta do projeto. Não há backend, compilação ou instalação de pacotes para hospedar. A escolha e a publicação no servidor ficam com o professor.

Cada computador mantém seu próprio progresso no navegador. Mudar o domínio, a porta ou o navegador começa outro armazenamento. As respostas dos enigmas estão no JavaScript entregue ao cliente; isso é adequado ao exercício, mas não representa um sistema de avaliação protegido contra inspeção do código.

O alvo inicial é computador com mouse. Inventário global, estados entre estúdios e salvamento de pistas no meio do nível não fazem parte do contrato inicial.

As imagens anexadas pelo professor são referências de conceito e ficam guardadas em `assets/shared/original/`. O tutorial e o fundo do menu usam as novas artes próprias. A organização desses materiais, a identidade em azul e preto e a situação da fonte Divergent estão registradas em [Identidade e imersão](10-IDENTIDADE-E-IMERSAO.md). O fallback tipográfico permite jogar sem a fonte instalada; a aparência exata da fonte só pode ser conferida quando ela estiver disponível.
