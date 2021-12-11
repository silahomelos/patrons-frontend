
import React from 'react'

const SocialIcon = props => {
  const { name, width, height } = props
  const PNGs = ['linkedin', 'medium', 'telegram', 'gitbook', 'mirror', 'website', 'digitalax']
  return (
    <img
      src={`/images/social-icons/${name}.${PNGs.find(item => item == name) ? 'png' : 'svg'}`}
      alt={`${name}-icon`}
      style={{
        width: width || '34px',
        height: height || '34px',
        objectFit: 'fill'
      }}
  />
  )
}
  
export default SocialIcon