import axios from "axios";
import * as fs from "fs";
import { writeFileSync } from "fs-extra";

(async () => {
  const ipsResp = await axios.get(
    "https://raw.githubusercontent.com/Loyalsoldier/geoip/release/text/cn.txt"
  );
  const ips: string[] = ipsResp.data.split("\n");

  const lineStrs: string[] = [];

  lineStrs.push("/ip firewall address-list");

  lineStrs.push("add address=10.0.0.0/8 list=CN comment=local");
  lineStrs.push("add address=172.16.0.0/12 list=CN comment=local");
  lineStrs.push("add address=192.168.0.0/16 list=CN comment=local");

  ips.forEach((ip) => {
    const ipStr = ip.trim();
    if (!ipStr) {
      return;
    } else {
      lineStrs.push(`add address=${ipStr} list=CN comment=AS4809`);
    }
  });

  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
  }

  writeFileSync("dist/CN.rsc", lineStrs.join("\n"));
})();
