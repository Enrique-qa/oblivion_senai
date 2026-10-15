import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL("../", import.meta.url));
const porta = Number(process.env.PORT ?? 8000);
const tipos = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json; charset=utf-8", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav", ".ico": "image/x-icon" };
const servidor = http.createServer(async (request, response) => {
    if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405); response.end(); return; }
    try {
        const caminho = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        const segmentos = caminho.split(/[\\/]/);
        if (segmentos.some(parte => parte.startsWith(".") || parte === "node_modules")) { response.writeHead(403); response.end("Acesso negado"); return; }
        const arquivo = path.resolve(raiz, `.${caminho === "/" ? "/index.html" : caminho}`);
        const relativo = path.relative(raiz, arquivo);
        if (relativo.startsWith("..") || path.isAbsolute(relativo)) { response.writeHead(403); response.end("Acesso negado"); return; }
        if (!(await stat(arquivo)).isFile()) { response.writeHead(404); response.end("Arquivo não encontrado"); return; }
        const conteudo = await readFile(arquivo);
        response.writeHead(200, { "Content-Type": tipos[path.extname(arquivo)] ?? "application/octet-stream", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
        response.end(request.method === "HEAD" ? undefined : conteudo);
    } catch { response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); response.end("Arquivo não encontrado"); }
});
servidor.on("error", erro => { console.error(`Não foi possível iniciar o servidor: ${erro.message}. Use outra porta ou feche o servidor anterior.`); process.exitCode = 1; });
servidor.listen(porta, "127.0.0.1", () => console.log(`OBLIVION — servidor local\nhttp://localhost:${porta}\nModo de testes: http://localhost:${porta}/dev.html\nPressione Ctrl+C para encerrar.`));
