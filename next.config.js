const fs = require('fs')
const path = require('path')
const withHashicorp = require('@hashicorp/platform-nextjs-plugin')
const withSwingset = require('swingset')
const { redirectsConfig } = require('./build-libs/redirects')
const rewritesConfig = require('./build-libs/rewrites')
const HashiConfigPlugin = require('./config/plugin')

// temporary: set all paths as noindex, until we're serving from this project
// Update the excluded domains to ensure we are indexing content as the io sites get migrated
const temporary_hideDocsPaths = {
  source: '/:path*',
  headers: [
    {
      key: 'X-Robots-Tag',
      value: 'noindex',
    },
  ],
  has: [
    {
      type: 'host',
      value:
        '(^(?!.*(boundaryproject|consul|nomadproject|packer|vagrantup|vaultproject|waypointproject|docs\\.hashicorp)).*$)',
    },
  ],
}

module.exports = withSwingset({
  componentsRoot: 'src/components/*',
  docsRoot: 'src/swingset-docs/*',
})(
  withHashicorp({
    nextOptimizedImages: true,
    css: false,
    transpileModules: [
      '@hashicorp/flight-icons',
      /**
       * TODO: once Sentinel has been migrated into the dev-portal repository,
       * we should consider localizing the sentinel-embedded component. Should
       * first confirm with Cam Stitt that this component is not being used
       * elsewhere.
       */
      '@hashicorp/sentinel-embedded',
      'swingset',
      'unist-util-visit',
    ],
  })({
    webpack(config) {
      config.plugins.push(HashiConfigPlugin())
      return config
    },
    async headers() {
      return [temporary_hideDocsPaths]
    },
    async redirects() {
      const { simpleRedirects, globRedirects } = await redirectsConfig()
      await fs.promises.writeFile(
        path.join('src', 'data', '_redirects.generated.json'),
        JSON.stringify(simpleRedirects, null, 2),
        'utf-8'
      )
      return globRedirects
    },
    async rewrites() {
      const rewrites = await rewritesConfig()

      if (process.env.DEBUG_REWRITES) {
        await fs.promises.writeFile(
          path.join('src', 'data', '_rewrites.generated.json'),
          JSON.stringify(rewrites, null, 2),
          'utf-8'
        )
      }

      return rewrites
    },
    env: {
      AXE_ENABLED: process.env.AXE_ENABLED || false,
      BUGSNAG_CLIENT_KEY: '06718db5e1d75829801baa0b4ca2fb7b',
      BUGSNAG_SERVER_KEY: 'b32b4487b5dc72b32f51c8fe33641a43',
      DEV_IO: process.env.DEV_IO,
      ENABLE_VERSIONED_DOCS: process.env.ENABLE_VERSIONED_DOCS || false,
      HASHI_ENV: process.env.HASHI_ENV || 'development',
      IS_CONTENT_PREVIEW: process.env.IS_CONTENT_PREVIEW,
      // TODO: determine if DevDot needs this or not
      SEGMENT_WRITE_KEY: process.env.SEGMENT_WRITE_KEY,
    },
    svgo: {
      plugins: [
        {
          removeViewBox: false,
          collapseGroups: false,
        },
      ],
    },
    images: {
      formats: ['image/avif', 'image/webp'],
      domains: [
        'www.datocms-assets.com',
        'mktg-content-api-hashicorp.vercel.app',
      ],
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    experimental: {
      images: {
        layoutRaw: true,
      },
    },
  })
)
