import React from 'react'

const Flex = ({onclick, className, children}) => {
  return (
    <div onClick={onclick} className={className}>{children}</div>
  )
}

export default Flex