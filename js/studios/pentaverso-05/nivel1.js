// src/studios/estudio-01/nivel1.js
// NÍVEL 1 - O JARDIM
// Jogador começa em frente à porta principal da casa abandonada.
// É noite o jogo inteiro; o quintal tem lâmpadas acesas.
//
// Cadeia de enigmas:
//   1) ÁRVORE  -> pista que aponta para a caixa de remédio
//   2) CAIXA DE REMÉDIO -> pista que aponta para o baú
//   3) BAÚ -> só abre depois dos dois primeiros; dentro tem a SENHA da porta
//   (cápsulas no chão = ambientação + pista extra)
// Depois de achar a senha, o jogador volta à porta, digita a senha
// e o nível termina: o motor leva o jogador ao NÍVEL 2.
//
// ATENÇÃO: os trechos marcados com "AJUSTAR" dependem do template/API
// real do repositório. Confira com o projeto base antes de enviar.

// AJUSTAR: caminho/nome do import conforme o template do projeto
import { defineNivel } from "../../core/defineNivel.js";

// Mude a senha aqui, em um só lugar.
const SENHA_DA_PORTA = "1947";

const A = "/assets/studios/estudio-01/nivel1"; // pasta dos assets do nível

export default defineNivel({
  id: "estudio-01-nivel-01",
  titulo: "O Jardim",
  cenaInicial: "jardim",

  cenas: {
    // ------------------------------------------------------------
    // CENA 1: JARDIM (única tela até achar a senha)
    // ------------------------------------------------------------
    jardim: {
      imagem: `${A}/jardim.webp`,
      saidas: {}, // sem setas: a única saída é a porta (hitbox abaixo)

      // Coordenadas em % da tela. Use o modo dev (mostrar hitboxes)
      // para ajustar x, y, largura e altura de acordo com a sua arte.
      hitboxes: [
        // ----- ENIGMA 1: ÁRVORE -----
        {
          id: "arvore",
          x: 5, y: 15, largura: 22, altura: 60,
          aoClicar(api) {
            api.abrirModal({
              imagem: `${A}/arvore-marca.webp`,
              texto:
                "Algo foi entalhado no tronco, fundo, como se alguém " +
                "tivesse feito isso com pressa:\n\n" +
                "\"Eu só queria dormir. A resposta está na caixa.\"",
            });
            api.definirFlag("arvore-lida", true);
          },
        },

        // ----- CÁPSULAS NO CHÃO (ambientação + pista extra) -----
        {
          id: "capsulas",
          x: 30, y: 78, largura: 30, altura: 14,
          aoClicar(api) {
            api.abrirModal({
              imagem: `${A}/capsulas.webp`,
              texto:
                "Dezenas de cápsulas espalhadas pela grama. " +
                "Algumas ainda brilham sob a luz do poste. " +
                "Parece que a trilha leva até uma caixa.",
            });
            api.definirFlag("capsulas-vistas", true);
          },
        },

        // ----- ENIGMA 2: CAIXA DE REMÉDIO -----
        {
          id: "caixa-remedio",
          x: 52, y: 66, largura: 10, altura: 10,
          aoClicar(api) {
            api.abrirModal({
              imagem: `${A}/caixa-remedio.webp`,
              texto:
                "Uma caixa de remédio vazia, com a bula rasgada.\n" +
                "No verso, escrito à caneta:\n\n" +
                "\"Tomei demais. O que eu escondi está no baú.\"",
            });
            api.definirFlag("caixa-lida", true);
          },
        },

        // ----- ENIGMA 3: BAÚ (guarda a senha) -----
        {
          id: "bau",
          x: 70, y: 62, largura: 14, altura: 14,
          aoClicar(api) {
            const podeAbrir =
              api.lerFlag("arvore-lida") && api.lerFlag("caixa-lida");

            if (!podeAbrir) {
              api.mostrarMensagem(
                "O baú está trancado. Talvez haja algo pelo jardim " +
                  "que explique como abri-lo."
              );
              return;
            }

            api.abrirModal({
              imagem: `${A}/bau-aberto.webp`,
              texto:
                "O baú se abre. Dentro, um papel amassado:\n\n" +
                `"Senha da porta: ${SENHA_DA_PORTA}"`,
            });
            api.definirFlag("senha-encontrada", true);
          },
        },

        // ----- PORTA PRINCIPAL -----
        {
          id: "porta",
          x: 38, y: 20, largura: 20, altura: 45,
          aoClicar(api) {
            // Ainda não achou a senha: porta trancada.
            if (!api.lerFlag("senha-encontrada")) {
              api.mostrarMensagem(
                "A porta está trancada. Há um teclado numérico ao lado."
              );
              return;
            }

            // AJUSTAR: usar o sistema de input/resposta do motor.
            // O guia cita "sistema de input e resposta", mas não mostra
            // o formato. Esta chamada é um modelo; adapte ao template.
            api.abrirModal({
              tipo: "senha",
              pergunta: "Digite a senha da porta:",
              respostasAceitas: [SENHA_DA_PORTA],
              aoAcertar() {
                api.definirFlag("porta-aberta", true);
                api.fecharModal();
                api.mostrarMensagem("Um clique. A porta se abre devagar.");
                api.concluirNivel(); // segue para o nível 2
              },
              aoErrar() {
                api.mostrarMensagem("Senha incorreta.");
              },
            });
          },
        },
      ],
    },

  },
});
