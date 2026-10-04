import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default tseslint.config(
  { ignores: ['dist', '.ssr', 'node_modules', '.impeccable', '.publish'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: ['buttonVariants', 'tabsListVariants'],
        },
      ],
    },
  },
  {
    files: ['*.config.js', 'scripts/*.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['scripts/verify-browser.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
)
