import React from 'react'

const ImageComp = ({className, imageSrc, alt}) => {
  return (
    <picture>
        <img className={className} src={imageSrc} alt={alt} />
    </picture>
  )
}

export default ImageComp