module.exports = {
  root: true, // 表示这是根 ESLint 配置文件，不再向上查找
  parser: "@typescript-eslint/parser", // 使用 TypeScript 解析器
  parserOptions: {
    ecmaVersion: 2022, // 支持最新 ES 语法
    sourceType: "module", // 支持 import/export
    ecmaFeatures: {
      jsx: true, // 支持 JSX
    },
  },
  env: {
    browser: true, // 浏览器环境
    node: true, // Node 环境
    es6: true,
    jest: true, // 如果用 jest 测试
  },
  extends: [
    "taro/react", // Taro 官方推荐规则
    "plugin:@typescript-eslint/recommended", // TypeScript 推荐规则
    "plugin:react/recommended", // React 推荐规则
    "plugin:react-hooks/recommended", // React Hooks 推荐规则
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  rules: {
    // 这里可以覆盖或自定义规则
    "react/prop-types": "off", // 使用 TS 就不需要 prop-types
    "@typescript-eslint/explicit-module-boundary-types": "off", // 可关闭函数返回类型检查
    "no-console": "warn", // 警告 console
    "no-unused-vars": "warn", // 警告未使用的变量
  },
  settings: {
    react: {
      version: "detect", // 自动检测 React 版本
    },
  },
};
