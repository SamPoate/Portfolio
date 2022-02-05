/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['m.media-amazon.com', 'image.tmdb.org']
    },
    trailingSlash: true
};

module.exports = nextConfig;
