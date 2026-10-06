import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: globals.node },
    rules: {
      // Regla del proyecto: ningún archivo de código supera 70 líneas.
      'max-lines': ['error', { max: 70, skipBlankLines: false, skipComments: false }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'no-console': 'error',
    },
  },
  {
    // Solo el repositorio de tiendas, el worker (recorre todas las tiendas con
    // ids leídos de la base) y los tests pueden fabricar un TiendaId.
    files: ['src/**/*.ts'],
    ignores: [
      'src/modules/tiendas/tiendas.repository.ts',
      'src/worker/**',
      'src/**/*.test.ts',
      'src/test/**',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/tiendaId.js'],
              importNames: ['comoTiendaId'],
              message:
                'Un TiendaId solo sale del repositorio de tiendas (ver shared/db/tiendaId.ts).',
            },
          ],
        },
      ],
    },
  },
  prettier,
);
