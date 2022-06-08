import { ProductName } from 'types/products'
import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'

/**
 * Generates the top-level website nav data for rendering in `Sidebar` as the
 * top-level of the mobile navigation experience.
 *
 * Depends on the `__config.dev_dot.beta_product_slugs` variable to be set in
 * the current environment config.
 */
export const generateTopLevelSidebarNavData = (productName: ProductName) => {
  const levelButtonProps = {
    levelDownButtonText: `${productName} Home`,
  }
  const showFilterInput = false
  const title = 'Main Menu'

  return {
    levelButtonProps,
    menuItems: generateTopLevelSubNavItems(),
    showFilterInput,
    title,
  }
}
