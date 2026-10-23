import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../public/sw.js"), "utf8");
function setup() {
  const handlers = new Map(), stores = new Map();
  const CACHE = "h-beauty-v4";
  const caches = {
    open: async name => {
      if (!stores.has(name)) stores.set(name, new Map());
      const items = stores.get(name);
      return {
        addAll: async urls => { for (const url of urls) items.set(url, { ok: true, body: url }); },
        put: async (request, response) => items.set(typeof request === "string" ? request : request.url, response),
      };
    },
    keys: async () => [...stores.keys()],
    delete: async name => stores.delete(name),
    match: async request => {
      const key = typeof request === "string" ? request : request.url;
      for (const items of stores.values()) if (items.has(key)) return items.get(key);
    },
  };
  const self = {
    location: {origin: "https://salon.test"},
    addEventListener: (name, handler) => handlers.set(name, handler),
    skipWaiting: async () => undefined,
    clients: {claim: async () => undefined},
  };
  runInNewContext(source,{
    self,caches,URL,Promise,
    fetch: async () => { throw new Error("offline"); }
  });
  function trigger(kind, request) {
    let pending;
    handlers.get(kind)({
      request,
      waitUntil: promise => { pending = promise; },
      respondWith: promise => { pending = promise; },
    });
    return pending;
  }
  return {stores,CACHE,trigger};
}
test("offline shell includes salon vector icon and raster installs", async () => {
  const ctx=setup(); await ctx.trigger("install");
  const cached=ctx.stores.get(ctx.CACHE);
  for (const name of ["/","/index.html","/manifest.webmanifest",
    "/icons/hananeh-signature.svg","/icons/icon-192.png",
    "/icons/icon-512.png","/icons/apple-touch-icon.png"])
    assert.ok(cached.has(name), name);
});
test("old offline caches are removed on activation", async () => {
  const ctx=setup();ctx.stores.set("h-beauty-v3",new Map());
  await ctx.trigger("install");await ctx.trigger("activate");
  assert.equal(ctx.stores.has("h-beauty-v3"),false);
  assert.equal(ctx.stores.has(ctx.CACHE),true);
});
test("offline navigation falls back to cached home shell", async () => {
  const ctx=setup();await ctx.trigger("install");
  const response=await ctx.trigger("fetch",{method:"GET",
    url:"https://salon.test/#/looks",mode:"navigate"});
  assert.equal(response.body, "/index.html");
});
