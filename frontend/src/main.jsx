// src/main.jsx
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'
// import { BrowserRouter } from 'react-router-dom'
// // import { AuthProvider } from './contexts/AuthContext.jsx'/
// import ErrorBoundary from './components/common/ErrorBoundary.jsx'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <ErrorBoundary>
//         <App />
//       </ErrorBoundary>
//     </BrowserRouter>
//   </React.StrictMode>,
// )

// // frontend/src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import  './index.css'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'

// Error boundary for the entire app
// class AppErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('App Error:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//           <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">
//               Application Error
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Something went wrong. Please refresh the page to try again.
//             </p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//             >
//               Refresh Page
//             </button>
//             {process.env.NODE_ENV === 'development' && (
//               <details className="mt-4 text-left">
//                 <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
//                 <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
//                   {this.state.error?.toString()}
//                 </pre>
//               </details>
//             )}
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// Initialize the React app
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)