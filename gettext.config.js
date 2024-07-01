module.exports = {
  input: {
    path: ".",
    include: ["**/*.vue"],
    exclude: ["**/icon.vue"],
  },
  output: {
    locales: ["fr", "en"],
    path: "./language",
  },
}
