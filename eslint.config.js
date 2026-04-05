import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsdoc from 'eslint-plugin-jsdoc';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React hooks rules
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // JSDoc / TSDoc enforcement for agent navigability
  // Rationale: Measured 51% -> 67% improvement in AI agent doc-guided navigation.
  // See CLAUDE.md "Doc Comments for Agent Navigation" for full context.
  {
    plugins: { jsdoc },
    rules: {
      // Require doc comments on exports (DOC001 equivalent)
      'jsdoc/require-jsdoc': ['warn', {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
        },
        contexts: [
          'TSInterfaceDeclaration',
          'TSTypeAliasDeclaration',
          'TSEnumDeclaration',
          'ExportNamedDeclaration > VariableDeclaration',
        ],
        checkConstructors: false,
      }],

      // Require param descriptions (DOC004 equivalent)
      'jsdoc/require-param': 'warn',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-param-type': 'off', // TypeScript handles types

      // Require return descriptions (DOC005 equivalent)
      'jsdoc/require-returns': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/require-returns-type': 'off', // TypeScript handles types

      // Param name must match signature (DOC003 equivalent)
      'jsdoc/check-param-names': 'error',

      // Require throws documentation
      'jsdoc/require-throws': 'warn',

      // Quality: no empty descriptions
      'jsdoc/no-blank-block-descriptions': 'warn',
    },
  },
);
