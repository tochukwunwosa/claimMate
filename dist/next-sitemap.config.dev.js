"use strict";

/** @type {import('next-sitemap').IConfig} */
var config = {
  siteUrl: "https://claimmate.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ["/admin/*", "/private/*"]
};
module.exports = config; // This config file is used to generate a sitemap and robots.txt file for the Next.js application.
// The `siteUrl` is the base URL of the website.
// The `generateRobotsTxt` option indicates whether to generate a robots.txt file.
// The `sitemapSize` option specifies the maximum number of URLs per sitemap file.
// The `exclude` option is an array of paths to exclude from the sitemap.