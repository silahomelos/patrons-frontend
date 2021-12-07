import React, { memo } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import styles from './styles.module.scss'
import LoadingOverlay from 'react-loading-overlay'

const Button = ({ className, background, onClick, children, isDisabled, loading }) => (
  <button
    className={cn(
      styles.button,
      {
        [styles.transparent]: background === 'transparent',
        [styles.black]: background === 'black',
        [styles.pink]: background === 'pink',
        [styles.disabled]: isDisabled || loading,

      },
      className,
    )}
    onClick={onClick}
    disabled={isDisabled || loading}
  >
    {
      loading ? 'Loading...'
      : children
    }
  </button>
)

Button.propTypes = {
  className: PropTypes.string,
  background: PropTypes.oneOf(['transparent', 'black', 'pink']),
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.any,
}

Button.defaultProps = {
  className: '',
  background: 'transparent',
  onClick: () => {},
  isDisabled: false,
  loading: false,
  children: null,
}

export default memo(Button)
