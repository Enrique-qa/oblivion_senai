import ativarMecanica from "./mecanica.js";

// Template do Estúdio 2. Este nível ainda precisa de conteúdo próprio.
export default {
    id: "estudio-02-nivel-03",

    // NOME DO NÍVEL
    nome: "Nível 3 — Em construção",

    // CENA INICIAL
    cenaInicial: "sala",
    estadoInicial: {},

    // MECÂNICA EXCLUSIVA
    mecanica: ativarMecanica,

    // CENAS
    cenas: {
        sala: {
            // Para sua arte: "../../../assets/studios/estudio-02/sala.svg"
            imagem: "../../../assets/shared/template.svg",
            descricao: "Estúdio 2 · Nível 3. A história desta parte da casa ainda será escrita.",

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
