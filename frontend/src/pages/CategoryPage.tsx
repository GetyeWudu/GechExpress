import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ChevronRight, Filter } from 'lucide-react'
import { useCategoryPath, useProducts } from '@api/queries'
import ProductCard from '@components/ProductCard'
import { resolveMediaUrl } from '@utils/media'
import { motion } from 'framer-motion'

const VISIBLE_SUBCATEGORIES = 7

export default function CategoryPage() {
  const { slug, parentSlug, childSlug, grandChildSlug } = useParams<{
    slug?: string
    parentSlug?: string
    childSlug?: string
    grandChildSlug?: string
  }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAllSubcategories, setShowAllSubcategories] = useState(false)
  const [draftMinPrice, setDraftMinPrice] = useState(searchParams.get('min_price') || '')
  const [draftMaxPrice, setDraftMaxPrice] = useState(searchParams.get('max_price') || '')

  const pathSegments = useMemo(
    () =>
      [slug, parentSlug, childSlug, grandChildSlug].filter(
        (value): value is string => Boolean(value)
      ),
    [slug, parentSlug, childSlug, grandChildSlug]
  )

  const currentPage = Math.max(1, Number(searchParams.get('page') || '1'))
  const sortBy = searchParams.get('sort') || '-created_at'
  const minPrice = searchParams.get('min_price') || undefined
  const maxPrice = searchParams.get('max_price') || undefined

  useEffect(() => {
    setDraftMinPrice(searchParams.get('min_price') || '')
    setDraftMaxPrice(searchParams.get('max_price') || '')
  }, [searchParams])

  const { data: categoryData, isLoading: categoryLoading } = useCategoryPath(pathSegments)
  const currentCategory = categoryData?.current
  const childCategories = categoryData?.children || []
  const breadcrumbs = categoryData?.breadcrumbs || []

  const hiddenSubcategoryCount = Math.max(0, childCategories.length - VISIBLE_SUBCATEGORIES)
  const visibleSubcategories = showAllSubcategories
    ? childCategories
    : childCategories.slice(0, VISIBLE_SUBCATEGORIES)

  useEffect(() => {
    setShowAllSubcategories(false)
  }, [currentCategory?.id])

  const { data: productsData, isLoading: productsLoading } = useProducts({
    category: currentCategory?.slug,
    ordering: sortBy,
    min_price: minPrice,
    max_price: maxPrice,
    page: currentPage,
    page_size: 24,
  }, Boolean(currentCategory?.slug))

  const products = productsData?.results || []
  const totalCount = productsData?.count || 0
  const totalPages = Math.max(1, Math.ceil(totalCount / 24))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const updateSearchParam = (key: string, value?: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (!value) {
      nextParams.delete(key)
    } else {
      nextParams.set(key, value)
    }
    if (key !== 'page') {
      nextParams.set('page', '1')
    }
    setSearchParams(nextParams)
  }

  const handleSortChange = (value: string) => {
    updateSearchParam('sort', value)
  }

  const handleApplyPrice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nextParams = new URLSearchParams(searchParams)
    if (draftMinPrice) {
      nextParams.set('min_price', draftMinPrice)
    } else {
      nextParams.delete('min_price')
    }
    if (draftMaxPrice) {
      nextParams.set('max_price', draftMaxPrice)
    } else {
      nextParams.delete('max_price')
    }
    nextParams.set('page', '1')
    setSearchParams(nextParams)
  }

  const clearPriceFilters = () => {
    setDraftMinPrice('')
    setDraftMaxPrice('')
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('min_price')
    nextParams.delete('max_price')
    nextParams.set('page', '1')
    setSearchParams(nextParams)
  }

  const buildCategoryPath = (childSlugValue: string) =>
    `/category/${[...breadcrumbs.map((item) => item.slug), childSlugValue].join('/')}`

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-light">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-light">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-accent mb-3">Category not found</h1>
          <p className="text-gray-600 mb-6">
            This category path does not match the active category tree.
          </p>
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-soft border border-gray-100">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center gap-2">
                <ChevronRight size={14} />
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? 'font-medium text-gray-900'
                      : 'text-gray-500'
                  }
                >
                  {crumb.name}
                </span>
              </div>
            ))}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {currentCategory.name}
          </h1>
          <p className="max-w-3xl text-gray-600 text-base leading-7">
            {currentCategory.description ||
              `Browse ${currentCategory.name} on GechExpress with curated picks, new arrivals, and marketplace finds.`}
          </p>

          {childCategories.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 mb-5">
                Explore Subcategories
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
                {visibleSubcategories.map((child) => {
                  const imageUrl = resolveMediaUrl(child.image)

                  return (
                    <Link
                      key={child.id}
                      to={buildCategoryPath(child.slug)}
                      className="group"
                    >
                      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md group-focus:outline-none group-focus:ring-2 group-focus:ring-orange-500 group-focus:ring-offset-2">
                        <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={child.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4 text-center text-sm font-semibold text-orange-700">
                              {child.name}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="mt-3 text-center text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                        {child.name}
                      </p>
                    </Link>
                  )
                })}
              </div>

              {hiddenSubcategoryCount > 0 && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllSubcategories((prev) => !prev)}
                    className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-800 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                  >
                    {showAllSubcategories
                      ? 'Show less'
                      : `Show more (${hiddenSubcategoryCount})`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div
            className={`lg:col-span-1 ${
              sidebarOpen ? 'block' : 'hidden lg:block'
            } bg-white rounded-2xl p-6 shadow-soft h-fit sticky top-24 border border-gray-100`}
          >
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h2 className="font-bold text-accent">Filters</h2>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="text-accent"
              >
                ✕
              </button>
            </div>

            {childCategories.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-accent mb-3">Subcategories</h3>
                <div className="space-y-2">
                  {childCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={buildCategoryPath(cat.slug)}
                      className={`text-sm block text-left transition-colors ${
                        cat.slug === currentCategory.slug
                          ? 'text-orange-600 font-medium'
                          : 'text-accent hover:text-primary'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleApplyPrice} className="space-y-4">
              <div>
                <h3 className="font-semibold text-accent mb-3">Price Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={draftMinPrice}
                    onChange={(e) => setDraftMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={draftMaxPrice}
                    onChange={(e) => setDraftMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={clearPriceFilters}
                  className="rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft border border-gray-100">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 text-accent font-medium"
              >
                <Filter size={20} />
                Show Filters
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <label htmlFor="sort" className="text-sm text-gray-600">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-sm border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="-created_at">Newest</option>
                  <option value="created_at">Oldest</option>
                  <option value="name">Name: A to Z</option>
                  <option value="-name">Name: Z to A</option>
                </select>
              </div>
            </div>

            {productsLoading ? (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              </div>
            ) : products.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {products.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 mb-4">No products in this category</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => updateSearchParam('page', String(currentPage - 1))}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                  .map((pageNumber) => (
                    <button
                      type="button"
                      key={pageNumber}
                      onClick={() => updateSearchParam('page', String(pageNumber))}
                      className={`h-10 min-w-10 rounded-full px-3 text-sm font-medium transition-colors ${
                        pageNumber === currentPage
                          ? 'bg-primary text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => updateSearchParam('page', String(currentPage + 1))}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
