import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  output: 'export',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/resume/' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/resume' : '',
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
