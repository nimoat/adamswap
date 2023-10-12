/** @type {import('next').NextConfig} */
const nextConfig = {
	// static导出
	output: 'export',
	images:{
		unoptimized: true
	},
	
	reactStrictMode: true,
};

module.exports = nextConfig;
