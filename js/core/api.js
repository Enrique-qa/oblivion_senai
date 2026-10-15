import { validarResposta } from "./input.js";

// Uma API por execução: callbacks antigos não controlam um nível reiniciado.
export function criarApi(game, execucao) {
    const ativo = () => {
        if (game.execution !== execucao || game.completed) throw new Error("Este nível já foi encerrado. Remova eventos e temporizadores da mecânica ao sair.");
    };
    return Object.freeze({
        irParaCena(id) { ativo(); return game.run(() => game.navigate(id)); },
        mostrarMensagem(texto) { ativo(); game.showMessage(texto); },
        abrirModal(id) { ativo(); game.modal.open(id); },
        fecharModal() { ativo(); game.modal.close(); },
        validarResposta,
        definirEstado(chave, valor) { ativo(); game.state.definir(chave, valor); },
        obterEstado(chave) { ativo(); return game.state.obter(chave); },
        concluirNivel() {
            if (game.execution === execucao && game.completed) return;
            ativo();
            return game.finish();
        }
    });
}
