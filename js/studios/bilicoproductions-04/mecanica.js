// Mecânica do Estúdio 4: uma luz fria acompanha o mouse e ajuda a observar a casa.
export default function ativarMecanica(contexto) {
    const luz = document.createElement("div");
    Object.assign(luz.style, {
        position: "absolute",
        inset: "0",
        pointerEvents: "none",
        background: "radial-gradient(circle at 50% 50%, transparent 4%, rgba(0, 8, 16, .28) 35%, rgba(0, 4, 10, .5) 100%)",
        transition: "background 90ms linear"
    });
    contexto.camada.append(luz);

    const pararPonteiro = contexto.aoMoverPonteiro(({ x, y }) => {
        luz.style.background = `radial-gradient(circle at ${x}% ${y}%, transparent 4%, rgba(0, 8, 16, .28) 35%, rgba(0, 4, 10, .5) 100%)`;
    });

    return function desativarMecanica() {
        pararPonteiro();
        luz.remove();
    };
}
