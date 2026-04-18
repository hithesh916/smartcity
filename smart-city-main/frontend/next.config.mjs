/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/map%5Cn-',
                destination: '/map',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
