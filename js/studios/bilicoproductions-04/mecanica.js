export class Mecanica {
    constructor(cenarios, inicio) {
        this.cenarios = cenarios;
        this.cenarioAtual = inicio;
        this.inventario = [];
        this.flags = {};
        this.cena = document.querySelector("#cena");
        this.titulo = document.querySelector("#titulo-cena");
        this.texto = document.querySelector("#texto");
        this.botoes = document.querySelector("#interacoes");
        this.inventarioHTML = document.querySelector("#inventario");
        this.iniciar();
    }

    iniciar() {
        if (!this.cena) {
            console.error('Elemento "#cena" não encontrado no HTML.');
            return;
        }

        this.mostrarCenario(this.cenarioAtual);
    }

    mostrarCenario(id) {
        const cenario = this.cenarios[id];

        if (!cenario) {
            console.error(`Cenário "${id}" não encontrado.`);
            return;
        }

        this.cenarioAtual = id;
        this.cena.style.backgroundImage = `url("${cenario.imagem}")`;
        this.cena.style.backgroundSize = "cover";
        this.cena.style.backgroundPosition = "center";
        this.cena.replaceChildren();

        if (this.titulo) {
            this.titulo.textContent = cenario.nome;
        }

        if (this.texto) {
            this.texto.textContent = cenario.descricao;
        }

        cenario.objetos.forEach(objeto => {
            const botao = document.createElement("button");

            botao.textContent = objeto.icone || "🔎";
            botao.title = objeto.nome;
            botao.className = "objeto-interativo";
            botao.style.position = "absolute";
            botao.style.left = `${objeto.x}%`;
            botao.style.top = `${objeto.y}%`;

            botao.addEventListener("click", () => {
                objeto.acao(this);
            });

            this.cena.appendChild(botao);
        });

        this.atualizarInventario();
    }

    falar(mensagem) {
        if (this.texto) {
            this.texto.textContent = mensagem;
        }
    }

    adicionarItem(id, nome) {
        if (!this.inventario.some(item => item.id === id)) {
            this.inventario.push({ id, nome });
            this.atualizarInventario();
            this.falar(`Item encontrado: ${nome}.`);
        }
    }

    possuiItem(id) {
        return this.inventario.some(item => item.id === id);
    }

    ativarFlag(id) {
        this.flags[id] = true;
    }

    flagAtiva(id) {
        return Boolean(this.flags[id]);
    }

    atualizarInventario() {
        if (!this.inventarioHTML) return;

        this.inventarioHTML.replaceChildren();

        this.inventario.forEach(item => {
            const elemento = document.createElement("span");
            elemento.textContent = item.nome;
            elemento.className = "item-inventario";
            this.inventarioHTML.appendChild(elemento);
        });
    }

    irPara(id) {
        this.mostrarCenario(id);
    }

    mostrarEscolhas(titulo, mensagem, escolhas) {
        const caixa = document.createElement("div");
        caixa.className = "caixa-dialogo";

        const cabecalho = document.createElement("h3");
        cabecalho.textContent = titulo;

        const paragrafo = document.createElement("p");
        paragrafo.textContent = mensagem;

        caixa.append(cabecalho, paragrafo);

        escolhas.forEach(escolha => {
            const botao = document.createElement("button");
            botao.textContent = escolha.nome;

            botao.addEventListener("click", () => {
                caixa.remove();
                escolha.acao(this);
            });

            caixa.appendChild(botao);
        });

        document.body.appendChild(caixa);
    }
}