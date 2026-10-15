import { execFileSync } from "node:child_process";

// Uso: node scripts/validar-alteracoes.mjs SHA_BASE SHA_HEAD NOME_DA_BRANCH
// O CI usa SHAs para que nomes de branches não sejam interpretados pelo Git.
const [base, head, branch] = process.argv.slice(2);
const shaValido = (valor) => typeof valor === "string" && /^[0-9a-f]{7,64}$/i.test(valor);

function falhar(mensagem) {
    console.error(`ERRO: ${mensagem}`);
    process.exitCode = 1;
}

if (!shaValido(base) || !shaValido(head) || !branch) {
    falhar("Informe SHA_BASE, SHA_HEAD e NOME_DA_BRANCH. Exemplo: node scripts/validar-alteracoes.mjs <sha-base> <sha-head> studio-01");
} else if (/^professor(?:\/[^\s]+)?$/.test(branch)) {
    console.log("Branch do professor: alterações compartilhadas seguem para revisão.");
} else {
    const correspondencia = /^(?:studio-(0[1-5])|tarefa\/estudio-(0[1-5])\/[^\s]+)$/.exec(branch);
    if (!correspondencia) {
        falhar(`A branch "${branch}" não segue o padrão. Use studio-01 a studio-05, tarefa/estudio-01/nome-da-tarefa ou professor/nome-da-tarefa para manutenção do professor.`);
    } else {
        const numero = correspondencia[1] ?? correspondencia[2];
        const permitidas = [`js/studios/estudio-${numero}/`, `assets/studios/estudio-${numero}/`];
        try {
            // --no-renames expõe tanto o caminho removido quanto o adicionado.
            // -z preserva nomes com espaços ou quebras de linha.
            const saida = execFileSync("git", ["diff", "--name-only", "--no-renames", "-z", `${base}...${head}`, "--"], { encoding: "utf8" });
            const arquivos = saida.split("\0").filter(Boolean);
            const proibidos = arquivos.filter((arquivo) => !permitidas.some((pasta) => arquivo.startsWith(pasta)));
            if (proibidos.length) {
                falhar(`O Estúdio ${numero} alterou arquivos fora das duas pastas autorizadas:\n${proibidos.map((arquivo) => `- ${JSON.stringify(arquivo)}`).join("\n")}\nPeça ao professor uma mudança nos arquivos compartilhados.`);
            } else {
                console.log(`Estúdio ${numero}: ${arquivos.length} arquivo(s) alterado(s), todos nas pastas autorizadas.`);
            }
        } catch (erro) {
            falhar(`Não foi possível comparar os commits. Confira os SHAs e se o histórico Git está disponível. ${erro.message}`);
        }
    }
}
