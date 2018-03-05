require("colors");

const key = raw => {
  const str = raw.toString();
  return str.bold.dim;
};
const value = raw => {
  if (!raw) {
    return;
  }
  const str = raw.toString();
  return str;
};
const env = str => {
  return str.toUpperCase().green.bold;
};
const metaPort = str => {
  return value(str).bold;
};
const table = chars => {
  chars = chars || {
    top: "─",
    "top-mid": "─",
    "top-left": "╔",
    "top-right": "╗",
    bottom: "─",
    "bottom-mid": "─",
    "bottom-left": "╚",
    "bottom-right": "╝",
    left: "│",
    "left-mid": "│",
    mid: "-",
    "mid-mid": "+",
    right: "│",
    "right-mid": "│",
    middle: "│"
  };
  for (char in chars) {
    chars[char] = chars[char].dim;
  }
  return chars;
};

module.exports = {
  key,
  value,
  env,
  metaPort,
  table
};
