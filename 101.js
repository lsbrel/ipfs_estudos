import { unixfs } from "@helia/unixfs";
import { createHelia } from "helia";

async function createHelia101() {
  const helia = await createHelia();
  const fs = unixfs(helia);

  const encoder = new TextEncoder();
  const bytes = encoder.encode("TESTE MESSAGE");

  const cid = await fs.addBytes(bytes);

  console.log(`Added file => ` + cid);

  const decoder = new TextDecoder();

  let text = "";

  for await (const chunk of fs.cat(
    "bafkreiacmuzxqbxxcrluxwudaludblbfcb5m3fr2t2oyi5c7lolrw2nd6a"
  )) {
    text += decoder.decode(chunk, {
      stream: true,
    });
  }

  console.log(`Text => ` + text);

  return;
}

createHelia101();
