// Mecânica exclusiva do Estúdio 4: PINCEL DE PERÍCIA.
// O jogador ativa o pincel e arrasta o mouse sobre o cenário, como quem passa pó de
// revelação. Ao pincelar a área de uma marca escondida, o texto aparece aos poucos.
// O mesmo arquivo serve aos três níveis: basta acrescentar marcas em MARCAS.

// MARCAS ESCONDIDAS: posições em porcentagem da imagem (igual às hitboxes).
// "cena" deve ser o id da cena onde a marca aparece.
const MARCAS = [
    { id: "placa",    cena: "portao",  texto: "A J", x: 20, y: 40, largura: 14, altura: 12 },
    { id: "bilhete",  cena: "jardim",  texto: "U D", x: 25, y: 48, largura: 13, altura: 10 },
    { id: "telefone", cena: "varanda", texto: "A",   x: 15, y: 35, largura: 12, altura: 16 }
];

const PINCELADAS_PARA_REVELAR = 12; // quantos movimentos sobre a marca até ela ficar nítida
const RAIO_DO_PINCEL = 28;          // em pixels

// TODO (1 linha): ligar ao id da cena atual. Rode console.log(contexto) dentro de
// ativarMecanica para ver o que o motor entrega e ajuste a linha abaixo.
function obterCena(contexto) {
    return contexto.cenaAtual ?? null;
}

export default function ativarMecanica(contexto) {
    const { camada, ouvir } = contexto;
    let ativa = false;
    let pintando = false;
    let cenaAtual = null;
    let avisou = false;
    const progresso = new Map(); // "cena:id" -> pinceladas
    const elementos = new Map(); // "cena:id" -> elemento da marca

    // Camada de pó (canvas). Só captura o mouse enquanto o pincel está ativo.
    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        touchAction: "none",
        cursor: "crosshair"
    });
    const ctx = canvas.getContext("2d");

    // Camada das marcas reveladas (fica acima do pó para o texto aparecer).
    const camadaMarcas = document.createElement("div");
    Object.assign(camadaMarcas.style, { position: "absolute", inset: "0", pointerEvents: "none" });

    for (const marca of MARCAS) {
        const el = document.createElement("div");
        el.textContent = marca.texto;
        Object.assign(el.style, {
            position: "absolute",
            left: `${marca.x}%`,
            top: `${marca.y}%`,
            width: `${marca.largura}%`,
            height: `${marca.altura}%`,
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            opacity: "0",
            color: "#efe6c8",
            font: "bold 28px 'Courier New', monospace",
            letterSpacing: "4px",
            textShadow: "0 0 6px rgba(0, 0, 0, .8)"
        });
        elementos.set(`${marca.cena}:${marca.id}`, el);
        camadaMarcas.append(el);
    }

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "Pincel de perícia";
    botao.setAttribute("aria-pressed", "false");
    Object.assign(botao.style, {
        position: "absolute",
        top: "18px",
        left: "18px",
        pointerEvents: "auto",
        padding: "10px 16px",
        border: "1px solid #b8a36d",
        borderRadius: "6px",
        background: "#14231d",
        color: "#eee3c7",
        font: "inherit",
        cursor: "pointer"
    });

    camada.append(canvas, camadaMarcas, botao);

    function ajustarCanvas() {
        const r = camada.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(r.width));
        canvas.height = Math.max(1, Math.round(r.height));
    }

    // Mostra só as marcas da cena atual e limpa o pó quando a cena muda.
    function atualizarMarcas() {
        const cena = obterCena(contexto);
        if (cena == null && !avisou) {
            avisou = true;
            console.warn("Pincel de perícia: não sei qual é a cena atual. Ajuste obterCena().");
        }
        if (cena !== cenaAtual) {
            cenaAtual = cena;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        for (const marca of MARCAS) {
            const chave = `${marca.cena}:${marca.id}`;
            const el = elementos.get(chave);
            const naCena = marca.cena === cenaAtual;
            el.style.display = naCena ? "flex" : "none";
            el.style.opacity = String(Math.min(1, (progresso.get(chave) || 0) / PINCELADAS_PARA_REVELAR));
        }
    }

    function pincelar(evento) {
        const r = canvas.getBoundingClientRect();
        const px = evento.clientX - r.left;
        const py = evento.clientY - r.top;

        // pó claro, com borda suave
        const g = ctx.createRadialGradient(px, py, 0, px, py, RAIO_DO_PINCEL);
        g.addColorStop(0, "rgba(214, 222, 230, .45)");
        g.addColorStop(1, "rgba(214, 222, 230, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, RAIO_DO_PINCEL, 0, Math.PI * 2);
        ctx.fill();

        // conta pinceladas dentro das marcas da cena atual
        const x = (px / r.width) * 100;
        const y = (py / r.height) * 100;
        for (const marca of MARCAS) {
            if (marca.cena !== cenaAtual) continue;
            const dentro = x >= marca.x && x <= marca.x + marca.largura &&
                           y >= marca.y && y <= marca.y + marca.altura;
            if (dentro) {
                const chave = `${marca.cena}:${marca.id}`;
                progresso.set(chave, (progresso.get(chave) || 0) + 1);
            }
        }
        atualizarMarcas();
    }

    ajustarCanvas();
    atualizarMarcas();

    const observador = new ResizeObserver(ajustarCanvas);
    observador.observe(camada);
    const intervalo = setInterval(atualizarMarcas, 250); // acompanha a troca de cena

    const pararBotao = ouvir(botao, "click", () => {
        ativa = !ativa;
        botao.textContent = ativa ? "Guardar pincel" : "Pincel de perícia";
        botao.setAttribute("aria-pressed", String(ativa));
        canvas.style.pointerEvents = ativa ? "auto" : "none";
        if (!ativa) ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    const pararDescer = ouvir(canvas, "pointerdown", (e) => {
        pintando = true;
        canvas.setPointerCapture?.(e.pointerId);
        pincelar(e);
    });
    const pararMover = ouvir(canvas, "pointermove", (e) => { if (pintando) pincelar(e); });
    const pararSubir = ouvir(canvas, "pointerup", () => { pintando = false; });
    const pararCancelar = ouvir(canvas, "pointercancel", () => { pintando = false; });

    return function desativarMecanica() {
        pararBotao();
        pararDescer();
        pararMover();
        pararSubir();
        pararCancelar();
        observador.disconnect();
        clearInterval(intervalo);
        canvas.remove();
        camadaMarcas.remove();
        botao.remove();
    };
}
