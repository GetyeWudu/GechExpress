import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, ChevronDown } from 'lucide-react'
import { useProducts, useCategories } from '@api/queries'
import ProductCard from '@components/ProductCard'
import { motion } from 'framer-motion'

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sortBy, setSortBy] = useState('-created_at')

  const searchQuery = searchParams.get('q') || ''
  const selectedCategory = searchParams.get('category')
  const priceRange = searchParams.get('price')

  const { data: productsData, isLoading: productsLoading } = useProducts({
    search: searchQuery,
    category: selectedCategory || undefined,
    page_size: 48,
    ordering: sortBy,
  })
  const { data: categoriesData } = useCategories()

  const products = productsData?.results || []
  const categories = categoriesData || []

  const handleCategoryChange = (categorySlug: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (selectedCategory === categorySlug) {
      newParams.delete('category')
    } else {
      newParams.set('category', categorySlug)
    }
    setSearchParams(newParams)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

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

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-accent mb-2">
            {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {products.length} products found
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div
            className={`lg:col-span-1 ${
              sidebarOpen ? 'block' : 'hidden lg:block'
            } bg-white rounded-lg p-6 shadow-soft h-fit sticky top-20`}
          >
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h2 className="font-bold text-accent">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-accent"
              >
                ✕
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-accent mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategory === category.slug}
                      onChange={() => handleCategoryChange(category.slug)}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-accent hover:text-primary">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-accent mb-3">Price Range</h3>
              <div className="space-y-2">
                {['Under ETB 500', 'ETB 500 - ETB 1000', 'ETB 1000 - ETB 2000', 'Over ETB 2000'].map(
                  (range, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-sm text-accent">{range}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Condition Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-accent mb-3">Condition</h3>
              <div className="space-y-2">
                {['New', 'Like New', 'Good', 'Fair'].map((condition, idx) => (
                  <label key={idx} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-sm text-accent">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Shipping Filter */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-sm text-accent">Free Shipping</span>
              </label>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
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
                  className="text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="-created_at">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
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
                <p className="text-lg text-gray-600 mb-4">No products found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
