import type { ThemeConfig } from 'antd';
import  { theme } from 'antd';
const { userSeedToken, userMapToken } = require("./themeVarable")

const usertheme: ThemeConfig = {
  // 1. 单独使用暗色算法
  algorithm: theme.darkAlgorithm,
  token: {
    ...userSeedToken,
    ...userMapToken
  },
};

export default usertheme;