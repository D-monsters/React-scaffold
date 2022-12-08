/*
 * @Author: fdhou
 * @Date: 2022-12-06 15:30:02
 * @LastEditors: fdhou
 * @LastEditTime: 2022-12-06 15:30:39
 * @Description: 
 */
module.exports = {
  extends: ["react-app"], // 继承 react 官方规则
  parserOptions: {
    babelOptions: {
      presets: [
        // 解决页面报错问题
        ["babel-preset-react-app", false],
        "babel-preset-react-app/prod",
      ],
    },
  },
};