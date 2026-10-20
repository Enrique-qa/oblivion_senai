import ativarMecanica from "./mecanica.js";

// Estúdio 4 (as mais mais) · Nível 1 — A negação
// Fluxo: portão (pistas) → jardim (caixa de correio com cadeado "AJUDA" → chave)
//        → varanda (porta trancada, exige a chave) → hall (final do nível).
export default {
    id: "estudio-03-nivel-01",
    nome: "Nível 1 — A negação",

    // CENA INICIAL E ESTADO
    cenaInicial: "portao",
    estadoInicial: { chaveEncontrada: false },

    // MECÂNICA EXCLUSIVA: Pincel de perícia (a implementar em mecanica.js)
    mecanica: ativarMecanica,

    // CENAS (percurso linear: portão → jardim → varanda → lateral)
    cenas: {
        portao: {
            // Arte final: "../../../assets/studios/estudio-04/nivel1/portao.svg"
            imagem: "../../../assets/shared/template.svg",
            descricao: "O portão da casa abandonada. Você veio investigar o caso. Observe a placa e a pasta do caso.",
            objetos: [
                {
                    id: "placa",
                    rotulo: "Ler a placa",
                    area: { x: 20, y: 40, largura: 14, altura: 12 },
                    acao: { tipo: "modal", id: "placa" }
                },
                {
                    id: "pasta",
                    rotulo: "Ver a pasta do caso",
                    area: { x: 60, y: 62, largura: 14, altura: 12 },
                    acao: { tipo: "modal", id: "pasta" }
                }
            ],
            saidas: {
                direita: { cena: "jardim", rotulo: "Entrar no jardim" }
            }
        },

        jardim: {
            imagem: "../../../assets/shared/template.svg",
            descricao: "O jardim abandonado. Há um bilhete e uma caixa de correio enferrujada perto do caminho.",
            objetos: [
                {
                    id: "bilhete",
                    rotulo: "Ler o bilhete",
                    area: { x: 25, y: 48, largura: 13, altura: 10 },
                    acao: { tipo: "modal", id: "bilhete" }
                },
                {
                    id: "caixa",
                    rotulo: "Examinar a caixa de correio",
                    area: { x: 62, y: 40, largura: 12, altura: 18 },
                    acao: { tipo: "modal", id: "caixa" }
                }
            ],
            saidas: {
                esquerda: "portao",
                direita: "varanda"
            }
        },

        varanda: {
            imagem: "../../../assets/shared/template.svg",
            descricao: "A varanda. A porta da casa está logo à frente e há um telefone velho na parede.",
            objetos: [
                {
                    id: "telefone",
                    rotulo: "Examinar o telefone",
                    area: { x: 15, y: 35, largura: 12, altura: 16 },
                    acao: { tipo: "modal", id: "telefone" }
                }
            ],
            saidas: {
                esquerda: "jardim",
                direita: "lateral",
                cima: {
                    cena: "hall",
                    rotulo: "Entrar na casa",
                    condicao: { chave: "chaveEncontrada", valor: true },
                    mensagemBloqueio: "A porta está trancada. Preciso achar a chave."
                }
            }
        },

        lateral: {
            imagem: "../../../assets/shared/template.svg",
            descricao: "A lateral da casa. Há cinzas no chão e uma lixeira tombada.",
            objetos: [
                {
                    id: "diario",
                    rotulo: "Examinar o papel queimado",
                    area: { x: 40, y: 60, largura: 14, altura: 10 },
                    acao: { tipo: "modal", id: "diario" }
                },
                {
                    id: "lixeira",
                    rotulo: "Olhar a lixeira",
                    area: { x: 72, y: 50, largura: 12, altura: 20 },
                    acao: { tipo: "mensagem", texto: "Só lixo. Nada útil aqui." }
                }
            ],
            saidas: { esquerda: "varanda" }
        },

        // FINAL DO NÍVEL: dentro da casa
        hall: {
            imagem: "../../../assets/shared/template.svg",
            descricao: "Você entra. Um barulho vem do andar de cima. Seu coração dispara... mas você pensa: “Não preciso de ajuda.”",
            objetos: [
                {
                    id: "seguir",
                    rotulo: "Seguir em frente, sozinha",
                    area: { x: 66, y: 17, largura: 17, altura: 51 },
                    acao: { tipo: "concluir" }
                }
            ],
            saidas: { esquerda: "varanda" }
        }
    },

    modais: {
        placa: {
            titulo: "A placa",
            texto: "A placa diz: “Não venha sozinha.” Alguém riscou quase tudo e sobraram só duas letras: A e J. Eu já fiz coisa pior sozinha."
        },
        pasta: {
            titulo: "A pasta do caso",
            texto: "Ordem de serviço: “Aguarde a equipe de apoio antes de entrar.” Não preciso esperar ninguém."
        },
        bilhete: {
            titulo: "Um bilhete",
            texto: "“Você não precisa resolver tudo sozinha!” Atrás do papel, escrito à mão, há mais duas letras: U e D. Quem deixou isso aqui? Eu dou conta."
        },
        telefone: {
            titulo: "O telefone quebrado",
            texto: "O telefone está quebrado. Alguém tentou pedir ajuda... No teclado há uma letra riscada com caneta: A. Não é o meu caso."
        },
        diario: {
            titulo: "O diário queimado",
            texto: "Sobrou só um pedaço de papel: “Eu sei o que você está fazendo.” Um calafrio. Mas sigo em frente."
        },

        // ENIGMA: a palavra do cadeado junta as letras das pistas, na ordem das cenas (A J · U D · A)
        caixa: {
            titulo: "A caixa de correio",
            texto: "A caixa está trancada por um cadeado de 5 letras. Junte as letras que você encontrou, na ordem do caminho.",
            enigma: {
                resposta: "AJUDA",
                rotulo: "Palavra do cadeado",
                placeholder: "Cinco letras",
                mensagemErro: "O cadeado não abre. Confira as pistas pelo caminho.",
                mensagemSucesso: "O cadeado abre. Há uma chave dentro da caixa.",
                aoAcertar(api) {
                    api.definirEstado("chaveEncontrada", true);
                }
            }
        }
    }
};
