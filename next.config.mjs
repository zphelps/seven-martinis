/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            { source: '/', destination: '/menu', permanent: true },
        ]
    }
};

export default nextConfig;
