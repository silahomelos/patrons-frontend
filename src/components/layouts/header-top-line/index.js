import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router, { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import cn from 'classnames';
import Link from 'next/link';
import Button from '@components/buttons/button';
import SmallPhotoWithText from '@components/small-photo-with-text';
import { getUser } from '@selectors/user.selectors';
import { getChainId } from '@selectors/global.selectors';
import { openConnectMetamaskModal } from '@actions/modals.actions';
import accountActions from '@actions/user.actions';
import { getEnabledNetworkByChainId, requestSwitchNetwork } from '@services/network.service';

import Logo from './logo';
import styles from './styles.module.scss';

const HeaderTopLine = ({ className, isShowStaking, buttonText, linkText }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isCollapse, setIsCollapse] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const offset = 0;
      const { scrollTop } = document.documentElement;
      const scrolled = scrollTop > offset;

      if (hasScrolled !== scrolled) {
        setHasScrolled(scrolled);
      }
    }, 200);

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);

  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const chainId = useSelector(getChainId);
  const [hamburger, setHamburger] = useState(false);
  const network = useMemo(() => {
    return getEnabledNetworkByChainId(chainId);
  }, [chainId]);

  const router = useRouter();
  const pathname = router.pathname;

  const isLandingPage = pathname === '/';

  const isOnRightNetwork =
    pathname !== '/bridge' &&
    pathname !== '/bridge/deposit' &&
    !pathname.includes('withdraw/pending');

  const wrongNetworkText =
    pathname !== '/bridge' && pathname !== '/bridge/deposit'
      ? network?.alias !== 'matic'
        ? 'Please switch to Matic Network'
        : ''
      : 'Please switch to Mainnet';

  const switchNetwork = async () => {
    const res = await requestSwitchNetwork();
    return res;
  };

  if (!user) {
    dispatch(accountActions.checkStorageAuth());
  }

  const handleClick = () => dispatch(openConnectMetamaskModal());
  const onIconHander = () => {
    setIsCollapse(!isCollapse);
  };

  const [isShowMenu, setIsShowMenu] = useState(false);

  const handleProfileClick = () => {
    setIsShowMenu(false);
    Router.push('/profile').then(() => window.scrollTo(0, 0));
  };
  const handleLogoutClick = () => {
    setIsShowMenu(false);
    dispatch(accountActions.logout());
  };

  console.log({ isOnRightNetwork });

  return (
    <div
      className={cn(
        className,
        styles.wrapper,
        hasScrolled ? styles.floatingNav : '',
        pathname.includes('bridge') ? styles.bridgeHeader : '',
      )}
    >
      {!isOnRightNetwork && <p className={styles.notification}>{wrongNetworkText}</p>}
      <div className={styles.leftBox}>
        <Logo black={false} />
      </div>
      <div className={styles.rightBox}>
        <div className={cn(styles.links, isCollapse ? styles.expandedMenu : '')}>
          <Link href="https://designers.digitalax.xyz/getdressed/">
            <a className={styles.link} target="_blank">
              GET CUSTOM DRESSED
            </a>
          </Link>
          <Link href="https://drip.digitalax.xyz/">
            <a className={styles.link} target="_blank">
              PHYSICAL WEB3 FASHION
            </a>
          </Link>
          <Link href="https://fashion.digitalax.xyz/marketplace" target='_blank'>
            <a className={styles.link}>DIGITAL WEB3 FASHION</a>
          </Link>
          <Link href="https://designers.digitalax.xyz/global/">
            <a className={styles.link} target="_blank">
              GLOBAL DESIGNER NETWORK
            </a>
          </Link>
          <Link href="https://staking.digitalax.xyz/">
            <a className={styles.link}>STAKE FASHION NFT</a>
          </Link>
          <Link href="https://fashion.digitalax.xyz/bridge">
            <a className={styles.link} target="_blank">BRIDGE MONA</a>
          </Link>
        </div>
        {network?.alias !== 'matic' ? (
          <Button onClick={() => switchNetwork()} className={styles.switchNetwork}>
            Switch Network
          </Button>
        ) : null}
        <div className={styles.signBtn}>
          {user ? (
            <div className={styles.buttonWrapper} onClick={() => setIsShowMenu(!isShowMenu)}>
              <SmallPhotoWithText
                photo={
                  user.get('avatar')
                    ? user.get('avatar')
                    : './images/user-profile/user-avatar-black.png'
                }
                address={user.get('username')}
                className={styles.hashAddress}
              >
                <button className={styles.arrowBottom}>
                  <img
                    className={styles.arrowBottomImg}
                    src="./images/icons/arrow-bottom.svg"
                    alt="arrow-bottom"
                  />
                </button>
              </SmallPhotoWithText>
              {isShowMenu && (
                <div className={styles.menuWrapper}>
                  <button onClick={() => handleProfileClick()} className={styles.menuButton}>
                    Profile
                  </button>
                  <button onClick={() => handleLogoutClick()} className={styles.menuButton}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button className={styles.signInButton} onClick={() => handleClick()}>
              {buttonText}
            </Button>
          )}
        </div>
        <a href="javascript:void(0);" className={styles.collapseIcon} onClick={onIconHander}>
          &#9776;
        </a>
      </div>
      {hamburger ? (
        <div className={styles.mobileMenu}>
          {user ? (
            <div className={styles.buttonWrapper}>
              <SmallPhotoWithText
                photo={user.get('avatar') ? user.get('avatar') : './images/user-photo.svg'}
                address={user.get('username')}
                className={styles.hashAddress}
              >
                <button className={styles.arrowBottom} onClick={() => setIsShowMenu(!isShowMenu)}>
                  <img
                    className={styles.arrowBottomImg}
                    src="./images/icons/arrow-bottom.svg"
                    alt="arrow-bottom"
                  />
                </button>
              </SmallPhotoWithText>
              {isShowMenu && (
                <div className={styles.menuWrapper}>
                  <button onClick={() => handleProfileClick()} className={styles.menuButton}>
                    Profile
                  </button>
                  <button onClick={() => handleLogoutClick()} className={styles.menuButton}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button onClick={() => handleClick()}>{buttonText}</Button>
          )}
          <a
            href="https://medium.com/@digitalax"
            className={styles.link}
            target="_blank"
            rel="noreferrer"
          >
            Blog
          </a>
          <a
            href="https://community.digitalax.xyz/"
            className={styles.link}
            target="_blank"
            rel="noreferrer"
          >
            Forum
          </a>
          {isShowStaking && (
            <a
              href="http://staking.digitalax.xyz/"
              className={styles.link}
              target="_blank"
              rel="noreferrer"
            >
              {linkText}
            </a>
          )}
          <Link href="https://designers.digitalax.xyz/getdressed/">
            <a className={styles.link} target="_blank">
              GET CUSTOM DRESSED
            </a>
          </Link>
          <Link href="/global">
            <a className={styles.link}>Global Designer Network</a>
          </Link>
          <Link href="/bridge">
            <a className={styles.link}>Matic-Eth Bridge</a>
          </Link>
          <Link href="/swap">
            <a className={styles.link}>Token Swap</a>
          </Link>
        </div>
      ) : null}
    </div>
  );
};

HeaderTopLine.propTypes = {
  className: PropTypes.string,
  isShowStaking: PropTypes.bool,
  buttonText: PropTypes.string,
  linkText: PropTypes.string,
};

HeaderTopLine.defaultProps = {
  className: '',
  isShowStaking: false,
  buttonText: 'SIGN IN',
  linkText: 'Staking',
};

export default HeaderTopLine;
