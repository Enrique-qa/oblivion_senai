// Uso em um nível de exemplo: importe esta função e acrescente mecanica: ativarVela.
// A camada escurece apenas o cenário. Os controles e modais continuam acessíveis.
export default function ativarVela(contexto) {
    const { camada, ouvir, aoMoverPonteiro } = contexto;
    let ativa = false;
    let ponteiro = { x: 50, y: 50 };

    const sombra = document.createElement("div");
    Object.assign(sombra.style, {
        position: "absolute",
        inset: "0",
        pointerEvents: "none"
    });

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "Acender vela";
    botao.setAttribute("aria-pressed", "false");
    Object.assign(botao.style, {
        position: "absolute",
        top: "18px",
        left: "18px",
        pointerEvents: "auto",
        padding: "10px 16px",
        border: "1px solid #b8a36d",
        borderRadius: "6px",
        background: "#14231d",
        color: "#eee3c7",
        font: "inherit",
        cursor: "pointer"
    });
    camada.append(sombra, botao);

    function atualizarLuz() {
        sombra.style.background = ativa
            ? `radial-gradient(circle at ${ponteiro.x}% ${ponteiro.y}%, transparent 0, transparent 55px, rgba(5, 10, 7, .18) 95px, rgba(5, 10, 7, .94) 225px)`
            : "none";
    }

    const pararClique = ouvir(botao, "click", () => {
        ativa = !ativa;
        botao.textContent = ativa ? "Apagar vela" : "Acender vela";
        botao.setAttribute("aria-pressed", String(ativa));
        atualizarLuz();
    });

    const pararPonteiro = aoMoverPonteiro(({ x, y }) => {
        ponteiro = { x, y };
        if (ativa) atualizarLuz();
    });

    return function desativarVela() {
        pararClique();
        pararPonteiro();
        sombra.remove();
        botao.remove();
    };
}
