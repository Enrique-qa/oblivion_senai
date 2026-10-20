# Como testar

Um nível pode passar na validação e ainda ter um enigma impossível ou uma área fora do objeto desenhado. Use o comando de validação e teste também no navegador.

## Iniciar o servidor

Na pasta do projeto:

```powershell
npm start
```

Com Node.js instalado, isso abre o servidor em `http://localhost:8000/`. Não execute `npm install`: o projeto não depende de pacotes externos. O terminal precisa continuar aberto. Use `Ctrl+C` para encerrar.

Live Server do VS Code é uma alternativa. Quem já usa Python pode executar `py -m http.server 8000` ou `python -m http.server 8000`. Use sempre o mesmo endereço e porta para encontrar o progresso salvo naquele endereço.

## Testar só um nível

1. Abra `http://localhost:8000/dev.html`.
2. Escolha o grupo pelo nome e o número do nível. Confira o arquivo, o ID, os assets e a branch esperada no painel. A indicação de branch é uma orientação; confira a branch real com `git branch --show-current`.
3. Clique em **Testar nível**.
4. Examine as pistas, teste as setas e tente respostas erradas e corretas.
5. Ao concluir, confira a mensagem de teste concluído.

Nenhum nível de outro estúdio precisa estar pronto. O motor carrega somente o arquivo escolhido. Templates de estudantes aparecem como **RASCUNHO** neste ambiente, mas podem ser executados.

Para entender um nível completo, escolha **Exemplo completo** no campo Estúdio. Para conferir a abertura e o encerramento da história, escolha **Professor**.

## Testar os três níveis do estúdio

Escolha seu estúdio e clique em **Testar sequência do estúdio**. O teste começa no primeiro dos três níveis e segue apenas entre eles. A conclusão do terceiro encerra a sequência.

Esse teste não depende da ordem dos outros estúdios e não salva o progresso da campanha. Assim, o Estúdio 4 pode terminar seu trabalho enquanto o Estúdio 1 ainda está criando os cenários.

O cabeçalho da prévia identifica o nível em execução. Trocar a seleção prepara o próximo teste; clique em **Testar nível** para carregá-lo.

## Reiniciar e limpar

Depois de salvar alterações no editor, use **Recarregar código do nível** para reabrir o nível em execução e carregar seus módulos novamente. Durante uma sequência, mantém o nível atual e a sequência. Se outro servidor mantiver arquivos antigos em cache, use também Ctrl+F5.


**Reiniciar nível** volta à cena inicial, restaura `estadoInicial` e encerra os eventos e efeitos da mecânica anterior. Use-o para verificar que uma pista não ficou marcada de uma tentativa anterior.

**Limpar dados de testes** apaga as preferências ou dados salvos pelo ambiente de desenvolvimento. O progresso de **Continuar** no menu usa outra chave e permanece separado.

## Ferramentas de ajuda

Ative **Mostrar áreas clicáveis** para ver onde os objetos podem receber cliques. Teste também com essa opção desativada para avaliar o que o jogador percebe.

O painel **Estados do nível** mostra as chaves e seus valores atuais. Abra um bilhete e confira se `leuBilhete` mudou de `false` para `true`, por exemplo.

Os erros aparecem no próprio ambiente. Quando houver um problema, leia o nível, cena e campo citados e consulte [Erros comuns](08-ERROS-COMUNS.md). O console do navegador, aberto com `F12`, pode ajudar com erros de sintaxe.

## Validação de arquivos

```powershell
npm run validar
```

O comando verifica os níveis registrados, incluindo templates, e confere:

- Estrutura obrigatória, tipos e IDs.
- Cena inicial, saídas, ações e modais referenciados.
- Áreas clicáveis e condições de estado.
- Campos obrigatórios dos enigmas.
- Existência dos arquivos de imagem.
- Registro e ordem central da campanha.

Um template válido ainda é um rascunho. O comando não consegue descobrir se o conteúdo é interessante, se a resposta está correta para a pista ou se o desenho combina com a hitbox. Quando aparecer **OK**, continue o teste visual.

`npm test` executa os testes de regras compartilhadas do motor. Os alunos normalmente não alteram essas regras; os professores executam esse comando quando mantêm a estrutura. Todos os comandos devem ser executados na raiz do projeto.

## Lista antes de entregar

- As imagens carregam e as hitboxes acompanham o cenário ao mudar o tamanho da janela.
- Cenas de proporções diferentes aparecem completas, sem distorção; áreas clicáveis e setas acompanham a imagem, não as margens pretas.
- As setas têm destinos válidos e as portas bloqueadas explicam o motivo.
- Quando uma seta está desenhada na arte, sua saída com `aparencia: "integrada"` coincide com o desenho e não mostra uma segunda seta.
- Cada modal abre e fecha sem impedir a exploração.
- As notas com `apresentacao: "nota"` preservam o formato e a legibilidade da imagem.
- Uma resposta errada não permite avançar; a correta executa o resultado esperado.
- O nível termina somente depois da solução pretendida.
- A mecânica não impede cliques por acidente e desaparece ao reiniciar ou mudar de nível.
- O estado volta ao início ao reiniciar.
- Os três níveis funcionam em sequência.
- Só as duas pastas do estúdio foram alteradas.

## Teste da campanha pelo professor

Depois da revisão, o professor marca os níveis prontos em `registry.js` e testa pelo menu. **Novo jogo** começa na abertura, **Continuar** retoma o último nível alcançado, e cada passagem de nível muda a URL e recarrega a página. Fechar e reabrir o navegador não deve apagar esse ponto de retomada, salvo quando o próprio navegador remove ou bloqueia o armazenamento.

Na campanha, confira a exploração sem cabeçalho ou painéis permanentes. Abra as opções com **Esc** e com **clique direito sobre o cenário**; volte usando **Esc** ou **Continuar explorando**. Se um modal estiver aberto, **Esc** fecha primeiro a aproximação. Faça também o teste em uma janela menor: a imagem deve continuar inteira e as áreas devem acompanhar seus objetos.

A opção **Tela cheia** e o atalho **F** dependem da Fullscreen API. A troca real de página pode encerrar esse modo, e sua reativação exige outra ação do jogador. Teste **F11**, a tela cheia do próprio navegador, para atravessar os níveis mantendo esse modo. Não considere a saída da Fullscreen API entre documentos como perda de progresso.

A abertura do professor é o tutorial **A primeira porta**, com duas cenas e um único código: `314`. O exemplo de aprendizado em **Exemplo completo** continua usando o ano `1947`. O percurso do tutorial está no [Guia do professor](09-GUIA-DO-PROFESSOR.md).
