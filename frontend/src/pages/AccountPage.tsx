import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, User, ShoppingBag, Settings } from 'lucide-react'
import { useAuthStore } from '@stores/auth'
import { apiClient } from '@api/client'

export default function AccountPage() {
  const { user, clearAuth } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile')

  const handleLogout = () => {
    apiClient.logout()
    clearAuth()
    window.location.href = '/'
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Please sign in to view your account</p>
          <Link
            to="/auth/login"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-soft p-6 sticky top-24">
            <div className="text-center mb-6 pb-6 border-b border-border">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl">
                {user.email?.[0].toUpperCase()}
              </div>
              <h2 className="font-bold text-accent">{user.email}</h2>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition ${
                  activeTab === 'profile'
                    ? 'bg-primary/10 text-primary'
                    : 'text-accent hover:bg-secondary'
                }`}
              >
                <User size={20} />
                <span>Profile</span>
              </button>

              <Link
                to="/orders"
                className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-accent hover:bg-secondary transition"
              >
                <ShoppingBag size={20} />
                <span>Orders</span>
              </Link>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition ${
                  activeTab === 'settings'
                    ? 'bg-primary/10 text-primary'
                    : 'text-accent hover:bg-secondary'
                }`}
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h2 className="text-2xl font-bold text-accent mb-6">Profile Information</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-accent mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2 border border-border rounded-lg bg-secondary cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-accent mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user.role || 'Customer'}
                      disabled
                      className="w-full px-4 py-2 border border-border rounded-lg bg-secondary cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-accent mb-2">
                    Email Verified
                  </label>
                  <div className="flex items-center gap-2">
                    {user.email_verified ? (
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        Pending Verification
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <button
                    type="button"
                    className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
                    disabled
                  >
                    Update Profile
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Contact support to update your profile information
                  </p>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h2 className="text-2xl font-bold text-accent mb-6">Account Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-accent mb-3">Password</h3>
                  <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium">
                    Change Password
                  </button>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold text-accent mb-3">Email Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-accent">
                        Receive order updates
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-accent">
                        Receive promotional emails
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-accent">
                        Receive newsletter
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold text-accent mb-3">Danger Zone</h3>
                  <button className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
