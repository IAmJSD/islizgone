import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", event => {
  event.respondWith(handleEvent(event));
});

const resignationTimestamp = "2022-10-20T13:35:00.000+00:00";

async function resignedAtApi() {
  return new Response(JSON.stringify(resignationTimestamp), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}

async function handleEvent(event) {
  try {
    return await getAssetFromKV(event);
  } catch (e) {
    let pathname = new URL(event.request.url).pathname;
    if (pathname === "/api/v1/resigned") return await resignedAtApi();
    return new Response(`"${pathname}" not found`, {
      status: 404,
      statusText: "not found"
    });
  }
}
