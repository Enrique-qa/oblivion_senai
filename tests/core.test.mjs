import test from "node:test";
import assert from "node:assert/strict";
import { validarNivel } from "../js/core/validation.js";
import { validarResposta } from "../js/core/input.js";
import { criarEstado, loadProgress, saveProgress, clearProgress, CHAVE_PROGRESSO } from "../js/core/state.js";
import { proximoNivel, urlJogo } from "../js/core/progression.js";
import { registroNiveis } from "../js/campaign/registry.js";
import { ordemCampanha } from "../js/campaign/order.js";
import { carregarNivel, resolverAsset } from "../js/core/loader.js";
import { criarApi } from "../js/core/api.js";
import { Game } from "../js/core/game.js";
import { ativarMecanica } from "../js/core/mechanics.js";

function exemplo() {
    return {
        id: "teste", nome: "Teste", cenaInicial: "sala", estadoInicial: { pista: false },
        cenas: { sala: { imagem: "./sala.svg", descricao: "Sala", objetos: [
            { id: "bilhete", rotulo: "Bilhete", area: { x: 10, y: 20, largura: 30, altura: 20 }, acao: { tipo: "modal", id: "bilhete" } }
        ] } },
        modais: { bilhete: { titulo: "Pista", texto: "Leia", enigma: { resposta: "0042", aoAcertar() {} } } }
    };
}

test("validação aceita contrato completo e não executa callbacks", () => {
    const nivel = exemplo();
    nivel.modais.bilhete.enigma.aoAcertar = () => { throw new Error("Não deveria executar"); };
    assert.deepEqual(validarNivel(nivel), []);
});

test("validação reúne problemas e aponta referências, IDs, áreas e respostas", () => {
    const nivel = exemplo();
    nivel.cenaInicial = "ausente";
    nivel.cenas.sala.saidas = { direita: "corredor" };
    nivel.cenas.sala.objetos.push({ ...nivel.cenas.sala.objetos[0], area: { x: 95, y: 0, largura: 10, altura: 10 }, acao: { tipo: "modal", id: "ausente" } });
    nivel.modais.bilhete.enigma.resposta = 42;
    const erros = validarNivel(nivel).join("\n");
    for (const trecho of ["inicial", "corredor", "repetido", "porcentagens", "modal", "resposta"]) assert.ok(erros.includes(trecho), erros);
});

test("condições só consultam estados declarados e ação não pode conflitar", () => {
    const nivel = exemplo();
    nivel.cenas.sala.objetos[0].visivelSe = { chave: "typo", valor: true };
    nivel.cenas.sala.objetos[0].aoClicar = () => {};
    const erros = validarNivel(nivel).join("\n");
    assert.match(erros, /estado "typo"/);
    assert.match(erros, /acao OU aoClicar/);
});

test("estruturas ausentes ou malformadas geram mensagens em vez de exceção", () => {
    for (const nivel of [undefined, null, [], { cenas: [], modais: [], estadoInicial: [] }, { cenas: { sala: null }, cenaInicial: "sala" }]) {
        assert.ok(validarNivel(nivel).length > 0);
    }
});

test("nomes de campos escritos incorretamente não são ignorados", () => {
    const nivel = exemplo();
    nivel.cenas.sala.saida = { direita: "sala" };
    assert.match(validarNivel(nivel).join("\n"), /campo "saida" não faz parte do contrato/);
});

test("resposta remove espaços e ignora caixa, preservando zeros e acentos", () => {
    assert.equal(validarResposta("  CHAVE  ", "chave"), true);
    assert.equal(validarResposta("0042", "0042"), true);
    assert.equal(validarResposta("42", "0042"), false);
    assert.equal(validarResposta("mao", "mão"), false);
    assert.throws(() => validarResposta(42, "42"), /texto/);
});

test("estados são isolados, cópias não alteram origem e typos são detectados", () => {
    let notificado;
    const primeiro = criarEstado({ pista: false }, estado => { notificado = estado; });
    const segundo = criarEstado({ pista: false });
    primeiro.definir("pista", true);
    assert.equal(segundo.obter("pista"), false);
    notificado.pista = false;
    assert.equal(primeiro.obter("pista"), true);
    assert.throws(() => primeiro.obter("pisat"), /estadoInicial/);
    assert.throws(() => primeiro.definir("pista", {}), /texto, número/);
});

test("ordem central tem 17 IDs únicos registrados e respeita reordenação", () => {
    assert.equal(ordemCampanha.length, 17);
    assert.equal(new Set(ordemCampanha).size, 17);
    assert.ok(ordemCampanha.every(id => Object.hasOwn(registroNiveis, id)));
    assert.equal(proximoNivel("professor-inicio"), "estudio-01-nivel-01");
    assert.equal(proximoNivel("professor-final"), null);
    assert.equal(proximoNivel("b", ["b", "a"]), "a");
    assert.throws(() => proximoNivel("x"), /não está/);
    assert.throws(() => proximoNivel("a", ["a", "a"]), /repetidos/);
    assert.equal(urlJogo("nível & teste"), "jogo.html?nivel=n%C3%ADvel%20%26%20teste");
});

test("save é somente checkpoint e limpar campanha preserva desenvolvimento", () => {
    const dados = new Map([["oblivion.dev.v1", "teste"]]);
    globalThis.localStorage = { getItem: chave => dados.get(chave) ?? null, setItem: (chave, valor) => dados.set(chave, valor), removeItem: chave => dados.delete(chave) };
    assert.equal(loadProgress(), null);
    assert.equal(saveProgress("estudio-04-nivel-02"), true);
    assert.equal(loadProgress().nivel, "estudio-04-nivel-02");
    assert.equal(loadProgress().versao, 1);
    assert.equal(Object.hasOwn(loadProgress(), "estado"), false);
    clearProgress();
    assert.equal(loadProgress(), null);
    assert.equal(dados.get("oblivion.dev.v1"), "teste");
    dados.set(CHAVE_PROGRESSO, "JSON quebrado");
    assert.equal(loadProgress(), null);
    dados.set(CHAVE_PROGRESSO, JSON.stringify({ versao: 9, nivel: "x" }));
    assert.equal(loadProgress(), null);
    delete globalThis.localStorage;
});

test("falha no salvamento produz erro legível", () => {
    globalThis.localStorage = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("quota"); }, removeItem() { throw new Error("blocked"); } };
    assert.throws(loadProgress, /armazenamento/);
    assert.throws(() => saveProgress("x"), /salvar o progresso/);
    assert.throws(clearProgress, /apagar o progresso/);
    delete globalThis.localStorage;
});

test("carregamento da campanha bloqueia rascunho; dev carrega estúdio isoladamente", async () => {
    await assert.rejects(carregarNivel("estudio-04-nivel-01"), { name: "NivelIndisponivelError" });
    const { nivel } = await carregarNivel("estudio-04-nivel-01", { permitirRascunho: true });
    assert.equal(nivel.id, "estudio-04-nivel-01");
    await assert.rejects(carregarNivel("ausente"), /não está registrado/);
    assert.equal(resolverAsset("./assets/a.svg", "http://localhost/examples/nivel.js"), "http://localhost/examples/assets/a.svg");
    assert.throws(() => resolverAsset("javascript:alert(1)", "http://localhost"), /imagem local/);
});

test("concluir dispara apenas uma vez; API antiga não modifica execução nova", async () => {
    let concluiu = 0;
    const fake = {
        execution: 1, completed: false, level: { id: "teste" },
        modal: { close() {} }, elements: { hotspots: { replaceChildren() {} }, arrows: { replaceChildren() {} } },
        run: fn => fn(), onComplete: () => { concluiu++; }, finish: Game.prototype.finish,
        state: criarEstado({ pista: false })
    };
    const api = criarApi(fake, 1);
    await Promise.all([api.concluirNivel(), api.concluirNivel()]);
    assert.equal(concluiu, 1);
    fake.execution = 2;
    fake.completed = false;
    assert.throws(() => api.definirEstado("pista", true), /encerrado/);
    assert.equal(fake.state.obter("pista"), false);
});

test("mecânica limpa eventos, temporizadores e elementos mesmo ao reiniciar", async () => {
    class Elemento extends EventTarget {
        children = [];
        contains(alvo) { return this.children.includes(alvo); }
        replaceChildren() { this.children = []; }
        removeAttribute() {}
        getBoundingClientRect() { return { left: 0, top: 0, width: 100, height: 100 }; }
    }
    globalThis.Element = Elemento;
    const camada = new Elemento();
    const stage = new Elemento();
    let eventos = 0, temporizadores = 0, limpezas = 0;
    const game = {
        api: {}, elements: { mechanics: camada, stage }, run: fn => fn(), report: erro => { throw erro; },
        level: { mecanica(ctx) {
            ctx.ouvir(camada, "click", () => { eventos++; });
            ctx.aoMoverPonteiro(() => { eventos++; });
            ctx.agendar(() => { temporizadores++; }, 10);
            ctx.repetir(() => { temporizadores++; }, 10);
            return () => { limpezas++; };
        } }
    };
    const limpar = ativarMecanica(game);
    camada.dispatchEvent(new Event("click"));
    assert.equal(eventos, 1);
    limpar(); limpar();
    camada.dispatchEvent(new Event("click"));
    stage.dispatchEvent(new Event("pointermove"));
    await new Promise(resolve => setTimeout(resolve, 25));
    assert.equal(eventos, 1);
    assert.equal(temporizadores, 0);
    assert.equal(limpezas, 1);
    delete globalThis.Element;
});

test("erro assíncrono de execução antiga não interrompe o nível reiniciado", async () => {
    let rejeitar;
    let reportou = 0;
    const fake = { execution: 1, report() { reportou++; } };
    const pendente = Game.prototype.run.call(fake, () => new Promise((_, reject) => { rejeitar = reject; }));
    fake.execution = 2;
    rejeitar(new Error("Resposta atrasada"));
    await pendente;
    assert.equal(reportou, 0);
    await Game.prototype.run.call(fake, () => { throw new Error("Erro atual"); });
    assert.equal(reportou, 1);
});

test("imagem carregada depois da conclusão não muda a cena", async () => {
    let imagem;
    globalThis.Image = class {
        naturalWidth = 1600;
        naturalHeight = 900;
        constructor() { imagem = this; }
        set src(_) {}
    };
    const fake = {
        completed: false, execution: 1, navigation: 0, currentScene: "sala", moduleUrl: "http://localhost/nivel.js",
        level: { cenas: { corredor: { imagem: "corredor.svg", descricao: "Corredor" } } },
        elements: { stage: { setAttribute() {}, removeAttribute() {} }, image: {}, message: {}, description: {} },
        modal: { close() { throw new Error("Não deve renderizar depois da conclusão"); } }
    };
    const pendente = Game.prototype.navigate.call(fake, "corredor");
    fake.completed = true;
    imagem.onload();
    await pendente;
    assert.equal(fake.currentScene, "sala");
    delete globalThis.Image;
});
