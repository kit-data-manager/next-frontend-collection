/** @type {import('next').NextConfig} */

/**assetPrefix: "http://localhost", */
const nextConfig = {
    typescript: {ignoreBuildErrors: false},
    trailingSlash: true,
    basePath: "",
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '',
                pathname: '/**',
            },
        ],
    },
};


module.exports = nextConfig;
