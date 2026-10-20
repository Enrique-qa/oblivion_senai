import { Mecanica } from "./mecanica.js";

/*
 * ENTRE SOMBRAS — NÍVEL 1: A CASA NÃO ESQUECE
 * Point-and-click em JavaScript puro.
 * Os caminhos das imagens foram associados ao conteúdo visual dos arquivos:
 * quarto_e.jpeg = cozinha com geladeira; cozinha.jpeg = sala de estar.
 */

const O = (nome, x, y, acao, icone = "⌕") => ({ nome, icone, x, y, acao });
const E = (nome, acao) => ({ nome, acao });

const cenarios = {
  quarto: {
    nome: "Quarto do filho",
    imagem: "assets/quarto_a.jpeg",
    descricao: "23h47. Você acorda no próprio quarto. Há latas vazias, garrafas, anotações e um silêncio que parece esconder uma discussão interrompida. Você precisa entender o que aconteceu sem fazer barulho.",
    objetos: [
      O("Relógio digital", 8, 68, j => {
        if (!j.flagAtiva("examinou_relogio")) {
          j.ativarFlag("examinou_relogio");
          j.falar("O relógio está parado em 23h47. Você se lembra de ter ouvido a voz da sua mãe pouco antes de acordar. O horário parece importante, mas você ainda não sabe por quê.");
        } else j.falar("23h47. Os números continuam imóveis, como se aquela noite tivesse ficado presa dentro do relógio.");
      }),

      O("Gaveta do criado-mudo", 9, 78, j => {
        if (j.flagAtiva("gaveta_criado_aberta")) return j.falar("A gaveta já está aberta. Há poeira, um recibo antigo e marcas de algo que foi retirado às pressas.");

        j.mostrarEscolhas("A gaveta do criado-mudo", "A gaveta emperra. Dentro, você encontra uma pequena chave presa sob um recibo amassado.", [
          E("Pegar a chave", k => {
            k.ativarFlag("gaveta_criado_aberta");
            k.adicionarItem("chave_armario", "Chave pequena");
            k.falar("Você guarda a chave. O recibo mostra uma compra de bebidas feita tarde da noite, na mesma data de uma anotação rasurada no calendário da família.");
          }),
          E("Fechar a gaveta", k => k.falar("Você fecha a gaveta devagar para não fazer barulho."))
        ]);
      }),

      O("Caderno sobre a cama", 29, 58, j => {
        if (j.flagAtiva("pista_quarto")) return j.falar("O caderno registra duas promessas iguais e várias noites mal dormidas. O primeiro número da senha é 2.");

        j.mostrarEscolhas("O caderno escolar", "Entre exercícios incompletos há duas frases iguais, escritas em dias diferentes: “Ele prometeu que seria a última vez.” O número 2 está circulado. A criança tentou registrar quantas vezes já tinha ouvido aquela promessa.", [
          E("Guardar a pista", k => {
            k.ativarFlag("pista_quarto");
            k.adicionarItem("pista_dois", "Pista: número 2");
            k.falar("Você memoriza o número 2. O caderno também mostra faltas na escola e noites em que você não conseguiu dormir por causa das discussões.");
          }),
          E("Fechar o caderno", k => k.falar("Você fecha o caderno. A frase continua ecoando na sua cabeça."))
        ]);
      }),

      O("Lixeira com latas", 66, 65, j => {
        if (j.flagAtiva("examinou_lixeira")) return j.falar("As latas continuam ali. O quarto não parece o lugar de alguém que conseguiu descansar naquela noite.");

        j.ativarFlag("examinou_lixeira");
        j.adicionarItem("lata_vazia", "Lata amassada");
        j.falar("A lixeira está cheia de latas amassadas. Você reconhece o padrão: seu pai diz que vai parar, a casa fica em silêncio por um tempo e depois tudo recomeça. A bebida não torna aceitável o medo que isso provoca na família.");
      }),

      O("Bilhete no tapete", 58, 88, j => {
        if (j.flagAtiva("leu_promessa")) return j.falar("Você já leu o bilhete. A promessa termina sem explicar o que viria depois.");

        j.ativarFlag("leu_promessa");
        j.adicionarItem("bilhete_promessa", "Bilhete: ‘só mais uma’");
        j.falar("O papel diz: “Eu prometo que é só mais uma...” A frase foi interrompida. A letra parece a do seu pai. Não parece uma piada; parece parte de uma promessa repetida muitas vezes.");
      }),

      O("Guarda-roupa trancado", 80, 42, j => {
        if (j.flagAtiva("armario_aberto")) return j.falar("O guarda-roupa está aberto. A anotação explica que a senha segue a ordem quarto → cozinha → corredor.");
        if (!j.possuiItem("chave_armario")) return j.falar("O guarda-roupa está trancado. Examine o criado-mudo; talvez a chave esteja por perto.");

        j.mostrarEscolhas("O guarda-roupa", "A chave abre a trava. Atrás das roupas há uma caixa e uma anotação feita pela mãe: “A gaveta com teclado guarda o que eu não consegui dizer em voz alta. A sequência segue o caminho da casa: QUARTO → COZINHA → CORREDOR.”", [
          E("Pegar a anotação e a fotografia", k => {
            k.ativarFlag("armario_aberto");
            k.adicionarItem("ordem_codigo", "Ordem da senha: quarto → cozinha → corredor");
            k.adicionarItem("foto_familia", "Fotografia da família");
            k.falar("A fotografia mostra um dia antigo em que todos sorriam. A anotação não contém a senha completa; você precisará encontrar os três números pela casa.");
          }),
          E("Fechar o guarda-roupa", k => k.falar("Você deixa a caixa no lugar e fecha a porta do armário."))
        ]);
      }),

      O("Porta do quarto", 96, 49, j => {
        j.falar("Você abre a porta só o suficiente para espiar o corredor. A luz está acesa, mas não há ninguém à vista.");
        j.irPara("corredor");
      }),

      O("Examinar o quarto de outro ângulo", 48, 40, j => j.irPara("quarto_detalhe"))
    ]
  },

  quarto_detalhe: {
    nome: "Quarto do filho — escrivaninha",
    imagem: "assets/quarto_b.jpeg",
    descricao: "Da escrivaninha, você vê melhor a gaveta com teclado numérico. Há tarefas escolares inacabadas e vestígios de muitas noites iguais.",
    objetos: [
      O("Gaveta com teclado numérico", 39, 68, j => {
        if (j.flagAtiva("gaveta_senha_aberta")) return j.falar("A gaveta está aberta. Você já encontrou a chave e a carta que estavam guardadas ali.");
        if (!j.flagAtiva("armario_aberto")) return j.falar("A gaveta tem uma fechadura com teclado. Examine o guarda-roupa e encontre a anotação que explica a ordem dos números.");
        if (!(j.flagAtiva("pista_quarto") && j.flagAtiva("pista_cozinha") && j.flagAtiva("pista_corredor"))) return j.falar("O teclado aceita três algarismos. A anotação diz para seguir QUARTO → COZINHA → CORREDOR. Encontre uma pista em cada lugar.");

        j.mostrarEscolhas("A fechadura numérica", "Você reuniu os três números. A ordem anotada é quarto → cozinha → corredor. Qual sequência corresponde às pistas?", [
          E("Digitar 241", k => {
            k.ativarFlag("gaveta_senha_aberta");
            k.adicionarItem("chave_pais", "Chave do quarto dos pais");
            k.adicionarItem("carta_mae", "Carta da mãe");
            k.falar("A fechadura destrava. Dentro há uma chave e uma carta: “O problema com a bebida não começou ontem, e as promessas já não são suficientes. Nada disso é culpa de uma criança.”");
          }),
          E("Digitar 214", k => k.falar("A luz do teclado pisca vermelho. A ordem não corresponde às pistas. Você pode tentar novamente.")),
          E("Digitar 412", k => k.falar("A fechadura não abre. Lembre-se da ordem: quarto, cozinha e corredor.")),
          E("Cancelar", k => k.falar("Você se afasta do teclado e revisa mentalmente as pistas."))
        ]);
      }),

      O("Escrivaninha", 20, 47, j => j.mostrarEscolhas("A escrivaninha", "Há tarefas escolares incompletas e um desenho da casa. A criança desenhou a sala, a cozinha e o corredor, mas deixou a porta do quarto dos pais sem cor.", [
        E("Guardar o desenho", k => {
          k.adicionarItem("desenho_casa", "Desenho da casa");
          k.falar("O desenho parece uma tentativa de entender um lugar que deveria ser seguro.");
        }),
        E("Deixar no lugar", k => k.falar("Você deixa a folha sobre a mesa."))
      ])),

      O("Voltar ao quarto", 8, 45, j => j.irPara("quarto")),
      O("Ir ao corredor", 95, 44, j => j.irPara("corredor"))
    ]
  },

  corredor: {
    nome: "Corredor principal",
    imagem: "assets/corredor_a.jpeg",
    descricao: "O corredor está banhado por uma luz amarela. A porta do banheiro está entreaberta; no aparador há fotografias da família. Um estalo vem do outro lado da casa.",
    objetos: [
      O("Aparador e fotografia virada", 28, 66, j => {
        if (j.flagAtiva("pista_corredor")) return j.falar("A fotografia virada revelou o número 1. Você já registrou essa pista.");

        j.mostrarEscolhas("A fotografia no aparador", "Uma fotografia está virada para baixo. No verso, a mãe escreveu: “Uma única foto ficou virada porque eu não consegui olhar para ela naquela noite.” Ao lado, o número 1 está anotado a lápis.", [
          E("Guardar a pista", k => {
            k.ativarFlag("pista_corredor");
            k.adicionarItem("pista_um", "Pista: número 1");
            k.falar("Você encontrou o terceiro número: 1. A ordem correta depende da anotação escondida no guarda-roupa.");
          }),
          E("Deixar a fotografia", k => k.falar("Você recoloca a fotografia no aparador, sem virá-la novamente."))
        ]);
      }),

      O("Porta do banheiro", 72, 42, j => j.mostrarEscolhas("O banheiro", "A torneira pinga. No espelho, escrito com o dedo, há uma frase quase apagada: “Você não é responsável por consertar os adultos.”", [
        E("Ler a frase novamente", k => {
          k.ativarFlag("frase_espelho");
          k.falar("Você respira devagar. A frase parece ter sido escrita para você — ou por alguém que conhecia o seu medo.");
        }),
        E("Sair do banheiro", k => k.falar("Você deixa a porta entreaberta e volta ao corredor."))
      ])),

      O("Seguir até as portas dos quartos", 62, 53, j => j.irPara("corredor_quartos")),
      O("Ir para a sala", 10, 53, j => j.irPara("sala")),
      O("Voltar ao quarto do filho", 43, 45, j => j.irPara("quarto"))
    ]
  },

  corredor_quartos: {
    nome: "Corredor dos quartos",
    imagem: "assets/corredor_b.jpeg",
    descricao: "As portas estão diante de você. A porta do quarto dos pais parece mais escura que as outras. Do outro lado há um ruído baixo, parecido com alguém tentando falar sem voz.",
    objetos: [
      O("Porta do quarto dos pais", 76, 49, j => {
        if (!j.possuiItem("chave_pais")) return j.falar("A porta está trancada. Encontre a chave na gaveta com teclado numérico do quarto do filho.");
        if (j.flagAtiva("porta_pais_aberta")) return j.irPara("quarto_pais");

        j.mostrarEscolhas("A porta do quarto dos pais", "A chave encontrada na gaveta encaixa. Antes de girá-la, você ouve um sussurro do outro lado — fraco demais para entender.", [
          E("Destrancar e entrar", k => {
            k.ativarFlag("porta_pais_aberta");
            k.irPara("quarto_pais");
          }),
          E("Esperar um instante", k => k.falar("O sussurro cessa. A chave continua na sua mão."))
        ]);
      }),

      O("Porta do quarto do filho", 40, 50, j => j.irPara("quarto")),
      O("Fotografias no corredor", 54, 36, j => {
        j.ativarFlag("viu_fotos_corredor");
        j.falar("As fotografias mostram aniversários e passeios antigos. Em algumas, a mãe olha para o pai como se tentasse descobrir se ele estava presente de verdade.");
      }),
      O("Voltar ao corredor principal", 10, 60, j => j.irPara("corredor")),
      O("Seguir até a passagem da sala", 23, 42, j => j.irPara("corredor_lateral"))
    ]
  },

  corredor_lateral: {
    nome: "Passagem para a sala",
    imagem: "assets/sala_b.jpeg",
    descricao: "A passagem leva à sala. Uma luz fraca vem da cozinha; no aparador, uma moldura parece ter sido removida há pouco.",
    objetos: [
      O("Sala de estar", 17, 54, j => j.irPara("sala")),
      O("Voltar às portas dos quartos", 64, 49, j => j.irPara("corredor_quartos")),
      O("Examinar o aparador", 36, 64, j => j.falar("Há uma marca limpa na poeira, do tamanho de uma fotografia. Alguém retirou o retrato dali e levou-o para outro cômodo."))
    ]
  },

  sala: {
    nome: "Sala de estar",
    imagem: "assets/sala_a.jpeg",
    descricao: "Copos e uma garrafa ficaram sobre a mesa. A televisão está desligada, mas sua tela reflete a luz do corredor. A casa parece ter parado no meio de uma noite difícil.",
    objetos: [
      O("Televisão desligada", 20, 47, j => {
        if (!j.flagAtiva("reflexo_tv")) {
          j.ativarFlag("reflexo_tv");
          j.falar("Por um segundo, a tela reflete uma silhueta atrás de você. Quando se vira, não há ninguém. Talvez tenha sido apenas o reflexo da luz.");
        } else j.falar("A televisão continua desligada. O reflexo mostra apenas a sala vazia.");
      }),

      O("Mesa de centro", 42, 67, j => j.mostrarEscolhas("A mesa de centro", "Há copos, um controle remoto e um recibo amassado. No verso alguém escreveu: “Amanhã vou procurar ajuda. Não posso continuar prometendo e repetindo tudo de novo.” A promessa não prova que a mudança aconteceu.", [
        E("Guardar o recibo", k => {
          k.adicionarItem("recibo_sala", "Recibo com promessa");
          k.ativarFlag("leu_recibo_sala");
          k.falar("Você guarda o recibo. Procurar ajuda é importante, mas a promessa não apaga o que a família viveu.");
        }),
        E("Deixar o recibo", k => k.falar("Você deixa o recibo na mesa."))
      ])),

      O("Sofá", 54, 57, j => j.falar("A manta está caída no chão. Você se lembra de noites em que ficava aqui esperando o barulho cessar antes de voltar ao quarto. Nenhuma criança deveria precisar vigiar o humor de um adulto.")),

      O("Gaveta do móvel da televisão", 20, 70, j => {
        if (j.flagAtiva("examinou_gaveta_sala")) return j.falar("A folha incompleta já está com você. O número não informa quem deveria ter sido chamado.");

        j.mostrarEscolhas("A gaveta do móvel da televisão", "Dentro há controles e uma folha dobrada com números de telefones. Um deles está circulado, mas o papel foi rasgado antes de o nome ser escrito. Parece que alguém tentou encontrar ajuda.", [
          E("Guardar a folha", k => {
            k.ativarFlag("examinou_gaveta_sala");
            k.adicionarItem("folha_telefone", "Folha com telefones incompleta");
            k.falar("A folha não revela quem seria chamado, mas reforça a impressão de que alguém tentou procurar apoio.");
          }),
          E("Fechar a gaveta", k => k.falar("Você fecha a gaveta sem levar nada."))
        ]);
      }),

      O("Passagem para a cozinha", 85, 35, j => j.irPara("cozinha")),
      O("Observar a sala de outro ângulo", 50, 32, j => j.irPara("sala_detalhe")),
      O("Voltar ao corredor", 68, 43, j => j.irPara("corredor"))
    ]
  },

  sala_detalhe: {
    nome: "Sala — lado da janela",
    imagem: "assets/cozinha.jpeg",
    descricao: "A sala aparece por outro ângulo. O sofá está vazio e a mesa ainda tem marcas circulares de copos. A rua parece distante, como se a casa estivesse isolada do resto do mundo.",
    objetos: [
      O("Fotografia na mesa lateral", 88, 72, j => j.mostrarEscolhas("Uma fotografia antiga", "Na fotografia, sua mãe está ajoelhada para ficar da sua altura. No verso: “Você merece crescer sem ter medo de voltar para casa.”", [
        E("Guardar a fotografia", k => {
          k.adicionarItem("foto_mae", "Fotografia da mãe");
          k.ativarFlag("foto_mae_encontrada");
          k.falar("A lembrança é triste, mas também mostra que houve cuidado e afeto naquela família.");
        }),
        E("Deixar na mesa", k => k.falar("Você deixa a fotografia onde estava."))
      ])),
      O("Porta da cozinha", 83, 32, j => j.irPara("cozinha")),
      O("Voltar à sala", 13, 55, j => j.irPara("sala"))
    ]
  },

  cozinha: {
    nome: "Cozinha",
    imagem: "assets/quarto_e.jpeg",
    descricao: "A cozinha está arrumada, mas a geladeira guarda bilhetes e lembretes. Um café esfriou sobre a mesa. As marcas da noite parecem difíceis de entender num cômodo tão comum.",
    objetos: [
      O("Lista presa à geladeira", 83, 31, j => {
        if (j.flagAtiva("pista_cozinha")) return j.falar("O papel da mãe revelou o segundo número: 4. Você já registrou a pista da cozinha.");

        j.mostrarEscolhas("A lista na geladeira", "Atrás da lista há um papel da mãe. Ela anotou quatro tentativas de telefonar para buscar orientação. Ao lado, escreveu: “Não posso resolver isso por ele. Ele precisa aceitar ajuda, e eu preciso manter meu filho em segurança.” O número 4 está circulado.", [
          E("Guardar a pista", k => {
            k.ativarFlag("pista_cozinha");
            k.ativarFlag("recado_mae");
            k.adicionarItem("pista_quatro", "Pista: número 4");
            k.adicionarItem("recado_cozinha", "Recado da mãe");
            k.falar("Você encontrou o segundo número: 4. A mãe tentava buscar apoio, mas não podia controlar as escolhas do pai. A dependência não torna a violência aceitável, nem faz de uma criança responsável por impedir o que acontece.");
          }),
          E("Deixar o papel", k => k.falar("Você recoloca o papel atrás da lista de compras."))
        ]);
      }),

      O("Caneca de café frio", 49, 54, j => {
        j.ativarFlag("viu_calendario_escola");
        j.falar("A caneca está fria. No calendário, amanhã há uma apresentação escolar marcada com uma estrela. Você pediu ao pai que fosse assistir; ele disse que iria, mas depois voltou a beber.");
      }),

      O("Pia", 39, 39, j => j.falar("A água corre por alguns segundos e para. Você ouve um ruído distante no corredor. A casa parece responder aos sons que você faz.")),
      O("Porta de volta à sala", 96, 47, j => j.irPara("sala"))
    ]
  },

  quarto_pais: {
    nome: "Quarto dos pais",
    imagem: "assets/sala_c.jpeg",
    descricao: "O quarto está silencioso. Há uma cama desarrumada, uma fotografia virada para baixo e uma janela refletindo a luz do corredor. Parece que alguém acabou de sair daqui.",
    objetos: [
      O("Fotografia sobre a mesa de cabeceira", 10, 67, j => {
        if (!j.flagAtiva("retrato_pais_visto")) {
          j.ativarFlag("retrato_pais_visto");
          j.falar("Você vira a fotografia. Sua mãe está sorrindo ao seu lado, enquanto seu pai olha para longe. No verso: “Eu queria que ele aceitasse ajuda. Mas amar alguém não significa aceitar ser ferida.”");
        } else j.falar("A fotografia mostra a família antes de tudo mudar. Ela não apaga a dor, mas também não deixa que a história se resuma a ela.");
      }),

      O("Carta guardada", 79, 54, j => {
        if (!j.possuiItem("carta_mae")) return j.falar("A carta deve estar na gaveta com teclado numérico do quarto do filho.");

        j.mostrarEscolhas("A carta da mãe", "A carta diz: “Se alguma coisa acontecer comigo, não pense que deveria ter feito algo diferente. Você era meu filho, não meu protetor. O problema com a bebida destruiu a confiança desta casa, mas as escolhas dos adultos são responsabilidade dos adultos. Procure alguém em quem confiar e conte a verdade.”", [
          E("Ler até o fim", k => {
            k.ativarFlag("carta_lida_ate_fim");
            k.falar("A carta termina: “Se um dia você me vir de novo, não tenha medo. Eu só quero que a verdade seja ouvida.”");
          }),
          E("Dobrar a carta", k => k.falar("Você dobra a carta com cuidado e a guarda novamente."))
        ]);
      }),

      O("Janela escura", 55, 26, j => {
        if (!j.flagAtiva("carta_lida_ate_fim")) return j.falar("A janela reflete o quarto, mas você ainda não compreendeu tudo. Leia a carta guardada antes de tentar ir embora.");
        if (j.flagAtiva("nivel1_concluido")) return j.falar("O vidro voltou a refletir apenas o quarto. O primeiro capítulo está concluído; algo nesta casa ainda espera para ser revelado.");

        j.ativarFlag("nivel1_concluido");
        j.mostrarEscolhas("Uma presença no vidro", "No reflexo, sua mãe aparece atrás de você, embora o quarto esteja vazio. Ao longe, você ouve seu pai murmurar um pedido de perdão para alguém que não responde. Uma garrafa rola em algum cômodo. A figura não se aproxima; apenas olha para a porta, como se a casa finalmente fosse contar o que aconteceu. Você entende que não poderia ter controlado a bebida, as promessas ou as escolhas dos adultos. O medo que viveu não foi sua culpa. FIM DO NÍVEL 1 — A CASA NÃO ESQUECE.", [
          E("Ficar mais um instante", k => k.falar("O reflexo desaparece quando você pisca. O relógio continua marcando 23h47. A história ainda não terminou.")),
          E("Voltar ao corredor", k => k.irPara("corredor_quartos"))
        ]);
      }),

      O("Voltar ao corredor", 95, 58, j => j.irPara("corredor_quartos"))
    ]
  }
};

const jogo = new Mecanica(cenarios, "quarto");

export default jogo;