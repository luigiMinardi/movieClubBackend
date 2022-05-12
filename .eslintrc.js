module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    plugins: ['prettier'],
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
