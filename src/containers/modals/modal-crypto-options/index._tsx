import { FC, useEffect, useState } from 'react'
import { Button, useUI } from '@components/ui'
import s from './styles.module.css'
import { setBuyNowStatus, setCrypto, setCryptoPrice, useMain } from 'context'
import { approveToken, getAllowance } from 'services/order.service'
import { tokens } from '../../../constants'
import { getPayableTokenReport } from 'services/api.service'
import { useCart } from '@framework/cart'
import { useRouter } from 'next/router'

interface Props {}

const CryptoOptionsView: FC<Props> = () => {
  const { setModalView } = useUI()
  const { data } = useCart()
  const {
    dispatch,
    account,
    buyNowStatus,
    cryptoPrice,
    crypto,
    collectionId,
  } = useMain()
  const [loading, setLoading] = useState(false)
  const [approved, setApproved] = useState(false)
  const onCryptoOptionSelect = (option: string) => {
    if (!loading) {
      dispatch(setCrypto(option))
      window.localStorage.setItem('CRYPTO_OPTION', option.toString())
    }
  }

  useEffect(() => {
    if (crypto.length) {
      const fetchCryptoPrice = async () => {
        const { payableTokenReport } = await getPayableTokenReport(
          tokens[crypto].address
        )

        const updatedPrice = payableTokenReport.payload / 1e18
        if (updatedPrice !== cryptoPrice) {
          dispatch(setCryptoPrice(updatedPrice))
        }
      }

      fetchCryptoPrice()
    }
  }, [crypto])

  useEffect(() => {
    if (buyNowStatus === 2) {
      dispatch(setBuyNowStatus(0))
      setLoading(false)
      if (collectionId === '250' || collectionId === '251') {
        setModalView('PURCHASE_SUCCESS_VIEW')
      } else {
        setModalView('CRYPTO_SUCCESS_VIEW')
      }
    } else if (buyNowStatus === 3) {
      dispatch(setBuyNowStatus(0))
      setLoading(false)
    }
  }, [buyNowStatus])

  useEffect(() => {
    if (crypto.length) {
      const fetchAllowance = async () => {
        const allowance = await getAllowance({ account, crypto })
        if (allowance) {
          setApproved(true)
        } else {
          setApproved(false)
        }
      }

      fetchAllowance()
    }
  }, [crypto])

  const onApprove = async () => {
    if (!approved) {
      try {
        setLoading(true)
        await approveToken({
          account,
          crypto,
          cryptoPrice: cryptoPrice * (data?.lineItems[0].variant.price || 0),
        })
        setApproved(true)
        setLoading(false)
      } catch (err) {
        console.log(err)
        setApproved(false)
        setLoading(false)
        throw err
      }
    } else {
      dispatch(setBuyNowStatus(1))
      setLoading(true)
    }
  }

  return (
    <div className="flex flex-col space-y-3 items-center">
      <h1 className="text-center text-3xl font-bold">Crypto</h1>
      <p> Choose A Token To Swap For Fashion. </p>
      <div>
        <div className="flex space-x-3">
          {/* <div
            className={`text-center ${s.cryptoIcon} ${
              crypto === 'rari' && s.selected
            } ${loading && s.disabled}`}
            onClick={() => onCryptoOptionSelect('rari')}
          >
            <img src="/cryptos/options/rari.png" className="m-auto" />
            <span className="text-xs"> Rari </span>
          </div> */}
          {/* <div
            className={`text-center ${s.cryptoIcon}`}
            onClick={() => onCryptoOptionSelect('fei')}
          >
            <img src="/cryptos/Fei.png" className="m-auto" />
            <span className="text-xs"> Fei </span>
          </div> */}
          <div
            className={`text-center ${s.cryptoIcon} ${
              crypto === 'instadapp' && s.selected
            } ${loading && s.disabled}`}
            onClick={() => onCryptoOptionSelect('instadapp')}
          >
            <img src="/cryptos/options/instadapp.png" className="m-auto" />
            <span className="text-xs"> INSTA </span>
          </div>
          <div
            className={`text-center ${s.cryptoIcon} ${
              crypto === 'dai' && s.selected
            } ${loading && s.disabled}`}
            onClick={() => onCryptoOptionSelect('dai')}
          >
            <img src="/cryptos/options/dai.png" className="m-auto" />
            <span className="text-xs"> DAI </span>
          </div>
          <div
            className={`text-center ${s.cryptoIcon} ${
              crypto === 'pickle' && s.selected
            } ${loading && s.disabled}`}
            onClick={() => onCryptoOptionSelect('pickle')}
          >
            <img
              src="/cryptos/options/pickle.png"
              style={{ borderRadius: '100%', border: '1px solid black' }}
              className="m-auto"
            />
            <span className="text-xs"> Pickle </span>
          </div>
          <div
            className={`text-center ${s.cryptoIcon} ${
              crypto === 'weth' && s.selected
            } ${loading && s.disabled}`}
            onClick={() => onCryptoOptionSelect('weth')}
          >
            <img src="/cryptos/options/weth.png" className="m-auto" />
            <span className="text-xs"> wETH </span>
          </div>
          <div
            className={`text-center ${s.cryptoIcon} ${
              crypto === 'mona' && s.selected
            } ${loading && s.disabled}`}
            onClick={() => onCryptoOptionSelect('mona')}
          >
            <img src="/cryptos/options/mona.png" className="m-auto" />
            <span className="text-xs"> MONA </span>
          </div>
        </div>
        <div className="flex justify-center space-x-3">
          <div
            className={`text-center ${s.cryptoIcon} ${
              crypto === 'aave' && s.selected
            } ${loading && s.disabled}`}
            onClick={() => onCryptoOptionSelect('aave')}
          >
            <img src="/cryptos/options/aave.png" className="m-auto" />
            <span className="text-xs"> AAVE </span>
          </div>
          <div
            className={`text-center ${s.cryptoIcon} ${
              crypto === 'matic' && s.selected
            } ${loading && s.disabled}`}
            onClick={() => onCryptoOptionSelect('matic')}
          >
            <img src="/cryptos/options/matic.png" className="m-auto" />
            <span className="text-xs"> wMATIC </span>
          </div>
          {/* <div
            className={`text-center ${s.cryptoIcon} ${
              crypto === 'bancor' && s.selected
            } ${loading && s.disabled}`}
            onClick={() => onCryptoOptionSelect('bancor')}
          >
            <img src="/cryptos/options/bancor.png" className="m-auto" />
            <span className="text-xs"> BANCOR </span>
          </div>
          <div
            className={`text-center ${s.cryptoIcon} ${
              crypto === 'force' && s.selected
            } ${loading && s.disabled}`}
            onClick={() => onCryptoOptionSelect('force')}
          >
            <img src="/cryptos/options/force.png" className="m-auto" />
            <span className="text-xs"> Force </span>
          </div> */}
        </div>
      </div>
      <Button
        variant="new-slim"
        onClick={onApprove}
        disabled={!crypto.length && cryptoPrice === 0.0}
        loading={loading}
      >
        {!approved ? 'Approve Spend' : 'Mint NFT'}
      </Button>
      {loading && approved && (
        <p className="text-center" style={{ color: '#0688FF' }}>
          {'Your NFT is minting...this might take a little while!'}
        </p>
      )}
    </div>
  )
}

export default CryptoOptionsView
