module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1",
        },
        "useBuiltIns": "usage",//按需引入polyfill的代码
        "corejs": "3.6.5"
      }
    ]
  ]
}
