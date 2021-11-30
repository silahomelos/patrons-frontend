

import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import LoadingOverlay from 'react-loading-overlay'
import withRedux from 'next-redux-wrapper'
import { deserialize, serialize } from 'json-immutable/lib'
import PropTypes from 'prop-types'

import * as Sentry from '@sentry/browser'
import Modals from '@containers/modals/index'
import Footer from '@components/layouts/footer'
import HeaderTopLine from '@components/layouts/header-top-line'

import globalActions from '@actions/global.actions'
import { getIsInitialized, getChainId, getIsLoading } from '@selectors/global.selectors'

import api from '@services/api/api.service'
import ws from '@services/api/ws.service'
import { getDigitalaxGarmentNftV2GlobalStats } from '@services/api/apiService'
import { getEnabledNetworkByChainId } from '@services/network.service'

import getOrCreateStore from '../lib/with-redux-store'

import config from '../utils/config'

import { convertToEth } from '@helpers/price.helpers'

import 'animate.css'
import 'react-toastify/dist/ReactToastify.css'
import '../assets/scss/global.scss'


if (config.SENTRY_DSN) {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment: config.ENVIRONMENT,
  })
}

const InitWrapper = (props) => {
  const dispatch = useDispatch()
  const isInitialized = useSelector(getIsInitialized)
  const chainId = useSelector(getChainId)

  useEffect(() => {
    dispatch(globalActions.initApp())
    const fetchMonaPerEth = async () => {
      const { digitalaxGarmentNFTV2GlobalStats } = await getDigitalaxGarmentNftV2GlobalStats()
      dispatch(
        globalActions.setMonaPerEth(convertToEth(digitalaxGarmentNFTV2GlobalStats[0].monaPerEth)),
      )
    }

    fetchMonaPerEth()
  }, [])

  if (!isInitialized) {
    return null
  }

  return props.children
}

const NetworkWrapper = (props) => {
  const chainId = useSelector(getChainId)
  const network = getEnabledNetworkByChainId(chainId)

  return props.children
}

const LoadingWrapper = ({ children }) => {
  const isLoading = useSelector(getIsLoading)

  return (
    <LoadingOverlay active={isLoading} spinner>
      {children}
    </LoadingOverlay>
  )
}

const MyApp = ({ Component, pageProps, store, err }) => {
  const router = useRouter()

  if (err) {
    Sentry.captureException(err, {
      extra: {},
    })
    return <Component {...pageProps} />
  }

  useEffect(() => {
    api.setUrl(config.API_URLS['matic'])
    ws.setUrl(config.API_URLS['matic'].replace('http', 'ws'))
  }, [])

  return (
    <Provider store={store}>
      <Head>
        <title>Digitalax - Web3 Fashion Economy</title>
        <link rel="icon" type="image/png" href="/images/icons/favicon-digitalax.ico" />
        <script src="https://cdn.rawgit.com/progers/pathseg/master/pathseg.js"></script>
      </Head>
      <InitWrapper>
        <HeaderTopLine />
        <Modals />
        <NetworkWrapper>
          <LoadingWrapper>
            <Component {...pageProps} />
          </LoadingWrapper>
        </NetworkWrapper>
        <Footer />
      </InitWrapper>
      <ToastContainer />
    </Provider>
  )
}

MyApp.getInitialProps = async () => {}

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  pageProps: PropTypes.object,
  store: PropTypes.object,
  err: PropTypes.any,
  backError: PropTypes.object,
}

MyApp.defaultProps = {
  pageProps: {},
  store: {},
  err: undefined,
  backError: {},
}

const serializeWrapper = (value, cb) => {
  try {
    value = cb(value)
  } catch (e) {
    // eslint-disable no-empty
  }
  return value
}

export default withRedux((initialState) => getOrCreateStore(initialState), {
  serializeState: (state = {}) => serializeWrapper(state, serialize),
  deserializeState: (state = serialize({})) => serializeWrapper(state, deserialize),
})(MyApp)
