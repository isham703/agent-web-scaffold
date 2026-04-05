// JSDoc enforcement for JavaScript (not TypeScript)
// Merge these rules into your existing eslint config.
//
// Install: npm install -D eslint-plugin-jsdoc
//
// Why: Doc comments measurably improve AI agent navigation.
// Agents need fewer tool calls and make fewer mistakes when
// functions, components, and data shapes are self-describing.

// Add to your eslint config's plugins and rules:
export const jsdocRules = {
  plugins: ['jsdoc'],
  rules: {
    // Require doc comments on exported functions and classes
    'jsdoc/require-jsdoc': ['warn', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
      },
      contexts: [
        // Also require on exported arrow functions
        'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression',
      ],
      checkConstructors: false,
    }],

    // Require @param for each parameter
    'jsdoc/require-param': 'warn',
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-param-type': 'warn', // JS needs types in JSDoc (unlike TS)

    // Require @returns
    'jsdoc/require-returns': 'warn',
    'jsdoc/require-returns-description': 'warn',
    'jsdoc/require-returns-type': 'warn',

    // Param names must match function signature
    'jsdoc/check-param-names': 'error',

    // No empty doc blocks
    'jsdoc/no-blank-block-descriptions': 'warn',
  },
};

// Example of a well-documented component:
//
// /**
//  * Displays a cost breakdown card for a workspace.
//  * Uses Cloudscape Container with embedded BarChart.
//  *
//  * @param {Object} props
//  * @param {CostRecord[]} props.costs - Cost records for the selected period
//  * @param {string} props.workspaceName - Display name for the header
//  * @param {Function} props.onSetSpendLimit - Callback to open SpendLimitModal
//  * @returns {JSX.Element} Cloudscape Container with cost chart
//  */
// function CostBreakdownCard({ costs, workspaceName, onSetSpendLimit }) {
