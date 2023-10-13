import type { ThemeConfig } from 'antd';
import  { theme } from 'antd';

const usertheme: ThemeConfig = {
  // 1. 单独使用暗色算法
  algorithm: theme.darkAlgorithm,
  token: {
    fontSize: 16,
    // colorPrimary: '#52c41a',
    borderRadiusLG: 10,
  },
};

export default usertheme;