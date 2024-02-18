import { createHelia } from "helia";
import { ipns } from "@helia/ipns";
import { unixfs } from "@helia/unixfs";

async function heliaCreate() {
  try {
    const helia = await createHelia();
    const name = ipns(helia);

    const keyInfo = await helia.libp2p.services.keychain.createKey(
      "my-key",
      "RSA"
    );
    const peerId = await helia.libp2p.services.keychain.exportPeerId(
      keyInfo.name
    );
    console.log(peerId);
    name.republish(
      peerId,
      "/ipfs/QmfVBGmPpqdRQUZP7LYRqH2vv1DSweA8p37k5qq8CNFAyT"
    );
  } catch (err) {
    console.log("Error => " + err);
  }
}

heliaCreate();
