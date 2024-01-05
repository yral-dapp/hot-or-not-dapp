const tailwindConfig = require('@hnn/components/tailwind.config.cjs')

const config = {
  ...tailwindConfig,
  content: [
    './**/*.{html,js,svelte,ts}',
    '../components/**/*.{html,js,svelte,ts}',
  ],
}

module.exports = config
