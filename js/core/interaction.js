import { atendeCondicao } from "./navigation.js";

function executarAcao(game, acao) {
    switch (acao.tipo) {
        case "mensagem": return game.api.mostrarMensagem(acao.texto);
        case "modal": return game.api.abrirModal(acao.id);
        case "cena": return game.api.irParaCena(acao.id);
        case "concluir": return game.api.concluirNivel();
    }
}

export function desenharObjetos(game) {
    const container = game.elements.hotspots;
    container.replaceChildren();
    for (const objeto of game.level.cenas[game.currentScene].objetos ?? []) {
        if (!atendeCondicao(objeto.visivelSe, game.state)) continue;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "hotspot";
        button.dataset.objectId = objeto.id;
        button.setAttribute("aria-label", objeto.rotulo);
        button.title = objeto.rotulo;
        button.disabled = !atendeCondicao(objeto.habilitadoSe, game.state);
        Object.assign(button.style, {
            left: `${objeto.area.x}%`, top: `${objeto.area.y}%`,
            width: `${objeto.area.largura}%`, height: `${objeto.area.altura}%`
        });
        const label = document.createElement("span");
        label.className = "hotspot-label";
        label.textContent = objeto.rotulo;
        button.append(label);
        button.addEventListener("click", () => game.run(() => objeto.aoClicar ? objeto.aoClicar(game.api) : executarAcao(game, objeto.acao)));
        container.append(button);
    }
}
