import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { registroNiveis } from "../js/campaign/registry.js";
import { ordemCampanha } from "../js/campaign/order.js";
import { validarNivel } from "../js/core/validation.js";

const erros = [];
const entradas = Object.entries(registroNiveis);
const registroURL = new URL("../js/campaign/registry.js", import.meta.url);
const ids = new Set(entradas.map(([id]) => id));

if (!Array.isArray(ordemCampanha) || !ordemCampanha.length) {
    erros.push("Campanha: a ordem precisa ser um array com pelo menos um nível.");
} else {
    const vistos = new Set();
    for (const id of ordemCampanha) {
        if (vistos.has(id)) erros.push(`Campanha: o ID "${id}" aparece mais de uma vez na ordem.`);
        vistos.add(id);
        if (!ids.has(id)) erros.push(`Campanha: o nível "${id}" está na ordem, mas não está no registro.`);
    }
    for (const [id] of entradas) {
        if (id !== "nivel-exemplo" && !vistos.has(id)) {
            erros.push(`Registro: o nível "${id}" não foi incluído na ordem da campanha.`);
        }
    }
}

async function verificarImagem(caminho, url, contexto) {
    if (typeof caminho !== "string" || !caminho.trim()) return;
    try {
        const imagemURL = new URL(caminho, url);
        if (imagemURL.protocol !== "file:") {
            erros.push(`${contexto}: use uma imagem local do projeto. Não foi possível verificar "${caminho}".`);
            return;
        }
        const arquivo = await stat(fileURLToPath(imagemURL));
        if (!arquivo.isFile()) throw new Error("O caminho não é um arquivo.");
    } catch {
        erros.push(`${contexto}: a imagem "${caminho}" não foi encontrada. O caminho começa na pasta do arquivo do nível.`);
    }
}

for (const [id, registro] of entradas) {
    const quantidadeAntes = erros.length;
    try {
        const url = registro.arquivo instanceof URL ? registro.arquivo : new URL(registro.arquivo, registroURL);
        const modulo = await import(url.href);
        const nivel = modulo.default;
        if (nivel?.id !== id) erros.push(`${id}: o ID do arquivo precisa ser "${id}".`);
        const problemas = validarNivel(nivel);
        for (const problema of problemas) erros.push(`${id}: ${problema}`);
        for (const [cenaId, cena] of Object.entries(nivel?.cenas ?? {})) {
            await verificarImagem(cena?.imagem, url, `${id}, cena "${cenaId}"`);
        }
        for (const [modalId, modal] of Object.entries(nivel?.modais ?? {})) {
            if (modal?.imagem) await verificarImagem(modal.imagem, url, `${id}, modal "${modalId}"`);
        }
        if (erros.length === quantidadeAntes) {
            console.log(`OK ${id}${registro.pronto === false ? " (rascunho; teste em dev.html)" : ""}`);
        }
    } catch (erro) {
        erros.push(`${id}: não foi possível carregar o nível. Confira o arquivo e seus imports. ${erro.message}`);
    }
}

if (erros.length) {
    console.error(`\nForam encontrados ${erros.length} problema(s):\n${erros.map((erro) => `- ${erro}`).join("\n")}`);
    process.exitCode = 1;
} else {
    console.log(`\n${entradas.length} nível(is) com estrutura e imagens válidas. Rascunho válido ainda precisa de conteúdo e revisão do professor.`);
}
