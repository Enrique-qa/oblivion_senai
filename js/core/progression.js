import { ordemCampanha } from "../campaign/order.js";

export function proximoNivel(id, ordem = ordemCampanha) {
    if (!Array.isArray(ordem) || new Set(ordem).size !== ordem.length) throw new Error("A ordem da campanha contém IDs repetidos ou está inválida.");
    const posicao = ordem.indexOf(id);
    if (posicao < 0) throw new Error(`O nível "${id}" não está na ordem da campanha.`);
    return ordem[posicao + 1] ?? null;
}

export function urlJogo(id) {
    return `jogo.html?nivel=${encodeURIComponent(id)}`;
}
