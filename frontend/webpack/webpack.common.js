const webpack = require('webpack');
const {
  BaseHrefWebpackPlugin
} = require('base-href-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");

const packageJson = require('./../package.json');
const utils = require('./utils.js');

module.exports = (options) => ({
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
    modules: ['node_modules'],
    mainFields: ['es5', 'browser', 'module', 'main'],
    alias: utils.mapTypescriptAliasToWebpackAlias()
  },
  stats: {
    children: false
  },
  node: {
    crypto: true,
    stream: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    rules: [
      /* {
        test: /\.mjs$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }, */
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: true,
          caseSensitive: true,
          removeAttributeQuotes: false,
          minifyJS: false,
          minifyCSS: false
        },
        exclude: /(src\/main\/webapp\/index.html)/
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot)$/i,
        loader: 'file-loader',
        options: {
          digest: 'hex',
          hash: 'sha512',
          name: 'content/[hash].[ext]'
        }
      },
      {
        test: /manifest.webapp$/,
        loader: 'file-loader',
        options: {
          name: 'manifest.webapp'
        }
      },
      // Ignore warnings about System.import in Angular
      {
        test: /[\/\\]@angular[\/\\].+\.js$/,
        parser: {
          system: true
        }
      },

    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${options.env}'`,
        BUILD_TIMESTAMP: `'${new Date().getTime()}'`,
        VERSION: `'${packageJson.version}'`,
        DEBUG_INFO_ENABLED: options.env === 'development',
        // The root URL for API calls, ending with a '/' - for example: `"https://www.jhipster.tech:8081/myservice/"`.
        // If this URL is left empty (""), then it will be relative to the current context.
        // If you use an API server, in `prod` mode, you will need to enable CORS
        // (see the `jhipster.cors` common JHipster property in the `application-*.yml` configurations)
        SERVER_API_URL: `''`
      }
    }),
    new CopyWebpackPlugin([{
        from: './node_modules/swagger-ui/dist/css',
        to: 'swagger-ui/dist/css'
      },
      {
        from: './node_modules/swagger-ui/dist/lib',
        to: 'swagger-ui/dist/lib'
      },
      {
        from: './node_modules/swagger-ui/dist/swagger-ui.min.js',
        to: 'swagger-ui/dist/swagger-ui.min.js'
      },
      {
        from: './src/swagger-ui/',
        to: 'swagger-ui'
      },
      {
        from: './src/content/',
        to: 'content'
      },
      {
        from: './src/images/',
        to: 'images'
      },
      {
        from: './src/js/',
        to: 'js'
      },
      {
        from: './src/css/',
        to: 'css'
      },
      {
        from: './src/favicon.ico',
        to: 'favicon.ico'
      },
      {
        from: './src/favicon-16x16.png',
        to: 'favicon-16x16.png'
      },
      {
        from: './src/favicon-32x32.png',
        to: 'favicon-32x32.png'
      },
      {
        from: './src/manifest.webapp',
        to: 'manifest.webapp'
      },
      {
        from: './src/robots.txt',
        to: 'robots.txt'
      }
    ]),
    new MergeJsonWebpackPlugin({
      output: {
        groupBy: [{
            pattern: "./src/i18n/en/*.json",
            fileName: "./i18n/en.json"
          },
          {
            pattern: "./src/i18n/de/*.json",
            fileName: "./i18n/de.json"
          }
        ]
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['polyfills', 'main', 'global'],
      chunksSortMode: 'manual',
      inject: 'body'
    }),
    new BaseHrefWebpackPlugin({
      baseHref: '/'
    })
  ]
});
