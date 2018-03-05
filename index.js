require("colors");

const Table = require("cli-table2");
const shortid = require("shortid");
const os = require("os");
const styles = require("./theme");

const ifaces = os.networkInterfaces();

module.exports = opt => {
  const netInfo = {};
  const meta = {
    host: os.hostname(),
    env: process.env.NODE_ENV || "local",
    nonce: shortid.generate() // todo alphanumeric only uppercase
  };

  if (opt.server) {
    meta.port = opt.server.address().port;
  }
  if (opt.npm) {
    meta.name = opt.npm.name;
    meta.version = opt.npm.version;
  }
  if (opt.git) {
    meta.hash && (meta.hash = opt.git.hash);
    meta.branch && (meta.branch = opt.git.branch);
  }
  if (opt.banner) {
    meta.banner = opt.banner;
  }

  Object.keys(ifaces).map(name => {
    ifaces[name].filter(iface => !iface.internal).map(({ family, address }) => {
      if (!netInfo[family.toLowerCase()]) {
        netInfo[family.toLowerCase()] = [];
      }
      netInfo[family.toLowerCase()].push({
        name,
        address
      });
    });
  });
  if (netInfo.ipv4) {
    meta.ipv4 = new Table({
      chars: styles.table()
    });
    netInfo.ipv4.map(({ name, address }) => {
      meta.ipv4.push([styles.key(name), styles.value(address)]);
    });
    meta.ipv4 = meta.ipv4.toString();
  }
  if (netInfo.ipv6) {
    meta.ipv6 = new Table({
      chars: styles.table()
    });
    netInfo.ipv6.map(({ name, address }) => {
      meta.ipv6.push([styles.key(name), styles.value(address)]);
    });
    meta.ipv6 = meta.ipv6.toString();
  }

  for (const key in meta) {
    if (["banner", "ipv4", "ipv6", "env", "name", "port"].includes(key)) {
      continue;
    }
    meta[key] = styles.value(meta[key]);
  }

  meta.env = styles.env(meta.env);
  meta.name = styles.env(meta.name);
  meta.port = styles.metaPort(meta.port);
  //
  // todo: strings should go to pure functions which apply consistant formatting.
  const table = new Table({
    chars: styles.table()
  });
  meta.banner &&
    table.push([{ colSpan: 2, hAlign: "center", content: meta.banner }]);
  meta.env &&
    table.push([
      {
        colSpan: 2,
        hAlign: "center",
        content: meta.name
      }
    ]);
  meta.host && table.push([styles.key("ENV"), meta.env]);
  meta.version && table.push([styles.key("VERSION"), meta.version]);
  meta.commit && table.push([styles.key("COMMIT"), meta.commit]);
  meta.branch && table.push([styles.key("BRANCH"), meta.branch]);
  meta.host && table.push([styles.key("HOST"), meta.host]);
  meta.port && table.push([styles.key("PORT"), meta.port]);
  meta.ipv4 && table.push([styles.key("IPv4"), meta.ipv4]);
  meta.ipv6 && table.push([styles.key("IPv6"), meta.ipv6]);
  meta.nonce && table.push([styles.key("NONCE"), meta.nonce]);
  return table.toString();
};
