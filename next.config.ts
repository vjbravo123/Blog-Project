import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "i.pravatar.cc",
      "ui-avatars.com",
      "joshi-blog-bucket.s3.ap-south-1.amazonaws.com", 
      "via.placeholder.com"
    ],
  },
};

export default nextConfig;
