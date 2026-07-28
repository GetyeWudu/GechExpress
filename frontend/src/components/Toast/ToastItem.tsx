import { Toast, useToastStore } from '@hooks/useToast'
import { Check, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useEffect } from 'react'

interface ToastItemProps {
  toast: Toast
}

export default function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useToastStore((state) => state.removeToast)

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, removeToast])

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check size={20} />
      case 'error':
        return <AlertCircle size={20} />
      case 'warning':
        return <AlertTriangle size={20} />
      case 'info':
      default:
        return <Info size={20} />
    }
  }

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-green-50 border border-green-200',
          icon: 'text-green-600',
          text: 'text-green-800',
          button: 'text-green-600 hover:bg-green-100',
        }
      case 'error':
        return {
          bg: 'bg-red-50 border border-red-200',
          icon: 'text-red-600',
          text: 'text-red-800',
          button: 'text-red-600 hover:bg-red-100',
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 border border-yellow-200',
          icon: 'text-yellow-600',
          text: 'text-yellow-800',
          button: 'text-yellow-600 hover:bg-yellow-100',
        }
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 border border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-800',
          button: 'text-blue-600 hover:bg-blue-100',
        }
    }
  }

  const styles = getStyles()

  return (
    <div
      className={`${styles.bg} ${styles.text} rounded-lg p-4 shadow-lg max-w-sm pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5 ${styles.icon}`}>{getIcon()}</div>
        <div className="flex-1">
          <p className="font-medium text-sm">{toast.message}</p>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className={`flex-shrink-0 ${styles.button} p-1 rounded transition-colors`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
