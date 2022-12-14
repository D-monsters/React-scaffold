/*
 * @Author: fdhou
 * @Date: 2022-12-06 14:50:19
 * @LastEditors: fdhou
 * @LastEditTime: 2022-12-08 10:43:06
 * @Description: 开发环境webpack配置
 */
const path = require('path')
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// 获取cross-env定义的环境变量
const isProduction = process.env.NODE_ENV === 'production'
// 获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    isProduction ? MiniCssExtractPlugin.loader : "style-loader",
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"],
        },
      },
    },
    preProcessor && {
      loader: preProcessor,
      options:
        preProcessor === "less-loader" ?
          {
            lessOptions: {
              modifyVars: { '@primary-color': '#1DA57A' },
              javascriptEnabled: true,
            },
          } : {},
    },
  ].filter(Boolean);
};
module.exports = {
  entry: './src/main.js',
  output: {
    path: isProduction ? path.resolve(__dirname, '../dist') : undefined,
    filename: isProduction ? 'static/js/[name].[hash:10].js' : 'static/js/[name].js', // 输出的文件名
    chunkFilename: isProduction ? 'static/js/[name].[hash:10].chunk.js' : 'static/js/[name].chunk.js', // 动态导入的文件打包输出的文件名
    assetModuleFilename: 'static/media/[name][hash:10][ext][query]', // 图片等公共资源打包后的名字
    clean: isProduction ? true : false,
  },
  module: {
    rules: [
      /**
       * 样式资源处理
       */
      {
        test: /\.css$/,
        use: getStyleLoaders()
      },
      {
        test: /\.less$/,
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders("stylus-loader"),
      },
      /**
       * 图片资源处理
       */
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
          },
        },
      },
      /**
       * 字体图标处理
       */
      {
        test: /\.(ttf|woff2?)$/,
        type: "asset/resource", // 原封不动输出
      },
      /**
       * js资源处理
       */
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "../src"),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true, // 开启babel编译缓存
          cacheCompression: false, // 缓存文件不要压缩
          plugins: [
            !isProduction && 'react-refresh/babel' // js热替换HMR
          ].filter(Boolean)
        }
      }
    ]
  },
  plugins: [
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),// 要处理的文件范围
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"), // 缓存目录
    }),
    // 处理html资源
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    isProduction && new MiniCssExtractPlugin({
      filename: "static/css/[name].[hash:10].css",
      chunkFilename: "static/css/[name].[hash:10].chunk.css",
    }),
    isProduction && new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          globOptions: {
            ignore: ["**/index.html"], // 忽略这个文件
          },
        },
      ],
    }),
    !isProduction && new ReactRefreshWebpackPlugin()
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: "all", // 代码分割
      cacheGroups: {
        // react react-dom react-router-dom 一起打包成单独文件
        react: {
          test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
          name: "chunk_react", // 包名、
          priority: 40, // 权重需要比node_moduels，否则会直接打包到ode_moduels里面了
        },
        // antd打包成单独文件
        antd: {
          test: /[\\/]node_modules[\\/]antd(.*)?[\\/]/,
          name: "chunk_antd", // 包名、
          priority: 30, // 权重需要比node_moduels，否则会直接打包到ode_moduels里面了
        },
        // 剩下node_modules的在单独打包成一个文件
        lib: {
          test: /[\\/]node_modules[\\/]/,
          name: "chunk_libs", // 包名、
          priority: 20,
        }

      }
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
    // 是否需要进行压缩
    minimize: isProduction,
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ]
  },
  mode: isProduction ? "production" : 'development',
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  // webpack解析模块加载选项
  resolve: {
    // 自动补全扩展名
    extensions: [".jsx", ".js", ".json"]
  },
  // 自动化配置
  devServer: {
    open: true, // 是否自动打开浏览器
    host: "localhost",
    port: 4000,
    hot: true, // 热模块替换
    historyApiFallback: true, // 解决react-router刷新404问题
  },
  performance: false, // 关闭性能分析，提示速度
}
