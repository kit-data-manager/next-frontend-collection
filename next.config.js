/** @type {import('next').NextConfig} */

const nextConfig = {
    typescript: {ignoreBuildErrors: false},
    trailingSlash: true,
    basePath: "",
    assetPrefix: "http://localhost:3000",
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'matwerk.datamanager.kit.edu',
                port: '',
                pathname: '/**',
            },
        ],
    },
};


module.exports = nextConfig;
