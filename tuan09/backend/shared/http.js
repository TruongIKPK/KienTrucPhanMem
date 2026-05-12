import { createServer } from "node:http";

export class HttpError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function createJsonServer({ serviceName, routes }) {
  return createServer(async (req, res) => {
    const startedAt = Date.now();
    const requestId = normalizeHeader(req.headers["x-request-id"]) || createRequestId();
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const log = (message, data = null) => logEvent(serviceName, requestId, message, data);

    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      log("CORS preflight", { method: req.method, path: url.pathname, status: 204 });
      return;
    }

    try {
      const match = matchRoute(routes, req.method, url.pathname);

      if (!match) {
        throw new HttpError(404, `${serviceName}: route not found`);
      }

      const body = await readJsonBody(req);
      log("Incoming request", {
        method: req.method,
        path: url.pathname,
        body: sanitizeBody(body),
      });

      const result = await match.route.handler({
        req,
        url,
        params: match.params,
        body,
        log,
        requestId,
      });

      const status = result?.status || 200;
      const payload = result?.data ?? result;
      sendJson(res, status, payload);
      log("Response sent", {
        status,
        durationMs: Date.now() - startedAt,
        summary: summarizePayload(payload),
      });
    } catch (error) {
      const status = error.status || 500;
      const payload = {
        success: false,
        service: serviceName,
        message: error.message || "Internal server error",
        details: error.details || null,
      };

      sendJson(res, status, payload);
      log("Request failed", {
        status,
        durationMs: Date.now() - startedAt,
        message: payload.message,
        details: payload.details,
      });
    }
  });
}

export function defineRoute(method, path, handler) {
  return {
    method,
    path,
    segments: path.split("/").filter(Boolean),
    handler,
  };
}

export function ok(data) {
  return { status: 200, data };
}

export function created(data) {
  return { status: 201, data };
}

export function requireFields(body, fields) {
  const missing = fields.filter((field) => body?.[field] === undefined || body?.[field] === "");

  if (missing.length > 0) {
    throw new HttpError(400, `Missing required field(s): ${missing.join(", ")}`);
  }
}

export function startService(server, { name, host = "0.0.0.0", port }) {
  server.listen(port, host, () => {
    logEvent(name, "BOOT", "Service started", {
      url: `http://${host}:${port}`,
      port,
      host,
    });
  });
}

export async function requestJson(url, options = {}) {
  const { requestId, ...fetchOptions } = options;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      "content-type": "application/json",
      ...(requestId ? { "x-request-id": requestId } : {}),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new HttpError(response.status, payload?.message || `Request failed: ${url}`, payload);
  }

  return payload;
}

export function logEvent(serviceName, requestId, message, data = null) {
  const timestamp = new Date().toISOString();
  const suffix = data ? ` ${JSON.stringify(data)}` : "";
  console.log(`[${timestamp}] [${serviceName}] [${requestId}] ${message}${suffix}`);
}

function createRequestId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function normalizeHeader(value) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function matchRoute(routes, method, pathname) {
  const segments = pathname.split("/").filter(Boolean);

  for (const route of routes) {
    if (route.method !== method || route.segments.length !== segments.length) {
      continue;
    }

    const params = {};
    let matches = true;

    for (let index = 0; index < route.segments.length; index += 1) {
      const expected = route.segments[index];
      const actual = segments[index];

      if (expected.startsWith(":")) {
        params[expected.slice(1)] = decodeURIComponent(actual);
      } else if (expected !== actual) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return { route, params };
    }
  }

  return null;
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

function sendJson(res, status, data) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

async function readJsonBody(req) {
  if (!["POST", "PATCH", "PUT"].includes(req.method)) {
    return null;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8").trim();

  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new HttpError(400, "Request body must be valid JSON");
  }
}

function sanitizeBody(body) {
  if (!body || typeof body !== "object") {
    return body;
  }

  return Object.fromEntries(
    Object.entries(body).map(([key, value]) => [
      key,
      key.toLowerCase().includes("password") ? "***" : value,
    ]),
  );
}

function summarizePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const summary = {};

  for (const [key, value] of Object.entries(payload)) {
    if (Array.isArray(value)) {
      summary[key] = `array(${value.length})`;
    } else if (value && typeof value === "object") {
      summary[key] = summarizeEntity(value);
    } else {
      summary[key] = value;
    }
  }

  return summary;
}

function summarizeEntity(entity) {
  const picked = {};

  for (const key of ["id", "name", "email", "status", "totalAmount", "amount", "service"]) {
    if (entity[key] !== undefined) {
      picked[key] = entity[key];
    }
  }

  return Object.keys(picked).length > 0 ? picked : "object";
}
