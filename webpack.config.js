/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // Точка входа вашего приложения
  output: {
    path: path.resolve(__dirname, 'dist'), // Директория для выходных файлов
    filename: 'bundle.js', // Имя выходного файла
    publicPath: '/', // Путь, используемый в URL-адресах внутри вашего приложения
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Расширения файлов, которые поддерживает приложение
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Загрузчик для транспиляции JavaScript и TypeScript
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'], // Подключение необходимых пресетов Babel
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Загрузчики для работы с CSS файлами
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader', // Загрузчик для файлов изображений
            options: {
              name: '[name].[ext]',
              outputPath: 'images/', // Директория для сохранения изображений
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Плагин для очистки выходной директории перед каждой сборкой
    new HtmlWebpackPlugin({
      template: './public/index.html', // Шаблон HTML файла
      favicon: './public/favicon.ico', // Favicon вашего приложения
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // Директория для отслеживаемого контента сервера разработки
    compress: true, // Включение сжатия для всех файлов на сервере разработки
    port: 3000, // Порт сервера разработки
    historyApiFallback: true, // Поддержка HTML5 History API
  },
};
