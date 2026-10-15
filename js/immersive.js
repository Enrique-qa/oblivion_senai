// Tela cheia exige um clique/tecla do jogador. Nunca é solicitada automaticamente.
export async function alternarTelaCheia(doc = document) {
    if (doc.fullscreenElement) {
        await doc.exitFullscreen();
        return false;
    }
    if (doc.fullscreenEnabled === false || typeof doc.documentElement?.requestFullscreen !== "function") {
        throw new Error("Use F11 para jogar em tela cheia neste navegador.");
    }
    await doc.documentElement.requestFullscreen({ navigationUI: "hide" });
    return true;
}

export function prepararImersao({ stage, modal, podeAbrir }) {
    const pausa = document.querySelector("#pause-menu");
    const telaCheia = document.querySelector("#fullscreen-toggle");
    const status = document.querySelector("#fullscreen-status");
    let alternando = false;
    let saidaSolicitada = false;
    let estavaEmTelaCheia = Boolean(document.fullscreenElement);
    function atualizar() {
        telaCheia.textContent = document.fullscreenElement ? "Sair da tela cheia" : "Entrar em tela cheia";
        telaCheia.disabled = alternando || document.fullscreenEnabled === false || typeof document.documentElement.requestFullscreen !== "function";
        if (telaCheia.disabled && !alternando) {
            status.textContent = "Neste navegador, use F11 para tela cheia.";
            status.hidden = false;
        }
    }
    function fechar() {
        if (pausa.open) pausa.close();
        stage.focus({ preventScroll: true });
    }
    function abrir() {
        if (!podeAbrir() || modal.open || pausa.open) return;
        atualizar();
        pausa.showModal();
    }
    async function alternar() {
        if (alternando) return;
        alternando = true;
        saidaSolicitada = Boolean(document.fullscreenElement);
        atualizar();
        try {
            await alternarTelaCheia();
            status.hidden = true;
            fechar();
        } catch {
            saidaSolicitada = false;
            abrir();
            status.textContent = "Não foi possível ativar a tela cheia por aqui. Use F11 no navegador.";
            status.hidden = false;
        } finally { alternando = false; atualizar(); }
    }
    document.querySelector("#resume-game").addEventListener("click", fechar);
    telaCheia.addEventListener("click", alternar);
    pausa.addEventListener("cancel", event => { event.preventDefault(); fechar(); });
    stage.addEventListener("contextmenu", event => { event.preventDefault(); abrir(); });
    document.addEventListener("keydown", event => {
        if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || modal.open) return;
        if (event.key === "Escape") {
            event.preventDefault();
            if (pausa.open) fechar(); else abrir();
        }
        const digitando = event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable=true]");
        if (event.key.toLowerCase() === "f" && !digitando && podeAbrir()) {
            event.preventDefault();
            alternar();
        }
    });
    document.addEventListener("fullscreenchange", () => {
        const ativa = Boolean(document.fullscreenElement);
        atualizar();
        if (estavaEmTelaCheia && !ativa) {
            const saiuPeloControle = saidaSolicitada;
            saidaSolicitada = false;
            if (!saiuPeloControle) abrir();
        }
        if (ativa) saidaSolicitada = false;
        estavaEmTelaCheia = ativa;
    });
    atualizar();
    return Object.freeze({ abrir, fechar });
}
