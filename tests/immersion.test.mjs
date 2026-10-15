import test from "node:test";
import assert from "node:assert/strict";
import { validarNivel } from "../js/core/validation.js";
import { Game } from "../js/core/game.js";
import { alternarTelaCheia, prepararImersao } from "../js/immersive.js";
import inicio from "../js/campaign/inicio.js";
import { criarEstado } from "../js/core/state.js";

function nivelMinimo() {
    return {
        id: "teste", nome: "Teste", cenaInicial: "sala",
        cenas: { sala: { imagem: "a.png", descricao: "Sala", saidas: {
            direita: { cena: "sala", aparencia: "integrada", area: { x: 70, y: 60, largura: 20, altura: 15 } }
        } } },
        modais: { nota: { titulo: "Bilhete", texto: "Pista legível", imagem: "nota.png", apresentacao: "nota" } }
    };
}

test("setas desenhadas na imagem e notas preservam contrato declarativo", () => {
    assert.deepEqual(validarNivel(nivelMinimo()), []);
    const nivel = nivelMinimo();
    nivel.cenas.sala.saidas.direita.area.x = 95;
    assert.match(validarNivel(nivel).join("\n"), /saída direita: area usa porcentagens/);
    delete nivel.cenas.sala.saidas.direita.area;
    assert.match(validarNivel(nivel).join("\n"), /informe area/);
});

test("nota precisa de imagem, e formulário deve usar apresentação padrão", () => {
    const nivel = nivelMinimo();
    delete nivel.modais.nota.imagem;
    assert.match(validarNivel(nivel).join("\n"), /nota precisa de imagem/);
    nivel.modais.nota.imagem = "nota.png";
    nivel.modais.nota.enigma = { resposta: "1", aoAcertar() {} };
    assert.match(validarNivel(nivel).join("\n"), /não deve conter enigma/);
});

test("cenários preservam proporção natural fora de 16:9", async () => {
    let carregando;
    globalThis.Image = class {
        naturalWidth = 1071;
        naturalHeight = 686;
        constructor() { carregando = this; }
        set src(_) {}
    };
    try {
        const estilos = new Map();
        const fake = {
            completed: false, execution: 1, navigation: 0, moduleUrl: "http://localhost/nivel.js",
            level: { cenas: { escada: { imagem: "escada.png", descricao: "Escadaria" } } },
            modal: { close() {} }, renderInteractions() {}, notifyState() {},
            elements: { stage: { style: { setProperty: (chave, valor) => estilos.set(chave, valor) }, setAttribute() {}, removeAttribute() {} }, image: {}, message: {}, description: {} }
        };
        const promisse = Game.prototype.navigate.call(fake, "escada");
        carregando.onload();
        await promisse;
        assert.equal(fake.currentScene, "escada");
        assert.equal(estilos.get("--scene-aspect"), 1071 / 686);
        assert.equal(fake.elements.description.textContent, "Escadaria");
    } finally { delete globalThis.Image; }
});

test("tela cheia usa chamada explícita e pode sair sem solicitar entrada novamente", async () => {
    let entradas = 0, saidas = 0;
    const doc = { fullscreenEnabled: true, fullscreenElement: null,
        documentElement: { async requestFullscreen(options) { assert.equal(options.navigationUI, "hide"); entradas++; } },
        async exitFullscreen() { saidas++; }
    };
    assert.equal(entradas, 0);
    assert.equal(await alternarTelaCheia(doc), true);
    doc.fullscreenElement = doc.documentElement;
    assert.equal(await alternarTelaCheia(doc), false);
    assert.equal(entradas, 1);
    assert.equal(saidas, 1);
});

test("navegador sem API de tela cheia oferece F11 e rejeição pode ser tratada pela interface", async () => {
    await assert.rejects(alternarTelaCheia({ fullscreenEnabled: false, documentElement: {} }), /F11/);
    await assert.rejects(alternarTelaCheia({ documentElement: { async requestFullscreen() { throw new Error("Bloqueado pelo navegador"); } } }), /Bloqueado/);
});

test("tutorial tem uma única resposta e permite consultar a pista sem bloquear a navegação", () => {
    const enigmas = Object.values(inicio.modais).filter(modal => modal.enigma);
    assert.equal(enigmas.length, 1);
    assert.equal(enigmas[0].enigma.resposta, "314");
    const avancar = Object.values(inicio.cenas.vestibulo.saidas).find(saida => saida.cena === "porta");
    const voltar = Object.values(inicio.cenas.porta.saidas).find(saida => saida.cena === "vestibulo");
    assert.ok(avancar);
    assert.ok(voltar);
    assert.equal(avancar.condicao, undefined);
    const estado = criarEstado(inicio.estadoInicial);
    let concluiu = 0;
    const api = { definirEstado: estado.definir, concluirNivel() { concluiu++; } };
    enigmas[0].enigma.aoAcertar(api);
    assert.equal(concluiu, 1);
    assert.equal(estado.obter("leuBilhete"), false);
    inicio.modais.bilhete.aoAbrir(api);
    assert.equal(estado.obter("leuBilhete"), true);
    assert.equal(criarEstado(inicio.estadoInicial).obter("leuBilhete"), false);
});

test("saída de tela cheia pelo controle não reabre pausa com evento atrasado", async () => {
    class Controle extends EventTarget {
        open = false;
        focus() {}
        showModal() { this.open = true; }
        close() { this.open = false; }
    }
    const pausa = new Controle();
    pausa.open = true;
    const fullscreen = new Controle();
    const seletores = { "#pause-menu": pausa, "#fullscreen-toggle": fullscreen, "#fullscreen-status": {}, "#resume-game": new Controle() };
    const doc = new EventTarget();
    doc.documentElement = { requestFullscreen() {} };
    doc.fullscreenElement = doc.documentElement;
    doc.fullscreenEnabled = true;
    doc.querySelector = seletor => seletores[seletor];
    doc.exitFullscreen = async () => {
        doc.fullscreenElement = null;
        setTimeout(() => doc.dispatchEvent(new Event("fullscreenchange")), 0);
    };
    globalThis.document = doc;
    try {
        prepararImersao({ stage: new Controle(), modal: new Controle(), podeAbrir: () => true });
        fullscreen.dispatchEvent(new Event("click"));
        await new Promise(resolve => setTimeout(resolve, 20));
        assert.equal(pausa.open, false);
        assert.equal(fullscreen.textContent, "Entrar em tela cheia");
    } finally { delete globalThis.document; }
});
