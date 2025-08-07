
const { override, addWebpackPlugin } = require('customize-cra');

const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = override(
    addWebpackPlugin(
        new MonacoWebpackPlugin({
            languages: ['json'],
            features: ['!gotoSymbol'], // Disable some features to minimize bundle size
        })
    )
);