// Registro de arquivos. Não define a ordem e não carrega outros níveis antecipadamente.
function registrar(nome, estudio, caminho, pronto, numero) {
    const arquivo = new URL(caminho, import.meta.url);
    return Object.freeze({ nome, estudio, numero, pronto, arquivo, carregar: () => import(arquivo.href) });
}

export const registroNiveis = {
    "professor-inicio": registrar("A primeira porta", "professor", "./inicio.js", true),
    "professor-final": registrar("O último silêncio", "professor", "./final.js", true),
    "nivel-exemplo": registrar("Nível de exemplo", "exemplos", "../../examples/nivel-exemplo.js", true),
    "estudio-01-nivel-01": registrar("Nível 1", "estudio-01", "../studios/pentaverso-05/nivel1.js", false, 1),
    "estudio-01-nivel-02": registrar("Nível 2", "estudio-01", "../studios/pentaverso-05/nivel2.js", false, 2),
    "estudio-01-nivel-03": registrar("Nível 3", "estudio-01", "../studios/pentaverso-05/nivel3.js", false, 3),
    "estudio-02-nivel-01": registrar("Nível 1", "estudio-02", "../studios/kiss-02/nivel1.js", false, 1),
    "estudio-02-nivel-02": registrar("Nível 2", "estudio-02", "../studios/kiss-02/nivel2.js", false, 2),
    "estudio-02-nivel-03": registrar("Nível 3", "estudio-02", "../studios/kiss-02/nivel3.js", false, 3),
    "estudio-03-nivel-01": registrar("Nível 1", "estudio-03", "../studios/maismais-03/nivel1.js", false, 1),
    "estudio-03-nivel-02": registrar("Nível 2", "estudio-03", "../studios/maismais-03/nivel2.js", false, 2),
    "estudio-03-nivel-03": registrar("Nível 3", "estudio-03", "../studios/maismais-03/nivel3.js", false, 3),
    "estudio-04-nivel-01": registrar("Nível 1", "estudio-04", "../studios/bilicoproductions-04/nivel1.js", false, 1),
    "estudio-04-nivel-02": registrar("Nível 2", "estudio-04", "../studios/bilicoproductions-04/nivel2.js", false, 2),
    "estudio-04-nivel-03": registrar("Nível 3", "estudio-04", "../studios/bilicoproductions-04/nivel3.js", false, 3),
    "estudio-05-nivel-01": registrar("Nível 1", "estudio-05", "../studios/estudio01-01/nivel1.js", false, 1),
    "estudio-05-nivel-02": registrar("Nível 2", "estudio-05", "../studios/estudio01-01/nivel2.js", false, 2),
    "estudio-05-nivel-03": registrar("Nível 3", "estudio-05", "../studios/estudio01-01/nivel3.js", false, 3)
};
