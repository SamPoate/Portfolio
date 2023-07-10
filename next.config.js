/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    trailingSlash: true,
    images: {
        domains: ['m.media-amazon.com', 'image.tmdb.org']
    }
};

module.exports = nextConfig;
