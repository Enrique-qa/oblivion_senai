import { registroNiveis } from "../campaign/registry.js";
import { validarNivel } from "./validation.js";

export function resolverAsset(caminho, urlModulo) {
    const url = new URL(caminho, urlModulo);
    if (!["http:", "https:", "file:"].includes(url.protocol)) throw new Error(`O caminho "${caminho}" não é uma imagem local válida.`);
    return url.href;
}

export async function carregarNivel(id, { permitirRascunho = false } = {}) {
    if (!Object.hasOwn(registroNiveis, id)) throw new Error(`O nível "${id}" não está registrado. Confira o ID escolhido.`);
    const registro = registroNiveis[id];
    if (!registro.pronto && !permitirRascunho) {
        const erro = new Error("Este nível está em construção. Seu progresso está guardado para quando ele for liberado.");
        erro.name = "NivelIndisponivelError";
        throw erro;
    }
    let modulo;
    try { modulo = await registro.carregar(); }
    catch (causa) { throw new Error(`Não foi possível abrir ${registro.estudio} — ${registro.nome}. Confira se o arquivo existe e se o JavaScript não tem erro de escrita. Detalhe: ${causa.message}`); }
    const erros = validarNivel(modulo.default);
    if (modulo.default?.id !== id) erros.unshift(`O id deve ser "${id}", igual ao ID registrado.`);
    if (erros.length) throw new Error(`${registro.estudio} — ${registro.nome}\n\n${erros.join("\n")}`);
    return { nivel: modulo.default, url: registro.arquivo.href, registro };
}
