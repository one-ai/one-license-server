/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [],
  proxy: {
    prefix: "/api",
    url: "http://localhost:3000",
  },
}
