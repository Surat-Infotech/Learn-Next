import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    // TODO: Remove this dummy domains
    domains: [
      'www.loosegrowndiamond.com',
      'cdn.loosegrowndiamond.com',
      'tools.google.com',
      'e-com-image.s3.eu-north-1.amazonaws.com',
      'rrp-diamond.s3.us-east-1.amazonaws.com'
    ],
  },
};

export default nextConfig;
