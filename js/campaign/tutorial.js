// A orientação usa a mensagem do motor e desaparece durante a exploração.
export default function ativarTutorial(contexto) {
    contexto.api.mostrarMensagem("Clique no bilhete sobre a mesa. Depois, use a seta para chegar à porta.");

    return function desativarTutorial() {};
}
