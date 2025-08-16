import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  padding = 'medium',
  shadow = 'medium',
  hover = false 
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-lg',
    large: 'shadow-xl'
  }

  return (
    <div className={`
      bg-white rounded-lg border border-gray-200
      ${paddingClasses[padding]}
      ${shadowClasses[shadow]}
      ${hover ? 'hover:shadow-xl transition-shadow duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

export default Card
