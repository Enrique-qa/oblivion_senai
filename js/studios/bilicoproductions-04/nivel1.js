import ativarMecanica from "./mecanica.js";

const QUARTO = "../../../assets/shared/sala.svg";
const CORREDOR = "../../../assets/shared/corredor.svg";
const FINAL = "../../../assets/shared/epilogo.svg";

export default {
    id: "estudio-04-nivel-01",
    nome: "A casa não esquece",
    cenaInicial: "quarto",
    estadoInicial: {
        pistaQuarto: false,
        pistaCozinha: false,
        pistaCorredor: false,
        gavetaAberta: false,
        cartaLida: false
    },
    mecanica: ativarMecanica,
    cenas: {
        quarto: {
            imagem: QUARTO,
            descricao: "23h47. Você acorda no próprio quarto. Há anotações, uma lixeira cheia e um silêncio que parece esconder uma discussão interrompida.",
            objetos: [
                {
                    id: "relogio",
                    rotulo: "Examinar o relógio parado",
                    area: { x: 7, y: 15, largura: 18, altura: 24 },
                    acao: { tipo: "modal", id: "relogio" }
                },
                {
                    id: "caderno",
                    rotulo: "Ler o caderno escolar",
                    area: { x: 25, y: 42, largura: 25, altura: 24 },
                    acao: { tipo: "modal", id: "caderno" }
                },
                {
                    id: "lixeira",
                    rotulo: "Examinar as latas",
                    area: { x: 65, y: 55, largura: 20, altura: 28 },
                    acao: { tipo: "modal", id: "lixeira" }
                }
            ],
            saidas: {
                direita: { cena: "corredor", rotulo: "Ir ao corredor" },
                cima: { cena: "gaveta", rotulo: "Examinar a escrivaninha" }
            }
        },
        corredor: {
            imagem: CORREDOR,
            descricao: "O corredor está silencioso. Uma fotografia no aparador parece ter sido virada para baixo.",
            objetos: [
                {
                    id: "fotografia",
                    rotulo: "Virar a fotografia",
                    area: { x: 30, y: 45, largura: 22, altura: 25 },
                    acao: { tipo: "modal", id: "fotografia" }
                }
            ],
            saidas: {
                esquerda: { cena: "quarto", rotulo: "Voltar ao quarto" },
                direita: { cena: "cozinha", rotulo: "Ir à cozinha" }
            }
        },
        cozinha: {
            imagem: QUARTO,
            descricao: "A cozinha está arrumada, mas há um papel escondido atrás da lista presa à geladeira.",
            objetos: [
                {
                    id: "lista",
                    rotulo: "Ler o papel atrás da lista",
                    area: { x: 65, y: 25, largura: 20, altura: 30 },
                    acao: { tipo: "modal", id: "lista" }
                }
            ],
            saidas: { esquerda: { cena: "corredor", rotulo: "Voltar ao corredor" } }
        },
        gaveta: {
            imagem: QUARTO,
            descricao: "A escrivaninha guarda uma gaveta com teclado numérico. A anotação no guarda-roupa indica a ordem: quarto, cozinha e corredor.",
            objetos: [
                {
                    id: "teclado",
                    rotulo: "Tentar o código da gaveta",
                    area: { x: 42, y: 50, largura: 20, altura: 22 },
                    aoClicar(api) {
                        if (!(api.obterEstado("pistaQuarto") && api.obterEstado("pistaCozinha") && api.obterEstado("pistaCorredor"))) {
                            api.mostrarMensagem("Encontre os três números e siga a ordem: quarto, cozinha e corredor.");
                            return;
                        }
                        api.abrirModal("teclado");
                    }
                }
            ],
            saidas: {
                esquerda: { cena: "quarto", rotulo: "Voltar ao quarto" },
                direita: {
                    cena: "quarto-pais",
                    rotulo: "Abrir a porta do quarto dos pais",
                    condicao: { chave: "gavetaAberta", valor: true },
                    mensagemBloqueio: "A porta está trancada. Encontre a chave guardada na gaveta."
                }
            }
        },
        "quarto-pais": {
            imagem: FINAL,
            descricao: "O quarto está silencioso. Sobre a mesa de cabeceira há uma carta dobrada.",
            objetos: [
                {
                    id: "carta",
                    rotulo: "Ler a carta da mãe",
                    area: { x: 25, y: 40, largura: 35, altura: 30 },
                    acao: { tipo: "modal", id: "carta" }
                },
                {
                    id: "janela",
                    rotulo: "Olhar o reflexo na janela",
                    area: { x: 65, y: 15, largura: 25, altura: 45 },
                    aoClicar(api) {
                        if (!api.obterEstado("cartaLida")) {
                            api.mostrarMensagem("Leia a carta antes de tentar sair.");
                            return;
                        }
                        api.concluirNivel();
                    }
                }
            ],
            saidas: { esquerda: { cena: "gaveta", rotulo: "Voltar ao corredor" } }
        }
    },
    modais: {
        relogio: {
            titulo: "23h47",
            texto: "O relógio parou nesse horário. Você se lembra de ter ouvido a voz da sua mãe pouco antes de acordar."
        },
        caderno: {
            titulo: "O caderno escolar",
            texto: "Entre exercícios incompletos, duas frases iguais: “Ele prometeu que seria a última vez.” O número 2 está circulado. A criança tentou registrar quantas vezes ouviu a promessa.",
            aoAbrir(api) { api.definirEstado("pistaQuarto", true); }
        },
        lixeira: {
            titulo: "Latas amassadas",
            texto: "A casa fica em silêncio por um tempo e depois tudo recomeça. A bebida não torna aceitável o medo que isso provoca na família."
        },
        fotografia: {
            titulo: "Uma fotografia virada",
            texto: "No verso, a mãe escreveu: “Uma única foto ficou virada porque eu não consegui olhar para ela naquela noite.” Ao lado, o número 1 está anotado a lápis.",
            aoAbrir(api) { api.definirEstado("pistaCorredor", true); }
        },
        lista: {
            titulo: "Um papel atrás da lista",
            texto: "A mãe anotou quatro tentativas de telefonar para buscar orientação. Ao lado, o número 4 está circulado. Ela escreveu que precisava manter o filho em segurança.",
            aoAbrir(api) { api.definirEstado("pistaCozinha", true); }
        },
        teclado: {
            titulo: "A gaveta com teclado",
            texto: "As pistas indicam quarto → cozinha → corredor. Digite os três números nessa ordem.",
            enigma: {
                resposta: "241",
                rotulo: "Código da gaveta",
                placeholder: "Três números",
                mensagemErro: "A gaveta continua trancada. Confira as pistas e a ordem.",
                mensagemSucesso: "A gaveta abre. Dentro há uma chave e uma carta.",
                aoAcertar(api) { api.definirEstado("gavetaAberta", true); }
            }
        },
        carta: {
            titulo: "A carta da mãe",
            texto: "“Você era meu filho, não meu protetor. As escolhas dos adultos são responsabilidade dos adultos. Procure alguém em quem confiar e conte a verdade.”",
            aoAbrir(api) { api.definirEstado("cartaLida", true); }
        }
    }
};
