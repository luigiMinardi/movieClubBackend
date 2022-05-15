module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
        'jest/globals': true,
    },
    extends: ['eslint:recommended', 'prettier', 'plugin:jest/recommended'],
    plugins: ['prettier', 'jest'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'prettier/prettier': [
            'warn',
            {
                singleQuote: true,
                tabWidth: 4,
                trailingComma: 'es5',
                semi: true,
                endOfLine: 'lf',
            },
        ],
    },
};
