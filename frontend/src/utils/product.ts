import type {
  Product,
  ProductAttributeGroup,
  ProductImage,
  ProductVariant,
} from '@types/index'
import { resolveMediaUrl } from '@utils/media'

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/400x400?text=No+Image'

export function getProductCardImage(product: Product): string {
  const image =
    product.primary_image ||
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url

  return resolveMediaUrl(image) || PLACEHOLDER_IMAGE
}

export function getProductCardPrice(product: Product): {
  price: string
  currency: string
} {
  return {
    price: product.price || '0',
    currency: product.currency || 'ETB',
  }
}

export function getProductDetailUrl(product: Pick<Product, 'slug'>): string {
  return `/product/${product.slug}`
}

export function formatPrice(price: string, currency = 'ETB'): string {
  const amount = Number.parseFloat(price)
  if (Number.isNaN(amount)) return price

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

/**
 * Build attribute groups for the storefront UI.
 * Prefer in-stock selectable_attributes; map option labels back to IDs
 * via the product option pool / active variants.
 * Empty selectable_attributes => no dropdowns (one-size / no variants).
 */
export function getSelectableAttributeGroups(
  product: Product
): ProductAttributeGroup[] {
  if (product.has_selectable_variants === false) {
    return []
  }

  const selectable = product.selectable_attributes
  if (Array.isArray(selectable) && selectable.length === 0) {
    return []
  }

  if (!selectable || selectable.length === 0) {
    return product.attributes || []
  }

  const pool = product.attributes || []
  const variants = product.variants || []

  return selectable.map((group) => {
    const poolGroup = pool.find((item) => item.attribute === group.name)
    const values = group.options
      .map((option) => {
        const fromPool = poolGroup?.values.find((value) => value.value === option)
        if (fromPool) return fromPool

        for (const variant of variants) {
          const match = variant.attribute_values?.find(
            (attributeValue) =>
              attributeValue.attribute === group.name &&
              attributeValue.value === option
          )
          if (match) {
            return { id: match.id, value: match.value }
          }
        }

        return null
      })
      .filter((value): value is { id: number; value: string } => value !== null)

    return {
      attribute: group.name,
      values,
    }
  })
}

export function getDefaultAttributeSelections(
  groups: ProductAttributeGroup[]
): Record<string, number> {
  const selections: Record<string, number> = {}

  for (const group of groups) {
    const firstValue = group.values[0]
    if (firstValue) {
      selections[group.attribute] = firstValue.id
    }
  }

  return selections
}

export function getSelectedAttributeValueIds(
  groups: ProductAttributeGroup[],
  selections: Record<string, number>
): number[] {
  return groups
    .map((group) => selections[group.attribute])
    .filter((valueId): valueId is number => typeof valueId === 'number')
}

export function hasCompleteAttributeSelection(
  groups: ProductAttributeGroup[],
  selections: Record<string, number>
): boolean {
  if (!groups.length) return true
  return groups.every((group) => typeof selections[group.attribute] === 'number')
}

export function findVariantBySelections(
  product: Product,
  selections: Record<string, number>
): ProductVariant | undefined {
  const groups = getSelectableAttributeGroups(product)
  const valueIds = new Set(getSelectedAttributeValueIds(groups, selections))

  if (!valueIds.size) {
    return (
      product.variants?.find((variant) => variant.is_default) ||
      product.variants?.[0]
    )
  }

  return product.variants?.find((variant) => {
    const variantIds = new Set(
      (variant.attribute_values || []).map((item) => item.id)
    )
    if (variantIds.size !== valueIds.size) return false
    for (const valueId of valueIds) {
      if (!variantIds.has(valueId)) return false
    }
    return true
  })
}

export function getProductImages(product: Product): ProductImage[] {
  return [...(product.images || [])].sort(
    (left, right) => (left.display_order || 0) - (right.display_order || 0)
  )
}

export function getPrimaryImageUrl(product: Product): string {
  const images = getProductImages(product)
  const primaryImage = images.find((image) => image.is_primary) || images[0]
  return resolveMediaUrl(primaryImage?.image_url) || getProductCardImage(product)
}
