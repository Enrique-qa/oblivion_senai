import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, renameSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join, dirname, relative, isAbsolute, basename } from "node:path";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("../scripts/validar-alteracoes.mjs", import.meta.url));
const raizTemporaria = resolve(tmpdir());
const estudios = [
    ["01", "pentaverso-05"],
    ["02", "kiss-02"],
    ["03", "maismais-03"],
    ["04", "bilicoproductions-04"],
    ["05", "estudio01-01"]
];

function criarRepositorio(t, numero = "01") {
    const pasta = mkdtempSync(join(raizTemporaria, "oblivion-permissoes-"));
    t.after(() => {
        const caminho = resolve(pasta);
        const distancia = relative(raizTemporaria, caminho);
        if (!distancia || distancia.startsWith("..") || isAbsolute(distancia) || !basename(caminho).startsWith("oblivion-permissoes-")) {
            throw new Error("A pasta temporária está fora do local previsto; a limpeza foi interrompida.");
        }
        rmSync(caminho, { recursive: true, force: true });
    });
    const git = (...args) => execFileSync("git", ["-c", "user.name=Teste OBLIVION", "-c", "user.email=teste@example.invalid", ...args], { cwd: pasta, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
    const escrever = (arquivo, conteudo) => {
        const caminho = join(pasta, arquivo);
        mkdirSync(dirname(caminho), { recursive: true });
        writeFileSync(caminho, conteudo);
    };
    const commit = () => { git("add", "."); git("commit", "-m", "Teste de permissões"); return git("rev-parse", "HEAD"); };
    git("init", "-b", "main");
    escrever("js/core/game.js", "// Motor\n");
    for (const [logico, pasta] of estudios) {
        escrever(`js/studios/${pasta}/nivel1.js`, `// Nível do Estúdio ${logico}\n`);
        escrever(`assets/studios/estudio-${logico}/pista.txt`, `Pista do Estúdio ${logico}\n`);
    }
    const base = commit();
    git("switch", "-c", `studio-${numero}`);
    const verificar = (head, branch = `studio-${numero}`) => spawnSync(process.execPath, [script, base, head, branch], { cwd: pasta, encoding: "utf8" });
    return { pasta, escrever, commit, verificar };
}

for (const [numero, pasta] of estudios) {
    test(`studio-${numero} pode alterar JS em ${pasta} e assets de seu número lógico`, (t) => {
        const repo = criarRepositorio(t, numero);
        repo.escrever(`js/studios/${pasta}/nivel1.js`, "// Nível alterado\n");
        repo.escrever(`assets/studios/estudio-${numero}/pista.txt`, "Pista atualizada\n");
        const resultado = repo.verificar(repo.commit());
        assert.equal(resultado.status, 0, resultado.stderr);
        assert.match(resultado.stdout, /2 arquivo\(s\) alterado\(s\), todos nas pastas autorizadas/);
    });
}

test("branch de tarefa mantém o número lógico e usa a pasta renomeada", (t) => {
    const repo = criarRepositorio(t, "02");
    repo.escrever("js/studios/kiss-02/nivel1.js", "// Pista revisada\n");
    const resultado = repo.verificar(repo.commit(), "tarefa/estudio-02/revisar-pista");
    assert.equal(resultado.status, 0, resultado.stderr);
    assert.match(resultado.stdout, /Estúdio 02/);
});

test("studio-01 não recebe permissão pelo 01 do nome alheio ou pelo 05 de sua pasta JS", (t) => {
    const repo = criarRepositorio(t);
    const proibidos = [
        "js/studios/estudio01-01/nivel1.js",
        "assets/studios/estudio-05/pista.txt"
    ];
    for (const arquivo of proibidos) repo.escrever(arquivo, "// Alteração de outro estúdio\n");
    const resultado = repo.verificar(repo.commit());
    assert.equal(resultado.status, 1);
    for (const arquivo of proibidos) assert.ok(resultado.stderr.includes(arquivo), resultado.stderr);
});

test("studio-05 não recebe a pasta pentaverso-05 nem os assets do Estúdio 01", (t) => {
    const repo = criarRepositorio(t, "05");
    const proibidos = [
        "js/studios/pentaverso-05/nivel1.js",
        "assets/studios/estudio-01/pista.txt"
    ];
    for (const arquivo of proibidos) repo.escrever(arquivo, "// Alteração de outro estúdio\n");
    const resultado = repo.verificar(repo.commit());
    assert.equal(resultado.status, 1);
    for (const arquivo of proibidos) assert.ok(resultado.stderr.includes(arquivo), resultado.stderr);
});

test("pastas antigas ou com prefixo parecido não ampliam o escopo do estúdio", (t) => {
    const repo = criarRepositorio(t);
    const proibidos = [
        "js/studios/estudio-01/nivel2.js",
        "js/studios/pentaverso-05-extra/nivel1.js"
    ];
    for (const arquivo of proibidos) repo.escrever(arquivo, "// Caminho não autorizado\n");
    const resultado = repo.verificar(repo.commit());
    assert.equal(resultado.status, 1);
    for (const arquivo of proibidos) assert.ok(resultado.stderr.includes(arquivo), resultado.stderr);
});

test("alteração do motor é rejeitada para branch de estúdio", (t) => {
    const repo = criarRepositorio(t);
    repo.escrever("js/core/game.js", "// Motor alterado\n");
    const resultado = repo.verificar(repo.commit());
    assert.equal(resultado.status, 1);
    assert.match(resultado.stderr, /js\/core\/game\.js/);
});

test("renomear arquivo do motor para pasta própria continua sendo rejeitado", (t) => {
    const repo = criarRepositorio(t);
    renameSync(join(repo.pasta, "js/core/game.js"), join(repo.pasta, "js/studios/pentaverso-05/mecanica.js"));
    const resultado = repo.verificar(repo.commit());
    assert.equal(resultado.status, 1);
    assert.match(resultado.stderr, /js\/core\/game\.js/);
});
