/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,

  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false,

  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
