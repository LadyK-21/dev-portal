import PackerIoLayout from 'layouts/_proxied-dot-io/packer'
import DocsPage from '@hashicorp/react-docs-page'

import Badge from 'components/_proxied-dot-io/packer/badge'
import BadgesHeader from 'components/_proxied-dot-io/packer/badges-header'
import PluginBadge from 'components/_proxied-dot-io/packer/plugin-badge'
import DevAlert from 'components/_proxied-dot-io/packer/dev-alert'
import Checklist from 'components/_proxied-dot-io/packer/checklist'
import productData from 'data/packer.json'
// Imports below are only used server-side
import {
  generateStaticPaths,
  generateStaticProps,
} from 'components/_proxied-dot-io/packer/remote-plugin-docs/server'

//  Configure the docs path and remote plugin docs loading

// path relative to the `website` directory of the Packer GitHub repo
const remotePluginsFile = 'data/plugins-manifest.json'

const product = { name: productData.name, slug: productData.slug }
const basePath = 'plugins'
// path relative to the `website` directory of the Packer GitHub repo
const navDataFile = `data/${basePath}-nav-data.json`
const localContentDir = `../content/${basePath}`
const additionalComponents = { Badge, BadgesHeader, PluginBadge, Checklist }
const mainBranch = 'master'

function DocsView({ isDevMissingRemotePlugins, ...props }) {
  return (
    <>
      {isDevMissingRemotePlugins ? (
        <DevAlert>
          <strong className="g-type-label-strong">
            Note for local development
          </strong>
          <p>
            <span role="img" aria-label="Alert: ">
              🚨
            </span>{' '}
            <strong>This preview is missing plugin docs</strong> pulled from
            remote repos.
          </p>

          <p>
            <span role="img" aria-label="Fix: ">
              🛠
            </span>{' '}
            <strong>To preview docs pulled from plugin repos</strong>, please
            include a <code>GITHUB_TOKEN</code> in{' '}
            <code>website/.env.local</code>.
          </p>
        </DevAlert>
      ) : null}
      <DocsPage
        additionalComponents={additionalComponents}
        baseRoute={basePath}
        product={product}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        staticProps={props}
        showVersionSelect={false}
        algoliaConfig={productData.algoliaConfig}
      />
    </>
  )
}

export async function getStaticPaths() {
  let paths = await generateStaticPaths({
    navDataFile,
    remotePluginsFile,
  })
  paths = paths
    // remove index-ish pages from static paths
    .filter((p) => p.params.page.filter(Boolean).length > 0)
    // limit number of paths to max_static_paths
    .slice(0, __config.io_sites.max_static_paths ?? 0)
  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const props = await generateStaticProps({
    localContentDir,
    mainBranch,
    navDataFile,
    params,
    product,
    remotePluginsFile,
  })
  return { props, revalidate: __config.io_sites.revalidate }
}

DocsView.layout = PackerIoLayout
export default DocsView
