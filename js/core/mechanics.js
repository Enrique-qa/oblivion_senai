// Recursos registrados aqui são descartados ao sair ou reiniciar o nível.
export function ativarMecanica(game) {
    const camada = game.elements.mechanics;
    const limpezas = new Set();
    let encerrada = false;
    const registrar = limpar => {
        limpezas.add(limpar);
        return () => { if (limpezas.delete(limpar)) limpar(); };
    };
    const verificar = () => { if (encerrada) throw new Error("A mecânica já foi encerrada."); };
    const contexto = Object.freeze({
        api: game.api,
        camada,
        ouvir(alvo, evento, callback, opcoes) {
            verificar();
            if (!(alvo instanceof Element) || (alvo !== camada && !camada.contains(alvo))) throw new Error("A mecânica pode registrar ouvir() somente em sua camada ou em elementos criados dentro dela.");
            if (typeof callback !== "function") throw new Error("ouvir() precisa de uma função de evento.");
            const handler = e => game.run(() => callback(e));
            alvo.addEventListener(evento, handler, opcoes);
            return registrar(() => alvo.removeEventListener(evento, handler, opcoes));
        },
        aoMoverPonteiro(callback) {
            verificar();
            if (typeof callback !== "function") throw new Error("aoMoverPonteiro() precisa de uma função.");
            const handler = e => {
                const area = game.elements.stage.getBoundingClientRect();
                if (!area.width || !area.height) return;
                return game.run(() => callback({ x: Math.max(0, Math.min(100, (e.clientX - area.left) / area.width * 100)), y: Math.max(0, Math.min(100, (e.clientY - area.top) / area.height * 100)) }));
            };
            game.elements.stage.addEventListener("pointermove", handler);
            return registrar(() => game.elements.stage.removeEventListener("pointermove", handler));
        },
        agendar(callback, ms) {
            verificar();
            if (typeof callback !== "function" || !Number.isFinite(ms) || ms < 0) throw new Error("agendar() precisa de uma função e tempo em milissegundos maior ou igual a zero.");
            let remover;
            const id = setTimeout(() => { remover(); if (!encerrada) game.run(callback); }, ms);
            remover = registrar(() => clearTimeout(id));
            return remover;
        },
        repetir(callback, ms) {
            verificar();
            if (typeof callback !== "function" || !Number.isFinite(ms) || ms <= 0) throw new Error("repetir() precisa de uma função e intervalo positivo em milissegundos.");
            const id = setInterval(() => { if (!encerrada) game.run(callback); }, ms);
            return registrar(() => clearInterval(id));
        }
    });
    let limparAluno;
    const dispose = () => {
        if (encerrada) return;
        encerrada = true;
        for (const limpar of limpezas) { try { limpar(); } catch (erro) { game.report(erro); } }
        limpezas.clear();
        try { limparAluno?.(); } catch (erro) { game.report(erro); }
        camada.replaceChildren();
        camada.removeAttribute("style");
    };
    try {
        if (game.level.mecanica) {
            limparAluno = game.level.mecanica(contexto);
            if (typeof limparAluno !== "function") {
                limparAluno = undefined;
                throw new Error("A mecânica deve retornar uma função de limpeza. Veja mecanica-template.js.");
            }
        }
    } catch (erro) { dispose(); throw erro; }
    return dispose;
}
