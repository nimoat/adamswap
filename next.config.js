/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export', // static导出
	images:{
		unoptimized: true // static导出
	},
	basePath: '/adamswap', // 适配 github page
	
	reactStrictMode: true,
};

module.exports = nextConfig;
