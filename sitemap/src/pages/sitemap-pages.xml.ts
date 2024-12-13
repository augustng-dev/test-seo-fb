import fs from "node:fs";

import fg from "fast-glob";

const APP_URL = process.env.WEBSITE_URL ?? "http://localhost:3000";
 
function addPage(page: any) {
    const path = page
        .replace(/^src\/pages/, "")   
        .replace(/\.(js|ts|tsx|jsx|mdx)$/, "") 
        .replace(/\/+/g, "/")        
        .replace(/^\//, "");

    const route = path === "index" ? "" : path.replace("/index", "");

    const stats = fs.statSync(page);
    const mtime = stats.mtime;

    return `<url><loc>${APP_URL}/${route}</loc><lastmod>${mtime}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
}

export async function getServerSideProps({ res }: any) {
    const pages = await fg([
                "src/pages/**/*{.js,.ts,.tsx,.jsx,.mdx}",
                "src/content/**/*.mdx",
                "!src/pages/**/_*{.js,.ts,.tsx,.jsx,.mdx}",
                "!src/pages/*.xml{.js,.ts,.tsx,.jsx,.mdx}",
                "!src/pages/blog",
                "!src/pages/api",
            ]);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="${APP_URL}/sitemap.xsl"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${pages.map(addPage).filter(Boolean).join("\n")}</urlset>`;
   
    res.setHeader("Content-Type", "text/xml");
    // Send the XML to the browser
    res.write(sitemap);
    res.end();
   
    return {
      props: {},
    };
}

export default function SiteMap() {}