export const atendeCondicao = (condicao, estado) => !condicao || estado.obter(condicao.chave) === condicao.valor;
const rotulos = { esquerda: "Voltar", direita: "Avançar", cima: "Avançar", baixo: "Voltar" };
const SVG_NS = "http://www.w3.org/2000/svg";

function criarIcone() {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "nav-icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const caminho = document.createElementNS(SVG_NS, "path");
    caminho.setAttribute("d", "M8 4 16 12 8 20");
    svg.append(caminho);
    return svg;
}

export function desenharSaidas(game) {
    const container = game.elements.arrows;
    container.replaceChildren();
    const cena = game.level.cenas[game.currentScene];
    for (const [direcao, config] of Object.entries(cena.saidas ?? {})) {
        const saida = typeof config === "string" ? { cena: config } : config;
        const button = document.createElement("button");
        button.type = "button";
        button.className = `nav-arrow nav-${direcao}`;
        if (saida.aparencia === "integrada") button.classList.add("nav-integrada");
        else button.append(criarIcone());
        if (saida.area) Object.assign(button.style, {
            left: `${saida.area.x}%`, top: `${saida.area.y}%`,
            width: `${saida.area.largura}%`, height: `${saida.area.altura}%`,
            right: "auto", bottom: "auto", transform: "none"
        });
        const nome = saida.rotulo ?? rotulos[direcao];
        button.setAttribute("aria-label", nome);
        button.title = nome;
        const permitida = atendeCondicao(saida.condicao, game.state);
        button.classList.toggle("is-locked", !permitida);
        button.addEventListener("click", () => game.run(() => {
            if (!atendeCondicao(saida.condicao, game.state)) {
                game.showMessage(saida.mensagemBloqueio ?? "Você ainda precisa encontrar algo antes de seguir.");
                return;
            }
            return game.navigate(saida.cena);
        }));
        container.append(button);
    }
}
