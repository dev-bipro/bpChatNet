import React from 'react'

const Pragraph = ({className, title, children}) => {
  return (
    <p className={className}>{title}{children}</p>
  )
}

export default Pragraph