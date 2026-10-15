export const CHAVE_PROGRESSO = "oblivion.campanha.v1";
export const valorSimples = valor => valor === null || ["string", "boolean"].includes(typeof valor) || (typeof valor === "number" && Number.isFinite(valor));

export function criarEstado(inicial = {}, aoMudar = () => {}) {
    const valores = { ...inicial };
    return {
        obter(chave) {
            if (!Object.hasOwn(valores, chave)) throw new Error(`O estado "${chave}" não existe. Declare-o em estadoInicial.`);
            return valores[chave];
        },
        definir(chave, valor) {
            if (!Object.hasOwn(valores, chave)) throw new Error(`O estado "${chave}" não existe. Declare-o em estadoInicial.`);
            if (!valorSimples(valor)) throw new Error(`O estado "${chave}" deve guardar texto, número, verdadeiro, falso ou null.`);
            valores[chave] = valor;
            aoMudar({ ...valores });
        },
        snapshot: () => ({ ...valores })
    };
}

function armazenamento() {
    try { return globalThis.localStorage; }
    catch { throw new Error("O navegador bloqueou o salvamento. Permita o armazenamento deste site para continuar depois."); }
}

export function loadProgress() {
    try {
        const salvo = armazenamento().getItem(CHAVE_PROGRESSO);
        if (!salvo) return null;
        let progresso;
        try { progresso = JSON.parse(salvo); } catch { return null; }
        if (progresso?.versao !== 1 || typeof progresso.nivel !== "string" || !progresso.nivel.trim()) return null;
        return { versao: 1, nivel: progresso.nivel, atualizadoEm: progresso.atualizadoEm };
    } catch {
        throw new Error("Não foi possível ler o progresso. O armazenamento do navegador pode estar bloqueado.");
    }
}

export function saveProgress(nivel) {
    if (typeof nivel !== "string" || !nivel.trim()) throw new Error("Não foi possível salvar: o nível não tem um ID válido.");
    try {
        armazenamento().setItem(CHAVE_PROGRESSO, JSON.stringify({ versao: 1, nivel, atualizadoEm: new Date().toISOString() }));
        return true;
    } catch {
        throw new Error("Não foi possível salvar o progresso. Verifique o espaço e as permissões de armazenamento do navegador.");
    }
}

export function clearProgress() {
    try { armazenamento().removeItem(CHAVE_PROGRESSO); return true; }
    catch { throw new Error("Não foi possível apagar o progresso. O navegador bloqueou o armazenamento."); }
}
