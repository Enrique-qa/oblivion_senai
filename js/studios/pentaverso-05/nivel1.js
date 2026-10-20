const CENARIO = "../../../assets/shared/exterior.svg";

export default {
    id: "estudio-01-nivel-01",
    nome: "O Jardim",
    cenaInicial: "jardim",
    estadoInicial: {
        leuArvore: false,
        leuCaixa: false,
        encontrouSenha: false
    },
    cenas: {
        jardim: {
            imagem: CENARIO,
            descricao: "O jardim da casa abandonada está silencioso. Uma marca na árvore, uma caixa de remédio vazia, um baú e a porta parecem fazer parte da mesma história.",
            objetos: [
                {
                    id: "arvore",
                    rotulo: "Ler a marca na árvore",
                    area: { x: 5, y: 15, largura: 22, altura: 60 },
                    acao: { tipo: "modal", id: "arvore" }
                },
                {
                    id: "caixa-remedio",
                    rotulo: "Examinar a caixa de remédio",
                    area: { x: 52, y: 66, largura: 12, altura: 12 },
                    acao: { tipo: "modal", id: "caixa-remedio" }
                },
                {
                    id: "bau",
                    rotulo: "Abrir o baú",
                    area: { x: 70, y: 62, largura: 14, altura: 14 },
                    aoClicar(api) {
                        if (!api.obterEstado("leuArvore") || !api.obterEstado("leuCaixa")) {
                            api.mostrarMensagem("O baú está trancado. Leia as pistas da árvore e da caixa de remédio.");
                            return;
                        }
                        api.definirEstado("encontrouSenha", true);
                        api.abrirModal("bau");
                    }
                },
                {
                    id: "capsulas",
                    rotulo: "Examinar as cápsulas no chão",
                    area: { x: 30, y: 78, largura: 30, altura: 14 },
                    acao: { tipo: "modal", id: "capsulas" }
                },
                {
                    id: "porta",
                    rotulo: "Tentar abrir a porta",
                    area: { x: 38, y: 20, largura: 20, altura: 45 },
                    aoClicar(api) {
                        if (!api.obterEstado("encontrouSenha")) {
                            api.mostrarMensagem("A porta está trancada. Encontre a senha escondida no baú.");
                            return;
                        }
                        api.abrirModal("porta");
                    }
                }
            ],
            saidas: {}
        }
    },
    modais: {
        arvore: {
            titulo: "Uma marca no tronco",
            texto: "Algo foi entalhado às pressas: “Eu só queria dormir. A resposta está na caixa.”",
            aoAbrir(api) { api.definirEstado("leuArvore", true); }
        },
        "caixa-remedio": {
            titulo: "Caixa de remédio",
            texto: "A caixa está vazia. No verso da bula rasgada, alguém escreveu: “Tomei demais. O que escondi está no baú.”",
            aoAbrir(api) { api.definirEstado("leuCaixa", true); }
        },
        capsulas: {
            titulo: "Cápsulas na grama",
            texto: "Dezenas de cápsulas estão espalhadas pelo jardim. Algumas ainda brilham sob a luz do poste."
        },
        bau: {
            titulo: "Dentro do baú",
            texto: "Entre papéis amassados, você encontra a senha da porta: 1947."
        },
        porta: {
            titulo: "A porta principal",
            texto: "O teclado ao lado da porta pede quatro números.",
            enigma: {
                resposta: "1947",
                rotulo: "Senha da porta",
                placeholder: "Quatro números",
                mensagemErro: "A fechadura continua trancada.",
                mensagemSucesso: "Um clique. A porta se abre devagar.",
                aoAcertar(api) { api.concluirNivel(); }
            }
        }
    }
};
