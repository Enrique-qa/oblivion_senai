// O motor reconhece o fim da campanha pela ordem central.
export default {
    id: "professor-final",
    nome: "O último silêncio",
    cenaInicial: "estrada",
    cenas: {
        estrada: {
            imagem: "../../assets/shared/epilogo.svg",
            descricao: "O céu começa a clarear. A casa ficou para trás. Na estrada vazia, seus passos voltam a ser o único som.",
            objetos: [
                {
                    id: "seguir",
                    rotulo: "Seguir pela estrada e encerrar a campanha",
                    area: { x: 43, y: 70, largura: 24, altura: 26 },
                    acao: { tipo: "concluir" }
                }
            ]
        }
    }
};
