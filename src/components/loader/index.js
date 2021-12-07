import React from 'react'
import PropTypes from 'prop-types'
import LoadingOverlay from 'react-loading-overlay'
import styles from './styles.module.scss'

const Loader = ({ className, size, active = false }) => {
  return (
    <LoadingOverlay active={active} spinner />
  )
}

Loader.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['default', 'large']),
}

Loader.defaultProps = {
  className: '',
  size: 'default',
}

export default Loader
