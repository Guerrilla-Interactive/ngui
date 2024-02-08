// See more details about this code here
// https://nextjs.org/docs/app/building-your-application/configuring/eslint#lint-staged
const path = require('path')

const buildEslintCommand = (filenames) => {
  const files = filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')
  return [
    `next lint --fix --file ${files}`,
    `pnpm exec prettier --write ${files}`,
  ]
}

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
