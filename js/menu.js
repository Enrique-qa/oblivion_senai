import { loadProgress, saveProgress, clearProgress } from "./core/state.js";
import { ordemCampanha } from "./campaign/order.js";
import { registroNiveis } from "./campaign/registry.js";
import { urlJogo } from "./core/progression.js";

const newButton = document.querySelector("#new-game");
const continueButton = document.querySelector("#continue-game");
const saveNote = document.querySelector("#save-note");
const warning = document.querySelector("#storage-warning");
const dialog = document.querySelector("#new-game-dialog");
let progress = null;

function warn(error) {
    warning.textContent = `${error.message} Você ainda pode jogar, mas talvez não consiga continuar depois.`;
    warning.hidden = false;
}

function refreshProgress() {
    try {
        const saved = loadProgress();
        progress = saved && ordemCampanha.includes(saved.nivel) && registroNiveis[saved.nivel] ? saved : null;
        continueButton.disabled = !progress;
        saveNote.textContent = progress
            ? `Progresso salvo: ${registroNiveis[progress.nivel].estudio.startsWith("estudio-") ? `Estúdio ${Number(registroNiveis[progress.nivel].estudio.slice(-2))} · ` : ""}${registroNiveis[progress.nivel].nome}.`
            : "Seu progresso será salvo ao passar de nível, neste navegador.";
    } catch (error) {
        progress = null;
        continueButton.disabled = true;
        saveNote.textContent = "Nenhum progresso disponível.";
        warn(error);
    }
}

function beginNewGame() {
    if (dialog.open) dialog.close();
    let destination = urlJogo(ordemCampanha[0]);
    try {
        clearProgress();
        saveProgress(ordemCampanha[0]);
    } catch (error) {
        warn(error);
        destination += "&salvamento=off";
    }
    newButton.disabled = true;
    continueButton.disabled = true;
    window.location.assign(destination);
}

newButton.addEventListener("click", () => {
    refreshProgress();
    if (progress) dialog.showModal();
    else beginNewGame();
});
continueButton.addEventListener("click", () => {
    refreshProgress();
    if (progress) window.location.assign(urlJogo(progress.nivel));
});
document.querySelector("#cancel-new-game").addEventListener("click", () => {
    dialog.close();
    newButton.focus();
});
document.querySelector("#confirm-new-game").addEventListener("click", beginNewGame);
dialog.addEventListener("close", () => { if (!newButton.disabled) newButton.focus(); });
window.addEventListener("pageshow", event => {
    newButton.disabled = false;
    if (event.persisted && dialog.open) dialog.close();
    refreshProgress();
});
window.addEventListener("storage", refreshProgress);
refreshProgress();
