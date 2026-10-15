import { Game } from "./core/game.js";
import { saveProgress, clearProgress } from "./core/state.js";
import { carregarNivel } from "./core/loader.js";
import { proximoNivel, urlJogo } from "./core/progression.js";
import { ordemCampanha } from "./campaign/order.js";
import { prepararImersao } from "./immersive.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("nivel");
const stage = document.querySelector("#stage");
const loading = document.querySelector("#loading");
const restart = document.querySelector("#restart-level");
const warning = document.querySelector("#storage-warning");
const errorPanel = document.querySelector("#page-error");
let game;
let savingUnavailable = params.get("salvamento") === "off";
const imersao = prepararImersao({
    stage,
    modal: document.querySelector("#modal"),
    podeAbrir: () => Boolean(game && !game.completed && errorPanel.hidden)
});

function warnStorage(error) {
    savingUnavailable = true;
    warning.hidden = false;
    warning.textContent = error?.message ?? "O navegador não conseguiu salvar seu progresso. Permita o armazenamento deste site para continuar depois.";
}

function showError(error) {
    game?.destroy();
    imersao.fechar();
    loading.hidden = true;
    stage.setAttribute("aria-busy", "false");
    restart.disabled = true;
    document.body.classList.add("has-error");
    errorPanel.hidden = false;
    const draft = error?.name === "NivelIndisponivelError";
    document.querySelector("#scene-title").textContent = draft ? "Capítulo em construção" : "Nível indisponível";
    document.querySelector("#scene-description").textContent = "";
    document.querySelector("#error-title").textContent = draft ? "O próximo capítulo está em construção." : "Não foi possível abrir este nível.";
    document.querySelector("#error-copy").textContent = draft
        ? "Você chegou até aqui. Este nível será liberado quando o estúdio concluir o trabalho. Você pode voltar ao menu ou experimentar os rascunhos no ambiente de testes."
        : "Este cenário não pôde ser aberto. Volte ao menu e tente novamente. Se o problema continuar, avise seu professor.";
    if (!draft) console.error("OBLIVION: não foi possível abrir o nível.", error);
    if (id) document.querySelector("#error-dev-link").href = `./dev.html?nivel=${encodeURIComponent(id)}`;
}

function complete() {
    const next = proximoNivel(id);
    if (next) {
        try { saveProgress(next); }
        catch (error) { warnStorage(error); }
        const destination = new URL(urlJogo(next), window.location.href);
        if (savingUnavailable) destination.searchParams.set("salvamento", "off");
        window.location.assign(destination.href);
        return;
    }
    try { clearProgress(); }
    catch (error) { warnStorage(error); }
    game?.destroy();
    document.body.classList.add("has-error");
    errorPanel.hidden = false;
    restart.disabled = true;
    document.querySelector("#error-eyebrow").textContent = "UMA HISTÓRIA COMPLETA";
    document.querySelector("#error-title").textContent = "Você atravessou todas as portas.";
    document.querySelector("#error-copy").textContent = "A história de OBLIVION chegou ao fim. Volte ao menu para começar uma nova jornada.";
    document.querySelector("#error-dev-link").hidden = true;
}

async function start() {
    if (!id) {
        window.location.replace("./index.html");
        return;
    }
    if (!ordemCampanha.includes(id)) {
        showError(new Error("Este nível não faz parte da campanha. Abra o jogo pelo menu inicial."));
        return;
    }
    if (savingUnavailable) warnStorage();
    try {
        const { nivel, url } = await carregarNivel(id);
        document.title = `${nivel.nome} — OBLIVION`;
        game = new Game({
            elements: {
                stage,
                image: document.querySelector("#scene-image"),
                hotspots: document.querySelector("#hotspots"),
                arrows: document.querySelector("#arrows"),
                mechanics: document.querySelector("#mechanics"),
                modal: document.querySelector("#modal"),
                message: document.querySelector("#message"),
                title: document.querySelector("#scene-title"),
                description: document.querySelector("#scene-description")
            },
            onComplete: complete,
            onError: showError
        });
        await game.start(nivel, url);
        if (!errorPanel.hidden) return;
        loading.hidden = true;
        stage.setAttribute("aria-busy", "false");
        restart.disabled = false;
    } catch (error) { showError(error); }
}

restart.addEventListener("click", async () => {
    imersao.fechar();
    restart.disabled = true;
    try { await game?.restart(); }
    catch (error) { showError(error); return; }
    restart.disabled = false;
});
window.addEventListener("pagehide", () => { game?.destroy(); imersao.fechar(); });
window.addEventListener("pageshow", async event => {
    if (!event.persisted || !game || !errorPanel.hidden) return;
    try { await game.restart(); }
    catch (error) { showError(error); }
});
start();
