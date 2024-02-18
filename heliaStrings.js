import { createHelia } from "helia";
import { strings } from "@helia/strings";
import { json } from "@helia/json";
import { CID } from "multiformats/cid";

(async () => {
  const heliaNode = await createHelia();
  const strs = strings(heliaNode);
  const jsonHelia = json(heliaNode);

  const imutableAddr = await strs.add("Skrrr");

  console.log(
    await strs.get(
      CID.parse("bafkreig7h5qzqbfjf7nuavyzfxcd3v2i5j3yvxcsxreyz2afetabjoarde")
    )
  );
})();
