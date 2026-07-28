import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavCategories } from '@api/queries'

export function DesktopNavigation() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)
  const { data: parentCategories = [], isLoading } = useNavCategories()

  if (isLoading || parentCategories.length === 0) {
    return null
  }

  return (
    <nav className="hidden md:block bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1">
          {parentCategories.map((category) => {
            const hasChildren = category.subcategories.length > 0

            return (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Top-level: active parent only — link to filtered product list */}
                <Link
                  to={`/category/${category.slug}`}
                  className="px-4 py-3 flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
                >
                  {category.name}
                  {hasChildren && (
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform ${
                        hoveredCategory === category.id
                          ? 'text-orange-600 rotate-180'
                          : ''
                      }`}
                    />
                  )}
                </Link>

                {/* Dropdown: active children of this parent only */}
                {hoveredCategory === category.id && hasChildren && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-0 w-56 bg-white rounded-md shadow-lg border border-gray-100 z-50"
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="py-2">
                      <Link
                        to={`/category/${category.slug}`}
                        className="block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-100"
                      >
                        All {category.name}
                      </Link>
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/category/${category.slug}/${sub.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export function MobileNavigation() {
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set())
  const { data: parentCategories = [], isLoading } = useNavCategories()

  const toggleCategory = (id: number) => {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (isLoading || parentCategories.length === 0) {
    return null
  }

  return (
    <nav className="md:hidden bg-white border-b border-gray-200">
      <div className="space-y-1">
        {parentCategories.map((category) => {
          const hasChildren = category.subcategories.length > 0
          const isOpen = openCategories.has(category.id)

          return (
            <div key={category.id}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>{category.name}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <Link
                  to={`/category/${category.slug}`}
                  className="block w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {category.name}
                </Link>
              )}

              {isOpen && hasChildren && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Link
                    to={`/category/${category.slug}`}
                    className="block px-8 py-2 text-sm font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    All {category.name}
                  </Link>
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/category/${category.slug}/${sub.slug}`}
                      className="block px-8 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
