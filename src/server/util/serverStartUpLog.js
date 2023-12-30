const { gray, cyan } = require("kolorist");

module.exports = (address, pkg) => {
  console.log("\u001b[32m[server]", "up and running\u001b[0m\n");
  console.log(gray(`upchunks microservice version: ${pkg.version}\n`));
  console.log(cyan("\\(॰ ꤮ ॰)/ What's up there?"));
  console.log(gray("\nHome"));
  console.log(`http://${address.address}:${address.port}/v${pkg.version.at(0)}/api/upchunks`);
  console.log(gray("..."));
};
