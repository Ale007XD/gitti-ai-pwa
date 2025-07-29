const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Создаем массив паттернов для копирования
const copyPatterns = [];

// Добавляем файлы, которые существуют
const filesToCopy = [
  'public/manifest.json',
  'public/sw.js',
  'public/favicon.ico'
];

filesToCopy.forEach(file => {
  const sourcePath = path.resolve(__dirname, file);
  if (fs.existsSync(sourcePath)) {
    copyPatterns.push({
      from: sourcePath,
      to: path.resolve(__dirname, 'dist', path.basename(file))
    });
  }
});

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    }),
    new CopyWebpackPlugin({
      patterns: copyPatterns
    })
  ],
  resolve: {
    fallback: {
      "process": require.resolve("process/browser")
    }
  }
};
