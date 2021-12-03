import config from '@utils/config'

export const getGDNTokenAddress = () => {
  return config.GDN_TOKEN_ADDRESSES['matic']
}