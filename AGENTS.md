# Orientações para assistentes de programação

OBLIVION é um jogo didático de terror psicológico, feito com HTML, CSS e JavaScript com módulos ES. Não há frameworks, dependências externas ou compilação. Leia o README e os documentos relevantes em `docs/` antes de editar.

## Trabalho de um estúdio

Quando a tarefa for apresentada como trabalho de um aluno ou estúdio, confirme o número pelo pedido ou contexto. Se o número estiver ausente, peça essa informação antes de modificar arquivos.

Um estúdio pode editar somente:

- `js/studios/estudio-NN/`
- `assets/studios/estudio-NN/`

Substitua `NN` pelo número com dois dígitos, de `01` a `05`. Não edite motor, campanha, HTML, CSS compartilhado, exemplos, documentos, scripts, testes ou arquivos de outros estúdios. Se uma mudança no motor for necessária, descreva a necessidade para o professor. Não tente contornar a API pública acessando o DOM do motor ou seus módulos internos.

Use o contrato de `docs/02-COMO-CRIAR-UM-NIVEL.md`, a API de `docs/03-FUNCOES-DISPONIVEIS.md` e o contexto da mecânica de `docs/04-MECANICA-EXCLUSIVA.md`. Preserve os IDs dos níveis. Não instale bibliotecas, não adicione etapas de compilação e não altere o registro central para marcar um nível como pronto.

## Trabalho do professor ou manutenção da estrutura

As restrições de pastas acima se aplicam aos estúdios. Uma tarefa autorizada pelo professor para criar ou manter a estrutura pode modificar os arquivos compartilhados necessários. Não peça aprovação extra para o que já foi autorizado no pedido.

## Verificação e entrega

- Execute `npm run validar` quando Node.js estiver disponível.
- Execute `npm test` ao alterar o motor ou regras compartilhadas.
- Teste no navegador pelo servidor local, usando `dev.html` para níveis de estudantes.
- Confira o nível individual, sua sequência e o reinício de estados.
- Informe os arquivos alterados, o comportamento resultante e o que foi testado. Se um teste não puder ser executado, diga isso claramente.

Não afirme que uma função foi testada apenas porque o código foi escrito. Não implemente os 15 níveis de alunos como parte de uma manutenção da estrutura, salvo pedido explícito do professor.
