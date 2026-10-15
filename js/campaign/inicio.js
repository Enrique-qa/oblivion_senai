import ativarTutorial from "./tutorial.js";

export default {
    id: "professor-inicio",
    nome: "A primeira porta",
    cenaInicial: "vestibulo",
    estadoInicial: { leuBilhete: false },
    mecanica: ativarTutorial,

    cenas: {
        vestibulo: {
            imagem: "../../assets/shared/tutorial/vestibulo.png",
            descricao: "Um vestíbulo silencioso. Há um bilhete sobre a mesa à esquerda. A seta no piso aponta para a porta ao fundo.",
            objetos: [
                {
                    id: "bilhete",
                    rotulo: "Ler o bilhete sobre a mesa",
                    area: { x: 21, y: 54, largura: 13, altura: 10 },
                    acao: { tipo: "modal", id: "bilhete" }
                },
                {
                    id: "aproximar-porta",
                    rotulo: "Aproximar-se da porta",
                    area: { x: 60, y: 5, largura: 20, altura: 68 },
                    acao: { tipo: "cena", id: "porta" }
                }
            ],
            saidas: {
                cima: {
                    cena: "porta",
                    rotulo: "Ir até a porta",
                    area: { x: 67, y: 73, largura: 8, altura: 13 }
                }
            }
        },
        porta: {
            imagem: "../../assets/shared/tutorial/porta.png",
            descricao: "Uma porta de madeira com uma fechadura de três números. A seta no piso aponta para o caminho de volta ao bilhete, atrás de você.",
            objetos: [
                {
                    id: "fechadura",
                    rotulo: "Examinar a fechadura da porta",
                    area: { x: 35, y: 6, largura: 32, altura: 86 },
                    aoClicar(api) {
                        api.abrirModal("fechadura");
                    }
                }
            ],
            saidas: {
                baixo: {
                    cena: "vestibulo",
                    rotulo: "Voltar ao bilhete",
                    area: { x: 47, y: 90, largura: 8, altura: 9 }
                }
            }
        }
    },

    modais: {
        bilhete: {
            titulo: "O primeiro bilhete",
            texto: "A porta se lembra de três números: 314.",
            imagem: "../../assets/shared/tutorial/bilhete.svg",
            apresentacao: "nota",
            aoAbrir(api) {
                api.definirEstado("leuBilhete", true);
            }
        },
        fechadura: {
            titulo: "A primeira porta",
            texto: "Digite os três números do bilhete. Você pode voltar à mesa para ler a pista novamente.",
            enigma: {
                resposta: "314",
                rotulo: "Código da porta",
                placeholder: "Três números",
                mensagemErro: "Ainda não abriu. Volte ao bilhete na mesa e confira os três números.",
                mensagemSucesso: "A fechadura se abre.",
                aoAcertar(api) {
                    api.concluirNivel();
                }
            }
        }
    }
};
