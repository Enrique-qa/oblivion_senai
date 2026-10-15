import { validarResposta } from "./input.js";
import { resolverAsset } from "./loader.js";

function elemento(tag, classe, texto) {
    const item = document.createElement(tag);
    if (classe) item.className = classe;
    if (texto !== undefined) item.textContent = texto;
    return item;
}

export function criarModal(game) {
    const dialog = game.elements.modal;
    let token = 0;
    let focoAnterior;
    const fechar = () => {
        token++;
        if (dialog.open) dialog.close();
        if (focoAnterior?.isConnected) focoAnterior.focus();
        else if (focoAnterior) {
            const equivalente = [...game.elements.hotspots.children].find(item => item.dataset.objectId === focoAnterior.dataset?.objectId);
            if (equivalente) equivalente.focus();
            else {
                game.elements.stage.setAttribute("tabindex", "-1");
                game.elements.stage.focus({ preventScroll: true });
            }
        }
        focoAnterior = undefined;
    };
    dialog.addEventListener("click", event => {
        if (event.target === dialog) {
            const r = dialog.getBoundingClientRect();
            if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) fechar();
        }
    });
    dialog.addEventListener("cancel", event => { event.preventDefault(); fechar(); });
    return {
        close: fechar,
        open(id) {
            const modal = game.level.modais?.[id];
            if (!modal) throw new Error(`O modal "${id}" não existe neste nível.`);
            fechar();
            game.elements.message.hidden = true;
            const abertura = ++token;
            dialog.dataset.apresentacao = modal.apresentacao ?? "padrao";
            focoAnterior = document.activeElement;
            const content = elemento("div", "modal-content");
            const close = elemento("button", "modal-close", "×");
            close.type = "button";
            close.setAttribute("aria-label", "Fechar aproximação");
            close.addEventListener("click", fechar);
            const heading = elemento("h2", "modal-heading", modal.titulo);
            heading.id = "modal-title";
            dialog.setAttribute("aria-labelledby", heading.id);
            content.append(close, heading, elemento("p", "modal-text", modal.texto));
            if (modal.imagem) {
                const image = elemento("img", "modal-image");
                image.alt = modal.apresentacao === "nota" ? `${modal.titulo}. ${modal.texto}` : modal.titulo;
                image.src = resolverAsset(modal.imagem, game.moduleUrl);
                image.addEventListener("error", () => {
                    if (abertura === token) game.report(new Error(`Modal "${id}": a imagem "${modal.imagem}" não foi encontrada.`));
                }, { once: true });
                content.append(image);
            }
            if (modal.enigma) {
                const enigma = modal.enigma;
                const form = elemento("form", "answer-form");
                const label = elemento("label", "answer-label", enigma.rotulo ?? "Sua resposta");
                label.htmlFor = "answer-input";
                const input = elemento("input", "answer-input");
                input.id = "answer-input";
                input.type = "text";
                input.autocomplete = "off";
                input.required = true;
                input.maxLength = 200;
                input.placeholder = enigma.placeholder ?? "Digite a resposta";
                const feedback = elemento("p", "answer-error");
                feedback.id = "answer-feedback";
                feedback.setAttribute("aria-live", "polite");
                input.setAttribute("aria-describedby", feedback.id);
                const submit = elemento("button", "answer-submit", "Confirmar resposta");
                submit.type = "submit";
                let resolvido = false;
                form.addEventListener("submit", event => {
                    event.preventDefault();
                    if (resolvido || abertura !== token || game.completed) return;
                    if (!validarResposta(input.value, enigma.resposta)) {
                        feedback.textContent = enigma.mensagemErro ?? "Essa resposta não funcionou. Procure mais pistas.";
                        input.setAttribute("aria-invalid", "true");
                        input.focus();
                        return;
                    }
                    resolvido = true;
                    submit.disabled = true;
                    fechar();
                    if (enigma.mensagemSucesso) game.showMessage(enigma.mensagemSucesso);
                    game.run(() => enigma.aoAcertar(game.api));
                });
                form.append(label, input, feedback, submit);
                content.append(form);
            }
            dialog.replaceChildren(content);
            dialog.showModal();
            if (modal.aoAbrir) game.run(() => modal.aoAbrir(game.api));
        }
    };
}
