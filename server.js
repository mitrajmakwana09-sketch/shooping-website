/* Local server for MyShop product uploads. */
const http = require("http");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT) || 3000;
const SITE_DIR = __dirname;
const UPLOAD_DIR = "D:\\meetraj";
const PRODUCTS_FILE = path.join(UPLOAD_DIR, "products.json");
const ALLOWED_TYPES = new Map([
    ["image/jpeg", ".jpg"],
    ["image/png", ".png"],
    ["image/webp", ".webp"],
    ["image/gif", ".gif"]
]);

function send(res, status, body, type = "text/plain; charset=utf-8") {
    res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
    res.end(body);
}

async function ensureStorage() {
    await fsp.mkdir(UPLOAD_DIR, { recursive: true });
    try {
        await fsp.access(PRODUCTS_FILE);
    } catch {
        await fsp.writeFile(PRODUCTS_FILE, "[]\n", "utf8");
    }
}

async function readProducts() {
    await ensureStorage();
    try {
        const parsed = JSON.parse(await fsp.readFile(PRODUCTS_FILE, "utf8"));
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function saveProducts(products) {
    const temporary = `${PRODUCTS_FILE}.tmp`;
    await fsp.writeFile(temporary, `${JSON.stringify(products, null, 2)}\n`, "utf8");
    await fsp.rename(temporary, PRODUCTS_FILE);
}

function readBody(request) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        request.on("data", chunk => {
            size += chunk.length;
            if (size > 8 * 1024 * 1024) {
                reject(new Error("Image must be 8 MB or smaller."));
                request.destroy();
                return;
            }
            chunks.push(chunk);
        });
        request.on("end", () => resolve(Buffer.concat(chunks)));
        request.on("error", reject);
    });
}

function parseMultipart(body, contentType) {
    const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || "");
    if (!boundaryMatch) throw new Error("Invalid upload request.");
    const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
    const fields = {};
    let file = null;
    let position = body.indexOf(boundary) + boundary.length + 2;

    while (position > boundary.length + 1 && position < body.length) {
        const next = body.indexOf(boundary, position);
        if (next < 0) break;
        const part = body.subarray(position, next - 2);
        const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
        if (headerEnd >= 0) {
            const headers = part.subarray(0, headerEnd).toString("utf8");
            const value = part.subarray(headerEnd + 4);
            const nameMatch = /name="([^"]+)"/i.exec(headers);
            const filenameMatch = /filename="([^"]*)"/i.exec(headers);
            const name = nameMatch && nameMatch[1];
            if (filenameMatch && name === "image") {
                const typeMatch = /content-type:\s*([^\r\n]+)/i.exec(headers);
                file = { filename: filenameMatch[1], type: typeMatch ? typeMatch[1].trim().toLowerCase() : "", data: value };
            } else if (name) {
                fields[name] = value.toString("utf8").trim();
            }
        }
        position = next + boundary.length + 2;
    }
    return { fields, file };
}

async function handleUpload(request, response) {
    const body = await readBody(request);
    const { fields, file } = parseMultipart(body, request.headers["content-type"]);
    const name = (fields.name || "").slice(0, 100);
    const category = (fields.category || "Other").slice(0, 50);
    const price = Number(fields.price);
    if (!name || !Number.isFinite(price) || price < 0 || !file || !file.data.length) {
        return send(response, 400, JSON.stringify({ error: "Enter product name, valid price, and an image." }), "application/json");
    }
    const extension = ALLOWED_TYPES.get(file.type);
    if (!extension) {
        return send(response, 400, JSON.stringify({ error: "Only JPG, PNG, WEBP, and GIF images are allowed." }), "application/json");
    }
    await ensureStorage();
    const imageName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`;
    await fsp.writeFile(path.join(UPLOAD_DIR, imageName), file.data);
    const products = await readProducts();
    const product = { id: crypto.randomUUID(), name, category, price, image: `/uploads/${imageName}`, createdAt: new Date().toISOString() };
    products.unshift(product);
    await saveProducts(products);
    send(response, 201, JSON.stringify(product), "application/json");
}

function contentType(filePath) {
    return ({ ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif" })[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

http.createServer(async (request, response) => {
    try {
        const url = new URL(request.url, `http://${request.headers.host}`);
        if (request.method === "GET" && url.pathname === "/api/products") {
            return send(response, 200, JSON.stringify(await readProducts()), "application/json");
        }
        if (request.method === "POST" && url.pathname === "/api/products") return await handleUpload(request, response);
        if (request.method === "GET" && url.pathname.startsWith("/uploads/")) {
            const filename = path.basename(decodeURIComponent(url.pathname));
            const filePath = path.join(UPLOAD_DIR, filename);
            try {
                const data = await fsp.readFile(filePath);
                return send(response, 200, data, contentType(filePath));
            } catch { return send(response, 404, "Image not found."); }
        }
        if (request.method !== "GET") return send(response, 405, "Method not allowed.");
        const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
        const filePath = path.resolve(SITE_DIR, `.${pathname}`);
        if (!filePath.startsWith(SITE_DIR + path.sep)) return send(response, 403, "Forbidden.");
        try {
            const data = await fsp.readFile(filePath);
            send(response, 200, data, contentType(filePath));
        } catch { send(response, 404, "Page not found."); }
    } catch (error) {
        send(response, 500, JSON.stringify({ error: error.message || "Server error." }), "application/json");
    }
}).listen(PORT, () => console.log(`MyShop server is running at http://localhost:${PORT}`));
