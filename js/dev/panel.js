import { Game } from "../core/game.js";
import { carregarNivel } from "../core/loader.js";
import { registroNiveis } from "../campaign/registry.js";

const DEV_KEY = "oblivion.dev.v1";
const params = new URLSearchParams(window.location.search);
const studioSelect = document.querySelector("#studio-select");
const levelSelect = document.querySelector("#level-select");
const debugToggle = document.querySelector("#debug-toggle");
const restartButton = document.querySelector("#restart-level");
const stage = document.querySelector("#stage");
const loading = document.querySelector("#loading");
const result = document.querySelector("#test-result");
const errorPanel = document.querySelector("#dev-error");
const warning = document.querySelector("#dev-storage-warning");
let game;
let currentId;
let sequenceStudio = params.get("sequencia");
let runOrder = [];
let saved = readDevData();
if (!params.has("nivel") && !params.has("sequencia") && typeof saved?.sequencia === "string") {
    sequenceStudio = saved.sequencia;
}

function notifyStorage(text) {
    warning.hidden = false;
    warning.textContent = text;
}

function readDevData() {
    try {
        const raw = sessionStorage.getItem(DEV_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.versao === 1 ? parsed : null;
    } catch {
        notifyStorage("O navegador não conseguiu recuperar os dados de testes. Você pode continuar testando normalmente.");
        return null;
    }
}

function levelsOf(studio) {
    return Object.keys(registroNiveis).filter(id => registroNiveis[id].estudio === studio)
        .sort((a, b) => (registroNiveis[a].numero ?? 0) - (registroNiveis[b].numero ?? 0));
}

function saveDevData(level = levelSelect.value, studio = studioSelect.value, sequence = sequenceStudio) {
    const data = { versao: 1, estudio: studio, nivel: level, sequencia: sequence, ordem: sequence ? levelsOf(sequence) : [level], debug: debugToggle.checked };
    try { sessionStorage.setItem(DEV_KEY, JSON.stringify(data)); }
    catch { notifyStorage("O navegador bloqueou os dados de testes. As funções do painel continuam disponíveis."); }
}

function populateLevels(studio, selected) {
    levelSelect.replaceChildren();
    for (const id of levelsOf(studio)) {
        const entry = registroNiveis[id];
        const option = document.createElement("option");
        option.value = id;
        option.textContent = `${entry.nome}${entry.pronto ? "" : " · rascunho"}`;
        levelSelect.append(option);
    }
    if (selected && [...levelSelect.options].some(option => option.value === selected)) levelSelect.value = selected;
}

function navigate(level, sequence = null) {
    if (!registroNiveis[level]) return;
    saveDevData(level, registroNiveis[level].estudio, sequence);
    const destination = new URL("./dev.html", window.location.href);
    destination.searchParams.set("nivel", level);
    if (sequence) destination.searchParams.set("sequencia", sequence);
    window.location.assign(destination.href);
}

function updateInspector() {
    document.querySelector("#state-scene").textContent = game?.currentScene ? `cena: ${game.currentScene}` : "";
    try {
        document.querySelector("#state-values").textContent = game ? JSON.stringify(game.getState(), null, 2) : "Nenhum estado disponível.";
    } catch { document.querySelector("#state-values").textContent = "Os estados ainda não estão disponíveis."; }
}

function showError(error) {
    game?.modal.close();
    loading.hidden = true;
    stage.setAttribute("aria-busy", "false");
    errorPanel.hidden = false;
    document.querySelector("#dev-error-title").textContent = game ? "O teste encontrou um problema." : "Não foi possível iniciar o teste.";
    document.querySelector("#dev-error-copy").textContent = error?.message ?? String(error);
    restartButton.disabled = !game?.level;
    updateInspector();
}

function updateRunMode() {
    document.querySelector("#run-mode").textContent = sequenceStudio
        ? `SEQUÊNCIA · ${studioSelect.selectedOptions[0].textContent.toUpperCase()} · ${runOrder.indexOf(currentId) + 1} / ${runOrder.length}`
        : "TESTE INDIVIDUAL";
}

function complete() {
    if (sequenceStudio) {
        const next = runOrder[runOrder.indexOf(currentId) + 1];
        if (next) { navigate(next, sequenceStudio); return; }
    }
    document.querySelector("#result-title").textContent = sequenceStudio ? "Sequência de testes concluída." : "Teste concluído.";
    document.querySelector("#result-copy").textContent = sequenceStudio
        ? "Você percorreu todos os níveis deste estúdio. Reinicie a sequência para repetir a verificação."
        : "Você chegou ao final deste nível. Reinicie para testar outro caminho.";
    result.hidden = false;
    document.querySelector("#result-restart").textContent = sequenceStudio ? "Repetir sequência" : "Testar novamente";
    updateInspector();
    result.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

async function restart() {
    if (!game?.level) return;
    restartButton.disabled = true;
    result.hidden = true;
    errorPanel.hidden = true;
    try {
        await game.restart();
        restartButton.disabled = false;
        updateInspector();
    } catch (error) { showError(error); }
}

async function start() {
    const requested = params.get("nivel");
    currentId = requested ?? (saved && registroNiveis[saved.nivel] ? saved.nivel : "nivel-exemplo");
    const entry = registroNiveis[currentId];
    if (!entry) {
        populateLevels(studioSelect.value);
        showError(new Error(`O nível "${currentId}" não está no registro. Escolha um nível pelo painel para iniciar um teste.`));
        return;
    }
    studioSelect.value = entry.estudio;
    populateLevels(entry.estudio, currentId);
    debugToggle.checked = Boolean(saved?.debug);
    if (sequenceStudio && sequenceStudio !== entry.estudio) {
        showError(new Error("A sequência escolhida não pertence ao estúdio deste nível. Use o botão de sequência no painel para começar novamente."));
        return;
    }
    runOrder = sequenceStudio ? levelsOf(sequenceStudio) : [currentId];
    updateRunMode();
    saveDevData();
    document.querySelector("#draft-badge").hidden = entry.pronto;
    document.title = `${entry.nome} — Testes OBLIVION`;
    stage.classList.toggle("debug-hitboxes", debugToggle.checked);
    try {
        const { nivel, url } = await carregarNivel(currentId, { permitirRascunho: true });
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
            onError: showError,
            onStateChange: updateInspector,
            debug: debugToggle.checked
        });
        await game.start(nivel, url);
        loading.hidden = true;
        stage.setAttribute("aria-busy", "false");
        if (errorPanel.hidden) restartButton.disabled = false;
        updateInspector();
    } catch (error) { showError(error); }
}

studioSelect.addEventListener("change", () => { populateLevels(studioSelect.value); saveDevData(levelSelect.value, studioSelect.value, null); });
levelSelect.addEventListener("change", () => saveDevData(levelSelect.value, studioSelect.value, null));
document.querySelector("#test-level").addEventListener("click", () => navigate(levelSelect.value));
document.querySelector("#test-sequence").addEventListener("click", () => navigate(levelsOf(studioSelect.value)[0], studioSelect.value));
restartButton.addEventListener("click", restart);
document.querySelector("#result-restart").addEventListener("click", () => {
    if (sequenceStudio) navigate(runOrder[0], sequenceStudio);
    else restart();
});
debugToggle.addEventListener("change", () => {
    stage.classList.toggle("debug-hitboxes", debugToggle.checked);
    game?.setDebug(debugToggle.checked);
    saveDevData();
});
document.querySelector("#clear-dev").addEventListener("click", async () => {
    try { sessionStorage.removeItem(DEV_KEY); }
    catch { notifyStorage("O navegador não conseguiu apagar os dados de testes. Verifique as permissões de armazenamento."); return; }
    saved = null;
    sequenceStudio = null;
    runOrder = currentId ? [currentId] : [];
    debugToggle.checked = false;
    stage.classList.remove("debug-hitboxes");
    game?.setDebug(false);
    const destination = new URL(window.location.href);
    destination.searchParams.delete("sequencia");
    window.history.replaceState(null, "", destination.href);
    updateRunMode();
    await restart();
    notifyStorage("Dados dos testes apagados e estados reiniciados. O progresso da campanha foi preservado.");
});
stage.addEventListener("click", updateInspector);
window.addEventListener("pagehide", () => game?.destroy());
window.addEventListener("pageshow", event => {
    if (event.persisted && game) restart();
});
start();
