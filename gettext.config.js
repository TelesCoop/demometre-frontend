module.exports = {
  input: {
    path: ".",
    include: [
      "**/*.ts",
      "**/*.vue",
    ],
    exclude: ["**/icon.vue"],
  },
  output: {
    locales: ["fr", "en"],
    path: "./language",
  },
}
