import { criarApi } from "./api.js";
import { criarEstado } from "./state.js";
import { validarNivel } from "./validation.js";
import { resolverAsset } from "./loader.js";
import { desenharSaidas } from "./navigation.js";
import { desenharObjetos } from "./interaction.js";
import { criarModal } from "./modal.js";
import { ativarMecanica } from "./mechanics.js";

function carregarImagem(url, cena) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            if (!(image.naturalWidth > 0 && image.naturalHeight > 0)) reject(new Error(`Cena "${cena}": a imagem não tem dimensões válidas.`));
            else resolve(image.naturalWidth / image.naturalHeight);
        };
        image.onerror = () => reject(new Error(`Cena "${cena}": a imagem não foi encontrada. Confira o caminho e o nome do arquivo: ${url}`));
        image.src = url;
    });
}

export class Game {
    constructor({ elements, onComplete, onError, onStateChange, debug = false }) {
        for (const nome of ["stage", "image", "hotspots", "arrows", "mechanics", "modal", "message", "title", "description"]) {
            if (!elements[nome]) throw new Error(`O motor não encontrou o elemento de interface "${nome}".`);
        }
        this.elements = elements;
        this.onComplete = onComplete ?? (() => {});
        this.onError = onError;
        this.onStateChange = onStateChange;
        this.execution = 0;
        this.navigation = 0;
        this.completed = false;
        this.modal = criarModal(this);
        this.setDebug(debug);
    }

    async start(level, moduleUrl) {
        this.destroy();
        const execution = this.execution;
        const erros = validarNivel(level);
        if (erros.length) throw new Error(erros.join("\n"));
        this.level = level;
        this.moduleUrl = moduleUrl;
        this.completed = false;
        this.currentScene = null;
        this.api = criarApi(this, this.execution);
        this.state = criarEstado(level.estadoInicial, () => {
            this.renderInteractions();
            this.notifyState();
        });
        this.elements.title.textContent = level.nome;
        await this.navigate(level.cenaInicial);
        if (execution !== this.execution || this.completed) return;
        this.cleanupMechanic = ativarMecanica(this);
        this.notifyState();
    }

    async navigate(id) {
        if (this.completed) return;
        if (!Object.hasOwn(this.level.cenas, id)) throw new Error(`A cena "${id}" não existe neste nível.`);
        const request = ++this.navigation;
        const execution = this.execution;
        const cena = this.level.cenas[id];
        const url = resolverAsset(cena.imagem, this.moduleUrl);
        this.elements.stage.setAttribute("aria-busy", "true");
        try {
            const proporcao = await carregarImagem(url, id);
            if (request !== this.navigation || execution !== this.execution || this.completed) return;
            this.modal.close();
            this.elements.message.hidden = true;
            this.currentScene = id;
            this.elements.stage.style.setProperty("--scene-aspect", proporcao);
            this.elements.image.src = url;
            this.elements.image.alt = cena.descricao;
            this.elements.description.textContent = cena.descricao;
            this.renderInteractions();
            this.notifyState();
        } catch (erro) {
            if (request === this.navigation && execution === this.execution && !this.completed) throw erro;
        } finally {
            if (request === this.navigation) this.elements.stage.removeAttribute("aria-busy");
        }
    }

    renderInteractions() {
        if (!this.currentScene || this.completed) return;
        desenharObjetos(this);
        desenharSaidas(this);
    }

    showMessage(texto) {
        if (typeof texto !== "string" || !texto.trim()) throw new Error("mostrarMensagem() precisa receber um texto entre aspas.");
        const p = document.createElement("p");
        p.textContent = texto;
        const close = document.createElement("button");
        close.type = "button";
        close.className = "message-close";
        close.textContent = "×";
        close.setAttribute("aria-label", "Fechar mensagem");
        close.addEventListener("click", () => { this.elements.message.hidden = true; });
        this.elements.message.replaceChildren(p, close);
        this.elements.message.hidden = false;
    }

    async finish() {
        if (this.completed) return;
        this.completed = true;
        this.navigation++;
        this.elements.stage?.removeAttribute("aria-busy");
        this.modal.close();
        this.cleanupMechanic?.();
        this.cleanupMechanic = undefined;
        this.elements.hotspots.replaceChildren();
        this.elements.arrows.replaceChildren();
        await this.run(() => this.onComplete(this.level.id));
    }

    // Todos os callbacks dos alunos passam por aqui, inclusive promessas rejeitadas.
    async run(callback) {
        const execution = this.execution;
        try { return await callback(); }
        catch (erro) { if (this.execution === execution) this.report(erro); }
    }

    report(erro) {
        const mensagem = `${this.level?.nome ?? "Nível"}${this.currentScene ? ` — cena "${this.currentScene}"` : ""}: ${erro?.message ?? erro}`;
        console.error(mensagem, erro);
        if (this.onError) this.onError(new Error(mensagem));
        else this.showMessage("Não foi possível realizar essa ação. Volte ao menu e tente novamente.");
    }

    notifyState() { this.onStateChange?.(this.getState()); }
    getState() { return this.state?.snapshot() ?? {}; }
    setDebug(ativo) { this.elements.stage.classList.toggle("debug-hitboxes", Boolean(ativo)); }

    async restart() {
        if (!this.level) return;
        return this.start(this.level, this.moduleUrl);
    }

    destroy() {
        this.execution++;
        this.navigation++;
        this.completed = true;
        this.cleanupMechanic?.();
        this.cleanupMechanic = undefined;
        this.modal.close();
        this.elements.hotspots.replaceChildren();
        this.elements.arrows.replaceChildren();
        this.elements.mechanics.replaceChildren();
        this.elements.stage.removeAttribute("aria-busy");
        this.elements.message.hidden = true;
    }
}
