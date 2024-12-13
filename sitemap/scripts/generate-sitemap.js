const fs = require("node:fs");

const fg = require("fast-glob");
// const prettier = require("prettier");

const APP_URL = process.env.WEBSITE_URL ?? "http://localhost:3000";

function addSitemapPage(sitemap) {
    const path = sitemap
        .replace(/^src\/pages/, "")   
        .replace(/\.(js|ts|tsx|jsx|mdx)$/, "") 
        .replace(/\/+/g, "/")        
        .replace(/^\//, "");

    const stats = fs.statSync(sitemap);
    const mtime = stats.mtime;

    console.log(mtime);

    return `<sitemap><loc>${`${APP_URL}/${path}`}</loc><lastmod>${mtime}</lastmod></sitemap>`;
}
  
async function generateGeneralSitemap() {
    const sitemaps = await fg(["src/pages/**/*.xml.ts"]);
    // const prettierConfig = await prettier.resolveConfig("../.prettierrc.js");
        
    console.log(sitemaps);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="${APP_URL}/sitemap.xsl"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps.map(addSitemapPage).filter(Boolean).join("\n")}</sitemapindex>`;

    //   const formatted = prettier.format(sitemap, {
    //     ...prettierConfig,
    //     parser: "html"
    // });

    fs.writeFileSync("public/sitemap.xml", sitemap);
}

generateGeneralSitemap().catch(console.error);