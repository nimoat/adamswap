/** @type {import('next').NextConfig} */
const withLess = require("next-with-less");
const { theme } = require("antd");
const { userSeedToken, userMapToken } = require("./src/theme/themeVarable.ts");

const { darkAlgorithm, defaultSeed } = theme;
const mapToken = darkAlgorithm({ ...defaultSeed, ...userSeedToken });

const nextConfig = {
  output: "export", // static导出
  images: {
    unoptimized: true, // static导出
  },
  // basePath: "/adamswap", // 适配 github page, 使用custom domain则不需要
  transpilePackages: ["ahooks"], // 解决Cannot use import statement outside a module
  reactStrictMode: true,
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        ...mapToken,
        ...userMapToken,
      },
    },
  },
};

module.exports = withLess(nextConfig);
