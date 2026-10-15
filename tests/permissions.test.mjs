import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, renameSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join, dirname, relative, isAbsolute, basename } from "node:path";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("../scripts/validar-alteracoes.mjs", import.meta.url));
const raizTemporaria = resolve(tmpdir());

function criarRepositorio(t) {
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
    escrever("js/studios/estudio-01/nivel1.js", "// Nível inicial\n");
    const base = commit();
    git("switch", "-c", "studio-01");
    const verificar = (head, branch = "studio-01") => spawnSync(process.execPath, [script, base, head, branch], { cwd: pasta, encoding: "utf8" });
    return { pasta, escrever, commit, verificar };
}

test("estúdio pode alterar somente seu próprio nível", (t) => {
    const repo = criarRepositorio(t);
    repo.escrever("js/studios/estudio-01/nivel1.js", "// Nível alterado\n");
    const resultado = repo.verificar(repo.commit());
    assert.equal(resultado.status, 0, resultado.stderr);
    assert.match(resultado.stdout, /todos nas pastas autorizadas/);
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
    renameSync(join(repo.pasta, "js/core/game.js"), join(repo.pasta, "js/studios/estudio-01/mecanica.js"));
    const resultado = repo.verificar(repo.commit());
    assert.equal(resultado.status, 1);
    assert.match(resultado.stderr, /js\/core\/game\.js/);
});
