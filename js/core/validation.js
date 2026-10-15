import { valorSimples } from "./state.js";

const objeto = valor => valor !== null && typeof valor === "object" && !Array.isArray(valor);
const texto = valor => typeof valor === "string" && valor.trim().length > 0;
const direcoes = ["esquerda", "direita", "cima", "baixo"];
const possui = (obj, chave) => Object.hasOwn(obj, chave);

// Não executa funções dos alunos. Retorna todos os problemas de configuração.
export function validarNivel(nivel) {
    const erros = [];
    const erro = mensagem => erros.push(mensagem);
    const campos = (config, permitidos, local) => {
        for (const chave of Object.keys(config)) if (!permitidos.includes(chave)) erro(`${local}: o campo "${chave}" não faz parte do contrato. Confira o nome na documentação.`);
    };
    const validarArea = (area, local) => {
        if (objeto(area)) campos(area, ["x", "y", "largura", "altura"], local);
        if (!objeto(area) || ![area.x, area.y, area.largura, area.altura].every(Number.isFinite) || area.x < 0 || area.y < 0 || area.largura <= 0 || area.altura <= 0 || area.x + area.largura > 100 || area.y + area.altura > 100) erro(`${local}: area usa porcentagens de 0 a 100 e precisa caber no cenário.`);
    };
    if (!objeto(nivel)) return ["O arquivo deve exportar um objeto de nível com export default."];
    campos(nivel, ["id", "nome", "cenaInicial", "estadoInicial", "cenas", "modais", "mecanica"], "Nível");
    if (!texto(nivel.id)) erro("O nível precisa de um id escrito entre aspas.");
    if (!texto(nivel.nome)) erro("O nível precisa de um nome.");
    const cenas = objeto(nivel.cenas) ? nivel.cenas : {};
    const modais = objeto(nivel.modais) ? nivel.modais : {};
    const estados = objeto(nivel.estadoInicial) ? nivel.estadoInicial : {};
    if (!Object.keys(cenas).length) erro("Declare pelo menos uma cena em cenas.");
    if (!texto(nivel.cenaInicial) || !possui(cenas, nivel.cenaInicial)) erro(`A cena inicial "${nivel.cenaInicial ?? "não informada"}" não existe em cenas.`);
    if (nivel.modais !== undefined && !objeto(nivel.modais)) erro("modais deve ser um objeto com os IDs dos modais.");
    if (nivel.estadoInicial !== undefined && !objeto(nivel.estadoInicial)) erro("estadoInicial deve ser um objeto.");
    for (const [chave, valor] of Object.entries(estados)) if (!valorSimples(valor)) erro(`O estado "${chave}" deve guardar texto, número, verdadeiro, falso ou null.`);
    if (nivel.mecanica !== undefined && typeof nivel.mecanica !== "function") erro("mecanica deve receber a função importada de mecanica.js.");

    function condicao(valor, local) {
        if (valor === undefined) return;
        if (!objeto(valor) || !texto(valor.chave) || !possui(valor, "valor") || !valorSimples(valor.valor)) {
            erro(`${local}: a condição precisa de chave e valor simples.`); return;
        }
        campos(valor, ["chave", "valor"], local);
        if (!possui(estados, valor.chave)) erro(`${local}: o estado "${valor.chave}" não foi declarado em estadoInicial.`);
    }
    function acao(valor, local) {
        if (!objeto(valor)) { erro(`${local}: declare uma acao ou uma função aoClicar(api).`); return; }
        switch (valor.tipo) {
            case "mensagem": if (!texto(valor.texto)) erro(`${local}: a ação mensagem precisa de texto.`); break;
            case "modal": if (!texto(valor.id) || !possui(modais, valor.id)) erro(`${local}: o modal "${valor.id ?? "não informado"}" não existe.`); break;
            case "cena": if (!texto(valor.id) || !possui(cenas, valor.id)) erro(`${local}: a cena "${valor.id ?? "não informada"}" não existe.`); break;
            case "concluir": break;
            default: erro(`${local}: tipo de ação desconhecido. Use mensagem, modal, cena ou concluir.`);
        }
        campos(valor, valor.tipo === "mensagem" ? ["tipo", "texto"] : ["modal", "cena"].includes(valor.tipo) ? ["tipo", "id"] : ["tipo"], local);
    }

    for (const [id, cena] of Object.entries(cenas)) {
        const local = `Cena "${id}"`;
        if (!objeto(cena)) { erro(`${local}: a configuração precisa ser um objeto.`); continue; }
        campos(cena, ["imagem", "descricao", "objetos", "saidas"], local);
        if (!texto(cena.imagem)) erro(`${local}: informe o caminho da imagem.`);
        if (!texto(cena.descricao)) erro(`${local}: escreva uma descricao da imagem.`);
        if (cena.objetos !== undefined && !Array.isArray(cena.objetos)) erro(`${local}: objetos deve ser uma lista entre colchetes.`);
        const ids = new Set();
        for (const item of Array.isArray(cena.objetos) ? cena.objetos : []) {
            if (!objeto(item)) { erro(`${local}: cada objeto interativo precisa ser uma configuração.`); continue; }
            const onde = `${local}, objeto "${item.id ?? "sem ID"}"`;
            campos(item, ["id", "rotulo", "area", "acao", "aoClicar", "visivelSe", "habilitadoSe"], onde);
            if (!texto(item.id)) erro(`${local}: um objeto está sem id.`);
            else if (ids.has(item.id)) erro(`${local}: o ID de objeto "${item.id}" está repetido.`);
            ids.add(item.id);
            if (!texto(item.rotulo)) erro(`${onde}: informe um rotulo para identificar a interação.`);
            validarArea(item.area, onde);
            if (item.acao !== undefined && item.aoClicar !== undefined) erro(`${onde}: escolha acao OU aoClicar, sem usar os dois.`);
            else if (item.aoClicar !== undefined) { if (typeof item.aoClicar !== "function") erro(`${onde}: aoClicar deve ser uma função.`); }
            else acao(item.acao, onde);
            condicao(item.visivelSe, onde); condicao(item.habilitadoSe, onde);
        }
        if (cena.saidas !== undefined && !objeto(cena.saidas)) erro(`${local}: saidas deve ser um objeto com as direções.`);
        for (const [direcao, saida] of Object.entries(objeto(cena.saidas) ? cena.saidas : {})) {
            if (!direcoes.includes(direcao)) erro(`${local}: direção "${direcao}" desconhecida. Use esquerda, direita, cima ou baixo.`);
            const destino = typeof saida === "string" ? saida : saida?.cena;
            if (!texto(destino) || !possui(cenas, destino)) erro(`${local} possui uma saída para "${destino ?? "não informada"}", mas essa cena não existe.`);
            if (objeto(saida)) {
                campos(saida, ["cena", "rotulo", "condicao", "mensagemBloqueio", "area", "aparencia"], `${local}, saída ${direcao}`);
                if (saida.area !== undefined) validarArea(saida.area, `${local}, saída ${direcao}`);
                if (saida.aparencia !== undefined && !["padrao", "integrada"].includes(saida.aparencia)) erro(`${local}, saída ${direcao}: aparencia deve ser padrao ou integrada.`);
                if (saida.aparencia === "integrada" && saida.area === undefined) erro(`${local}, saída ${direcao}: informe area para alinhar a interação à seta desenhada na imagem.`);
                condicao(saida.condicao, `${local}, saída ${direcao}`);
                if (saida.rotulo !== undefined && !texto(saida.rotulo)) erro(`${local}: rotulo da saída ${direcao} precisa ser texto.`);
                if (saida.mensagemBloqueio !== undefined && !texto(saida.mensagemBloqueio)) erro(`${local}: mensagemBloqueio da saída ${direcao} precisa ser texto.`);
            } else if (typeof saida !== "string") erro(`${local}: a saída ${direcao} deve ser um ID de cena ou objeto com cena.`);
        }
    }
    for (const [id, modal] of Object.entries(modais)) {
        const local = `Modal "${id}"`;
        if (!objeto(modal)) { erro(`${local}: a configuração precisa ser um objeto.`); continue; }
        campos(modal, ["titulo", "texto", "imagem", "aoAbrir", "enigma", "apresentacao"], local);
        if (modal.apresentacao !== undefined && !["padrao", "nota"].includes(modal.apresentacao)) erro(`${local}: apresentacao deve ser padrao ou nota.`);
        if (modal.apresentacao === "nota" && (!texto(modal.imagem) || modal.enigma !== undefined)) erro(`${local}: uma nota precisa de imagem e não deve conter enigma. Use apresentacao padrao para campos de resposta.`);
        if (!texto(modal.titulo)) erro(`${local}: informe um titulo.`);
        if (!texto(modal.texto)) erro(`${local}: informe o texto.`);
        if (modal.imagem !== undefined && !texto(modal.imagem)) erro(`${local}: imagem deve ser um caminho em texto.`);
        if (modal.aoAbrir !== undefined && typeof modal.aoAbrir !== "function") erro(`${local}: aoAbrir deve ser uma função.`);
        if (modal.enigma !== undefined) {
            if (!objeto(modal.enigma)) { erro(`${local}: enigma deve ser um objeto.`); continue; }
            campos(modal.enigma, ["resposta", "mensagemErro", "mensagemSucesso", "rotulo", "placeholder", "aoAcertar"], local);
            if (!texto(modal.enigma.resposta)) erro(`${local}: o enigma precisa de resposta em texto, entre aspas.`);
            if (typeof modal.enigma.aoAcertar !== "function") erro(`${local}: o enigma precisa de uma função aoAcertar(api).`);
            for (const campo of ["mensagemErro", "mensagemSucesso", "rotulo", "placeholder"]) if (modal.enigma[campo] !== undefined && !texto(modal.enigma[campo])) erro(`${local}: ${campo} precisa ser texto.`);
        }
    }
    return erros;
}
