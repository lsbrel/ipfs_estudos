import { MemoryBlockstore } from "blockstore-core";
import { unixfs } from "@helia/unixfs";
import { createHelia } from "helia";

async function createHelia201() {
  const blockstore = new MemoryBlockstore();

  const helia = await createHelia({
    blockstore: blockstore,
  });

  const fs = unixfs(helia);

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const cid = await fs.addBytes(encoder.encode("HELIA SUNSSPEAR"));

  console.log(`Added file cid => `);

  const helia2 = await createHelia({
    blockstore: blockstore,
  });

  const fs2 = unixfs(helia2);
  let text = "";

  for await (const chunk of fs2.cat(cid)) {
    text += decoder.decode(chunk, {
      stream: true,
    });
  }

  console.log(`Data restores => ` + text);
}

createHelia201();
