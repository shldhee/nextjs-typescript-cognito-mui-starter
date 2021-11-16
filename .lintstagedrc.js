// module.exports = {
//   "**/*.{js?(x),ts?(x)}": (filenames) =>
//     `next lint --fix --file ${filenames
//       .map((file) => file.split(process.cwd())[1])
//       .join(" --file ")}`,
// };
// module.exports = {
//   "**/*.{js?(x),ts?(x)}": ["eslint", "prettier --write", "git add"],
// };
module.exports = {
  // Run type-check on changes to TypeScript files
  "**/*.ts?(x)": () => "yarn type-check",
  // Run ESLint on changes to JavaScript/TypeScript files
  "**/*.(ts|js)?(x)": (filenames) => `yarn lint . ${filenames.join(" ")}`,
};
