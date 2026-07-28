import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles, TrendingUp, Star } from 'lucide-react'
import { useProducts, useCategories } from '@api/queries'
import ProductCard from '@components/ProductCard'
import { motion } from 'framer-motion'

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [newArrivals, setNewArrivals] = useState<any[]>([])

  const { data: productsData, isLoading: productsLoading } = useProducts({
    page_size: 30,
    ordering: '-created_at',
  })
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()

  const products = productsData?.results || []
  const categories = categoriesData || []

  useEffect(() => {
    if (products.length > 0) {
      // Simulate featured, trending, and new by dividing products
      setFeatured(products.slice(0, 8))
      setTrending(products.slice(8, 16))
      setNewArrivals(products.slice(0, 12))
    }
  }, [products])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner - Clean & Minimal */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-orange-50 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={20} className="text-orange-600" />
              <span className="text-sm font-semibold text-orange-600 tracking-wide">WELCOME TO GECHEXPRESS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Discover Unique, Handmade & Vintage Products
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Browse millions of one-of-a-kind items from independent sellers worldwide. Find exactly what you're looking for.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-orange-700 transition shadow-sm"
            >
              Start Browsing
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New & Featured Section */}
      {!productsLoading && newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={28} className="text-orange-600" />
                <h2 className="text-3xl font-bold text-gray-900">New & Featured</h2>
              </div>
              <Link
                to="/search?sort=-created_at"
                className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                See all <ChevronRight size={16} />
              </Link>
            </div>
            <p className="text-gray-600">Just added to our marketplace. Fresh finds updated daily.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {newArrivals.slice(0, 8).map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Categories Showcase */}
      {!categoriesLoading && categories.length > 0 && (
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 mb-8"
            >
              Shop by Category
            </motion.h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {categories.slice(0, 10).map((category, index) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <Link
                    to={`/category/${category.slug || category.id}`}
                    className="group bg-white rounded-lg p-6 text-center hover:shadow-md transition-all duration-300 border border-gray-100"
                  >
                    {/* Category Image if available */}
                    {category.image && (
                      <div className="mb-4 h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {!category.image && (
                      <div className="mb-4 h-24 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center group-hover:from-orange-200 transition">
                        <span className="text-3xl">📦</span>
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition text-sm">
                      {category.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Trending Products Section */}
      {!productsLoading && trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={28} className="text-orange-600" />
                <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
              </div>
              <Link
                to="/search?sort=-updated_at"
                className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                See all <ChevronRight size={16} />
              </Link>
            </div>
            <p className="text-gray-600">Most loved and watched products right now.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {trending.slice(0, 10).map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Editorial Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <Star size={32} className="mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Shop on GechExpress?</h2>
            <p className="text-lg opacity-95 mb-8 max-w-2xl mx-auto">
              Direct from makers. Every purchase supports independent creators and small businesses around the world.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
              <div>
                <div className="text-3xl font-bold mb-3">🎨</div>
                <h3 className="font-semibold text-lg mb-2">Unique Products</h3>
                <p className="opacity-90 text-sm">One-of-a-kind items you won't find anywhere else</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-3">🤝</div>
                <h3 className="font-semibold text-lg mb-2">Support Creators</h3>
                <p className="opacity-90 text-sm">Direct support to independent sellers and makers</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-3">⭐</div>
                <h3 className="font-semibold text-lg mb-2">Quality Guaranteed</h3>
                <p className="opacity-90 text-sm">Trusted seller ratings and buyer protection</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* More to Explore */}
      {products.length > 20 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900">More to Explore</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {products.slice(16, 26).map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* CTA Footer Section */}
      <section className="bg-gray-50 py-16 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to find something special?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse our full marketplace and discover products from creators everywhere.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-orange-700 transition shadow-sm"
            >
              Explore All Products
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
