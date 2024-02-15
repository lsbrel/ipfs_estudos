import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { identify } from "@libp2p/identify";
import { tcp } from "@libp2p/tcp";
import { MemoryBlockstore } from "blockstore-core";
import { MemoryDatastore } from "datastore-core";
import { unixfs } from "@helia/unixfs";
import { createHelia } from "helia";
import { createLibp2p } from "libp2p";

async function createNode() {
  const blockstore = new MemoryBlockstore();
  const datastore = new MemoryDatastore();

  const libp2p = await createLibp2p({
    datastore,
    addresses: {
      listen: ["/ip4/127.0.0.1/tcp/0"],
    },
    transports: [tcp()],
    connectionEncryption: [noise()],
    streamMuxers: [yamux()],
    peerDiscovery: [
      bootstrap({
        list: [
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
        ],
      }),
    ],
    services: {
      identify: identify(),
    },
  });

  return await createHelia({
    datastore: datastore,
    blockstore: blockstore,
    libp2p: libp2p,
  });
}

async function main301() {
  const node1 = await createNode();
  const node2 = await createNode();

  const multiaddrs = node2.libp2p.getMultiaddrs();
  await node1.libp2p.dial(multiaddrs[0]);

  const fs = unixfs(node1);

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const cid = await fs.addBytes(encoder.encode("HELIA'S SUN SPEAR"));

  console.log(`ADDED FILE WITH CID => ${cid}`);

  const auxCid = "QmYuKjwKL6o8h29Ziv6S5P1Ta8CC5jKrsdwSnxejYTXRpn";
  console.log("GETTING DATA FROM CID => " + cid);
  const fs2 = unixfs(node2);
  let text = "";

  for await (const chunk of fs2.cat(cid)) {
    text += decoder.decode(chunk, {
      stream: true,
    });
  }

  console.log(`FILE DATA => ${text}`);
}

main301();
