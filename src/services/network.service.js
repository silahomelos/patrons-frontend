import { AVAILABLE_NETWORKS } from '@constants/networks.constants'
import config from '@utils/config'

export const getEnabledNetworks = () =>
  AVAILABLE_NETWORKS.filter(network => config.NETWORKS.includes(network.alias))

export const getEnabledNetworkByChainId = (chainId) =>
  getEnabledNetworks().find(network => Number(network.hex) === Number(chainId))
export const requestSwitchNetwork = () => {
  window.ethereum
    .request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x89',
          chainName: 'Matic Main Network',
          rpcUrls: ['https://matic-mainnet.chainstacklabs.com'],
          blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com']
        }
      ]
    })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getDltaGraphAPIURL = () => {
  return config.API_URLS['dlta']
}

export const getAPIUrlByChainId = (chainId) => {
  if (chainId === 0x1) {
    return config.API_URLS['mainnet']
  }
  return config.API_URLS['matic']
}

export const getExplorerUrlByChainId = (chainId) => {
  const network = getEnabledNetworkByChainId(chainId)
  return config.EXPLORER_URLS[network?.alias]
}

export const getDefaultNetworkChainId = () => {
  const network = AVAILABLE_NETWORKS.find((net) => net.alias === config.DEFAULT_NETWORK)

  if (!network) {
    throw new Error('Invalid DEFAULT_NETWORK: getDefaultNetworkChainId')
  }

  return network.hex
}

export const getWSUrlByChainId = (chainId) => {
  const url = getAPIUrlByChainId(chainId)

  if (!url) {
    throw new Error('Invalid chainId: getWSUrlByChainId')
  }

  return url.replace('http', 'ws')
}

const ERC20TokenAddresses = {
  mona: config.MONA_TOKEN_ADDRESSES,
  usdt: config.USDT_ADDRESS,
  weth: config.WETH_ADDRESS
}

export const getERC20ContractAddressByChainId = (tokenId, chainId) => {
  const network = getEnabledNetworkByChainId(chainId)

  if (!Object.keys(ERC20TokenAddresses).find(key => key == tokenId)) return null
  return ERC20TokenAddresses[tokenId][network?.alias].toLowerCase()
}

export const getMonaContractAddressByChainId = (chainId) => {
  const network = getEnabledNetworkByChainId(chainId)

  return config.MONA_TOKEN_ADDRESSES[network?.alias]
}

export const getUSDTAddressByChainId = (chainId) => {
  const network = getEnabledNetworkByChainId(chainId)

  return config.USDT_ADDRESS[network?.alias]
}

export const getWEthAddressByChainId = (chainId) => {
  const network = getEnabledNetworkByChainId(chainId)

  return config.WETH_ADDRESS[network?.alias]
}

export const getPatronMarketplaceAddressByChainId = (chainId) => {
  const network = getEnabledNetworkByChainId(chainId)
  console.log('config.PATRONS_MARKETPLACE_ADDRESS: ', config.PATRONS_MARKETPLACE_ADDRESS[network?.alias])
  return config.PATRONS_MARKETPLACE_ADDRESS[network?.alias]
}

export const getDTXAddressByChainId = (chainId) => {
  const network = getEnabledNetworkByChainId(chainId)

  return config.DTX_ADDRESSES[network?.alias]
}

export const getDTXV1AddressByChainId = (chainId) => {
  const network = getEnabledNetworkByChainId(chainId)

  return config.DTXV1_ADDRESSES[network?.alias]
}

export const getDigiMaterialV2AddressByChainId = (chainId) => {
  const network = getEnabledNetworkByChainId(chainId)

  return config.DIGI_MATERIALS_V2[network?.alias]
}

export const getUpgraderAddressByChainId = (chainId) => {
  const network = getEnabledNetworkByChainId(chainId)

  return config.UPGRADER_ADDRESSES[network?.alias]
}

