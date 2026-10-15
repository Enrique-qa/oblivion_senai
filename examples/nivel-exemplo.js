// Exemplo independente: explore a sala, leia a pista e abra a porta.
import ativarVela from "./mecanica-vela.js";

export default {
    id: "nivel-exemplo",
    nome: "Exemplo — O bilhete e a porta",

    // CENA INICIAL E ESTADO
    cenaInicial: "sala",
    estadoInicial: { leuPista: false },

    // CENAS
    cenas: {
        sala: {
            imagem: "../assets/shared/sala.svg",
            descricao: "Procure o bilhete sobre a mesa. Depois use a seta à direita para visitar o corredor.",

            // OBJETOS INTERATIVOS: posições em porcentagem da imagem.
            objetos: [
                {
                    id: "bilhete",
                    rotulo: "Ler o bilhete sobre a mesa",
                    area: { x: 24, y: 48, largura: 11, altura: 11 },
                    acao: { tipo: "modal", id: "pista" }
                }
            ],
            saidas: {
                direita: {
                    cena: "corredor",
                    rotulo: "Ir para o corredor",
                    condicao: { chave: "leuPista", valor: true },
                    mensagemBloqueio: "Leia o bilhete antes de ir ao corredor."
                }
            }
        },
        corredor: {
            imagem: "../assets/shared/corredor.svg",
            descricao: "Clique na fechadura da porta. A seta à esquerda leva de volta à pista.",
            objetos: [
                {
                    id: "fechadura",
                    rotulo: "Examinar a fechadura",
                    area: { x: 57, y: 42, largura: 6, altura: 16 },
                    acao: { tipo: "modal", id: "porta" }
                }
            ],
            saidas: { esquerda: "sala" }
        }
    },

    modais: {
        pista: {
            titulo: "Uma pista",
            texto: "O bilhete diz: “Use o ano 1947 para abrir a porta.”",
            imagem: "../assets/shared/bilhete.svg",
            aoAbrir(api) {
                api.definirEstado("leuPista", true);
            }
        },
        porta: {
            titulo: "Uma porta trancada",
            texto: "Informe o ano escrito no bilhete.",

            // ENIGMA
            enigma: {
                // RESPOSTA: texto para preservar zeros à esquerda.
                resposta: "1947",
                rotulo: "Ano escrito no bilhete",
                placeholder: "Quatro números",
                mensagemErro: "Essa resposta não abre a porta. Você pode voltar à sala.",
                mensagemSucesso: "Resposta correta!",
                aoAcertar(api) {
                    api.concluirNivel();
                }
            }
        }
    },

    // MECÂNICA EXCLUSIVA: a vela começa apagada e pode ser ativada pelo botão.
    mecanica: ativarVela
};
