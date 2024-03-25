const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const fs = require("fs");

const CompileCodeHelpers = {
  compile: async (codeChunk, filename) => {
    // 1. write code file
    let code = `console.log(${codeChunk})`;
    fs.writeFileSync(filename + ".js", code);

    // 2. execute code file
    const { stderr, stdout } = await exec(`node ${filename}.js`);

    if (stderr) {
      console.error(stderr);
      return [stderr, null];
    }
    console.log(`${filename}-stdout`, stdout);
    return [null, stdout.replace(/\n/g, "")];
  },
};

module.exports = CompileCodeHelpers;
