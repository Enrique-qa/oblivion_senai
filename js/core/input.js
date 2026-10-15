// Códigos são texto: "0042" deve continuar com os zeros à esquerda.
export function validarResposta(valor, resposta) {
    if (typeof valor !== "string" || typeof resposta !== "string") {
        throw new Error("Informe a resposta e o valor digitado como texto, entre aspas.");
    }
    return valor.trim().toLocaleLowerCase("pt-BR") === resposta.trim().toLocaleLowerCase("pt-BR");
}
