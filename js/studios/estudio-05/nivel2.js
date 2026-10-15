import ativarMecanica from "./mecanica.js";

// Template do Estúdio 5. Este nível ainda precisa de conteúdo próprio.
export default {
    id: "estudio-05-nivel-02",

    // NOME DO NÍVEL
    nome: "Nível 2 — Em construção",

    // CENA INICIAL
    cenaInicial: "sala",
    estadoInicial: {},

    // MECÂNICA EXCLUSIVA
    mecanica: ativarMecanica,

    // CENAS
    cenas: {
        sala: {
            // Para sua arte: "../../../assets/studios/estudio-05/sala.svg"
            imagem: "../../../assets/shared/template.svg",
            descricao: "Estúdio 5 · Nível 2. A história desta parte da casa ainda será escrita.",

            // OBJETOS INTERATIVOS
            objetos: [
                {
                    id: "bilhete",
                    rotulo: "Examinar o bilhete",
                    area: { x: 25, y: 48, largura: 13, altura: 10 },
                    acao: {
                        tipo: "mensagem",
                        texto: "Nível em construção. O bilhete e a porta servem apenas para testar esta estrutura."
                    }
                },
                {
                    id: "porta",
                    rotulo: "Avançar para testar a sequência",
                    area: { x: 66, y: 17, largura: 17, altura: 51 },
                    acao: { tipo: "concluir" }
                }
            ],
            saidas: {}
        }
    },

    // ENIGMA E RESPOSTA: veja examples/nivel-exemplo.js antes de preencher.
    modais: {}
};
