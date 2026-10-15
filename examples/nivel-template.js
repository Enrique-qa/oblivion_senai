// Copie a estrutura para nivel1.js, nivel2.js ou nivel3.js do seu estúdio.
// Este arquivo não pertence à campanha. Ajuste o ID e os caminhos ao copiar.
export default {
    id: "nivel-template",

    // NOME DO NÍVEL
    nome: "Meu nível",

    // CENA INICIAL
    cenaInicial: "sala",
    estadoInicial: {},

    // CENAS
    cenas: {
        sala: {
            imagem: "../assets/shared/template.svg",
            descricao: "Escreva uma descrição curta da cena.",

            // OBJETOS INTERATIVOS
            objetos: [
                {
                    id: "bilhete",
                    rotulo: "Examinar o bilhete",
                    area: { x: 25, y: 48, largura: 13, altura: 10 },
                    acao: { tipo: "mensagem", texto: "Substitua esta mensagem pela sua pista." }
                },
                {
                    id: "porta",
                    rotulo: "Concluir o teste deste template",
                    area: { x: 66, y: 17, largura: 17, altura: 51 },
                    acao: { tipo: "concluir" }
                }
            ],
            saidas: {}
        }
    },

    // ENIGMA: veja a configuração pronta em nivel-exemplo.js.
    // RESPOSTA: escreva-a como texto dentro do objeto enigma.
    modais: {}

    // MECÂNICA EXCLUSIVA: importe de ./mecanica.js e use mecanica: ativarMecanica.
};
