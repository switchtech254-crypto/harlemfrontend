import type { NextConfig } from "next";

// Product/banner images are uploaded to Django and served from  <API origin>/media/...
// next/image only loads remote images from hosts listed here. The host is derived from
// NEXT_PUBLIC_API_URL, so switching to your production API needs no code change.
const api = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api");
const isLocalApi = ["localhost", "127.0.0.1", "::1"].includes(api.hostname);

// Production uploads live on Cloudinary. Set your cloud name (the part after @ in
// CLOUDINARY_URL) so ONLY your images may pass through Next's optimiser. Never allow all of
// res.cloudinary.com, or anyone could use your optimiser for their images.
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// Optional: any other CDN/bucket host, e.g. NEXT_PUBLIC_MEDIA_HOST=cdn.harlemstore.co.ke
const mediaHost = process.env.NEXT_PUBLIC_MEDIA_HOST;

const nextConfig: NextConfig = {
  // MERGE this with your existing config; keep whatever you already have (e.g. cacheComponents).
  cacheComponents: true,

  images: {
    remotePatterns: [
      {
        protocol: api.protocol.replace(":", "") as "http" | "https",
        hostname: api.hostname,
        ...(api.port ? { port: api.port } : {}),
        pathname: "/media/**",
      },
      ...(cloudName
        ? [{ protocol: "https" as const, hostname: "res.cloudinary.com", pathname: `/${cloudName}/**` }]
        : []),
      ...(mediaHost
        ? [{ protocol: "https" as const, hostname: mediaHost, pathname: "/**" }]
        : []),
    ],
    // Next 16 refuses to optimise images fetched from local/private IPs. Only allowed here
    // when the API itself is on localhost (development), never for a public API host.
    dangerouslyAllowLocalIP: isLocalApi,
    formats: ["image/avif", "image/webp"],
    // Uploaded files rarely change in place; let optimised copies live for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;