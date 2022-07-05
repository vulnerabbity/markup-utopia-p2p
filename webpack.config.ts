import path from "path";
import { Configuration as BasicWebpackConfig } from "webpack";
import { Configuration as DevServerConfig } from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";

type IWebpackConfig = BasicWebpackConfig & DevServerConfig;

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

function getAbsolutePath(relativePath: string): string {
  return path.resolve(__dirname, relativePath);
}

function getMode() {
  return isProd ? "production" : "development";
}

const source = getAbsolutePath("src");
const distributive = getAbsolutePath("dist");

const config: IWebpackConfig = {
  context: source,

  mode: getMode(),

  entry: {
    main: ["./main.ts", "@babel/polyfill"],
  },

  output: {
    filename: "[name].[contenthash].js",
    path: distributive,
  },

  devServer: {
    port: 4200,
    hot: isDev,
  },

  optimization: {
    splitChunks: {
      chunks: "all",
    },
    minimizer: [],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${source}/favicon.ico`,
          to: distributive,
        },
      ],
    }),
    new TerserWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-typescript"],
        },
      },
      {
        test: /\.scss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translate CSS into CommonJS
          "css-loader",
          // Compile scss to css
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|webp|svg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
};

if (isProd) {
  config.optimization!.minimizer!.push(new CssMinimizerWebpackPlugin());
}

export default config;
