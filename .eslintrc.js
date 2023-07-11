module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ["@nuxt/eslint-config"],
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/script-setup-no-uses-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    semi: [2, "never"],
  },
}
