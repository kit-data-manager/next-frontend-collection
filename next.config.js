/** @type {import('next').NextConfig} */

const nextConfig = {
    typescript: {ignoreBuildErrors: false},
    trailingSlash: true,
    basePath: "",
    assetPrefix: "https://localhost/frontend",
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'localhost',
                port: '',
                pathname: '/**',
            },
        ],
    },
};


module.exports = nextConfig;
