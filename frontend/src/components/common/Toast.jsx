import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// const Toast = ({ toast, onRemove }) => {
//   const icons = {
//     success: CheckCircle,
//     error: XCircle,
//     warning: AlertCircle,
//     info: Info
//   };

//   const colors = {
//     success: 'bg-green-50 border-green-200 text-green-800',
//     error: 'bg-red-50 border-red-200 text-red-800',
//     warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
//     info: 'bg-blue-50 border-blue-200 text-blue-800'
//   };

//   const iconColors = {
//     success: 'text-green-500',
//     error: 'text-red-500',
//     warning: 'text-yellow-500',
//     info: 'text-blue-500'
//   };

//   const Icon = icons[toast.type];

//   useEffect(() => {
//     if (toast.duration !== 0) {
//       const timer = setTimeout(() => {
//         onRemove(toast.id);
//       }, toast.duration || 5000);

//       return () => clearTimeout(timer);
//     }
//   }, [toast, onRemove]);

//   return (
//     <div className={`flex items-start p-4 border rounded-lg shadow-sm ${colors[toast.type]} transition-all duration-300 ease-in-out`}>
//       <Icon className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${iconColors[toast.type]}`} />
//       <div className="flex-1 min-w-0">
//         {toast.title && (
//           <h4 className="font-medium text-sm mb-1">{toast.title}</h4>
//         )}
//         <p className="text-sm opacity-90">{toast.message}</p>
//       </div>
//       <button
//         onClick={() => onRemove(toast.id)}
//         className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
//       >
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

const Toast = ({ toast, onRemove }) => {
  if (!toast) return null; // ✅ Prevents crashing if toast is undefined

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  const Icon = icons[toast.type] || Info;
  const colorClasses = colors[toast.type] || colors.info;
  const iconClass = iconColors[toast.type] || iconColors.info;

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  return (
    <div
      className={`flex items-start p-4 border rounded-lg shadow-sm ${colorClasses} transition-all duration-300 ease-in-out`}
    >
      <Icon className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${iconClass}`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="font-medium text-sm mb-1">{toast.title}</h4>
        )}
        <p className="text-sm opacity-90">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};


export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [newToast, ...prev]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toast = {
    success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
    error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
    warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addToast({ type: 'info', message, ...options })
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80 max-w-sm">
        {toasts.map(toastItem => (
          <Toast
            key={toastItem.id}
            toast={toastItem}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};


export default Toast;

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// const ToastContext = createContext();

// export const useToast = () => {
//   const context = useContext(ToastContext);
//   if (!context) {
//     throw new Error('useToast must be used within a ToastProvider');
//   }
//   return context;
// };

// const Toast = ({ toast, onRemove }) => {
//   const icons = {
//     success: CheckCircle,
//     error: XCircle,
//     warning: AlertCircle,
//     info: Info
//   };

//   const colors = {
//     success: 'bg-green-50 border-green-200 text-green-800',
//     error: 'bg-red-50 border-red-200 text-red-800',
//     warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
//     info: 'bg-blue-50 border-blue-200 text-blue-800'
//   };

//   const iconColors = {
//     success: 'text-green-500',
//     error: 'text-red-500',
//     warning: 'text-yellow-500',
//     info: 'text-blue-500'
//   };

//   const Icon = icons[toast.type];

//   useEffect(() => {
//     if (toast.duration !== 0) {
//       const timer = setTimeout(() => {
//         onRemove(toast.id);
//       }, toast.duration || 5000);

//       return () => clearTimeout(timer);
//     }
//   }, [toast, onRemove]);

//   return (
//     <div className={`flex items-start p-4 border rounded-lg shadow-lg ${colors[toast.type]} transition-all duration-300 ease-in-out animate-slide-in`}>
//       <Icon className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${iconColors[toast.type]}`} />
//       <div className="flex-1 min-w-0">
//         {toast.title && (
//           <h4 className="font-medium text-sm mb-1">{toast.title}</h4>
//         )}
//         <p className="text-sm opacity-90">{toast.message}</p>
//       </div>
//       <button
//         onClick={() => onRemove(toast.id)}
//         className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
//         aria-label="Close notification"
//       >
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// export const ToastProvider = ({ children }) => {
//   const [toasts, setToasts] = useState([]);

//   const addToast = (toast) => {
//     const id = Math.random().toString(36).substr(2, 9);
//     const newToast = {
//       id,
//       type: 'info',
//       duration: 5000,
//       ...toast
//     };
    
//     setToasts(prev => [newToast, ...prev.slice(0, 4)]); // Keep max 5 toasts
//     return id;
//   };

//   const removeToast = (id) => {
//     setToasts(prev => prev.filter(toast => toast.id !== id));
//   };

//   const removeAllToasts = () => {
//     setToasts([]);
//   };

//   const toast = {
//     success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
//     error: (message, options = {}) => addToast({ type: 'error', message, duration: 7000, ...options }),
//     warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
//     info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
//     promise: async (promise, messages) => {
//       const loadingToast = addToast({ 
//         type: 'info', 
//         message: messages.loading || 'Loading...', 
//         duration: 0 
//       });

//       try {
//         const result = await promise;
//         removeToast(loadingToast);
//         addToast({ 
//           type: 'success', 
//           message: messages.success || 'Success!' 
//         });
//         return result;
//       } catch (error) {
//         removeToast(loadingToast);
//         addToast({ 
//           type: 'error', 
//           message: messages.error || 'Something went wrong' 
//         });
//         throw error;
//       }
//     }
//   };

//   return (
//     <ToastContext.Provider value={{ toast, addToast, removeToast, removeAllToasts }}>
//       {children}
      
//       {/* Toast Container */}
//       <div className="fixed top-4 right-4 z-50 space-y-2 w-80 max-w-sm pointer-events-none">
//         {toasts.map(toastItem => (
//           <div key={toastItem.id} className="pointer-events-auto">
//             <Toast
//               toast={toastItem}
//               onRemove={removeToast}
//             />
//           </div>
//         ))}
//       </div>
//     </ToastContext.Provider>
//   );
// };
// export default Toast