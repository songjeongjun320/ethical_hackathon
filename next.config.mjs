/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY, // OpenAI API 키 노출
  },
};

export default nextConfig;
