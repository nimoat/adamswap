import type { ThemeConfig } from "antd";
import { theme } from "antd";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { userSeedToken, userMapToken } = require("./themeVarable");

const usertheme: ThemeConfig = {
  // 1. 单独使用暗色算法
  algorithm: theme.darkAlgorithm,
  token: {
    ...userSeedToken,
    ...userMapToken,
  },
};

export default usertheme;
