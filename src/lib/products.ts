import { Product, ProductName, ProductSlug } from 'types/products'

/**
 * A map of product slugs to their proper noun names.
 *
 * 🚨 NOTE: the order of this object matters for the Home page.
 */
const productSlugsToNames: { [slug in ProductSlug]: ProductName } = {
  sentinel: 'Sentinel',
  hcp: 'HashiCorp Cloud Platform',
  terraform: 'Terraform',
  packer: 'Packer',
  consul: 'Consul',
  vault: 'Vault',
  boundary: 'Boundary',
  nomad: 'Nomad',
  waypoint: 'Waypoint',
  vagrant: 'Vagrant',
}

/**
 * Type guard to determine if a string is a ProductSlug
 *
 * TODO: should we define ProductSlug as an enum,
 * so that we can use its values directly here?
 */
function isProductSlug(string: string): string is ProductSlug {
  return Object.keys(productSlugsToNames).includes(string as ProductSlug)
}

/**
 * An array of all Product slugs, generated from `productSlugsToNames`.
 */
const productSlugs = Object.keys(productSlugsToNames) as ProductSlug[]

/**
 * Generates an array of Product objects from `productSlugs`.
 */
const products: Product[] = productSlugs.map((slug: ProductSlug) => {
  const name = productSlugsToNames[slug]
  return { name, slug }
})

export { isProductSlug, products, productSlugs, productSlugsToNames }
