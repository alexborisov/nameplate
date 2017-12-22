const Table = require("cli-table2");
const shortid = require("shortid");
const os = require("os");
const ifaces = os.networkInterfaces();

module.exports = opt => {
  const netInfo = {};
  const meta = {
    host: os.hostname(),
    env: process.env.NODE_ENV || "local",
    nonce: shortid.generate()
  };

  if (opt.server) {
    meta.port = opt.server.address().port;
  }
  if (opt.npm) {
    meta.name = opt.npm.name;
    meta.version = opt.npm.version;
  }
  if (opt.git) {
    meta.hash = opt.git.hash;
    meta.branch = opt.git.branch;
  }
  if (opt.banner) {
    meta.banner = opt.banner;
  }

  Object.keys(ifaces).map(name => {
    ifaces[name].filter(iface => !iface.internal).map(({ family, address }) => {
      let test = [1, 2, 3];
      if (!netInfo[family.toLowerCase()]) {
        netInfo[family.toLowerCase()] = [];
      }
      netInfo[family.toLowerCase()].push({
        name,
        address
      });
    });
  });
  meta.ipv4 = new Table();
  netInfo.ipv4.map(({ name, address }) => {
    meta.ipv4.push([name, address]);
  });
  meta.ipv6 = new Table();
  netInfo.ipv6.map(({ name, address }) => {
    meta.ipv6.push([name, address]);
  });

  const table = new Table();
  meta.banner &&
    table.push([{ colSpan: 2, hAlign: "center", content: meta.banner }]);
  meta.env &&
    table.push([{ colSpan: 2, hAlign: "center", content: meta.name }]);
  meta.host && table.push(["ENV", meta.env]);
  meta.version && table.push(["VERSION", meta.version]);
  meta.commit && table.push(["COMMIT", meta.commit]);
  meta.branch && table.push(["BRANCH", meta.branch]);
  meta.host && table.push(["HOST", os.hostname()]);
  meta.port && table.push(["PORT", meta.port]);
  meta.ipv4 && table.push(["IPv4", meta.ipv4.toString()]);
  meta.ipv6 && table.push(["IPv6", meta.ipv6.toString()]);
  meta.nonce && table.push(["NONCE", meta.nonce]);
  return table.toString();
};
