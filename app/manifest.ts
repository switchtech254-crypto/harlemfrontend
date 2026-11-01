import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Harlem Store — Sports & Fashion",
    short_name: "Harlem Store",
    description: "Jerseys, team uniforms, balls, sports shoes, jeans and sneakers.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f6f1",
    theme_color: "#431d41",
    icons: [{ src: "/favicon.png", sizes: "any", type: "image/png" }],
  };
}
