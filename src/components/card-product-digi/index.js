import React, { useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import kebabCase from 'lodash.kebabcase';
import ImportantProductInformation from '@containers/important-product-information';
import SmallPhotoWithText from '@components/small-photo-with-text';
import { getDesignerInfoById } from '@selectors/designer.selectors';
import { getCardProductChartOptions } from '@services/graph.service';
import { PRODUCTS } from '@constants/router-constants';
import { EXCLUSIVE_RARITY, COMMON_RARITY, SEMI_RARE_RARITY } from '@constants/global.constants';
import { useTokenInfo } from '@hooks/token.info.hooks';

import styles from './styles.module.scss';

const CardProductDigi = ({
  collectionId,
  history,
  auctionId,
  auctionIndex,
  garmentId,
  garment,
  tabIndex,
  className,
  showGraphIds,
  setShowGraphIds,
}) => {
  const TABS = [EXCLUSIVE_RARITY, SEMI_RARE_RARITY, COMMON_RARITY];
  const COLORS = [styles.color1, styles.color2, styles.color3];
  const [isOpen, setIsOpen] = useState(false);
  let tabIndexD = 3; // hardcoded

  const options = getCardProductChartOptions(history);

  if (!garment) {
    return null;
  }

  const tokenInfo = useTokenInfo(garment.tokenUri, [garment.tokenUri]);
  const designerInfo = useSelector(getDesignerInfoById(garment.designer));

  const [imageUrl, isVideo] = [tokenInfo ? tokenInfo.animation : '', true];

  return (
    <li className={cn(styles.item, className)}>
      <Link
        href={`${PRODUCTS}${collectionId}/${garmentId}/${auctionIndex}/${auctionId}${tabIndexD}`}
      >
        <a className={styles.clothesName}>
          {tokenInfo && tokenInfo.name ? tokenInfo.name : `ID:${garment.id}`}
        </a>
      </Link>
      <SmallPhotoWithText
        className={styles.designerWrapper}
        id={designerInfo ? kebabCase(designerInfo.designerName) : ''}
        name={designerInfo?.designerName}
        photo={designerInfo?.designerPhoto}
        photoIsLink
      />
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <Link
            href={`${PRODUCTS}${collectionId}/${garmentId}/${auctionIndex}/${auctionId}${tabIndexD}`}
          >
            <a className={styles.clothesPhotoWrapper}>
              <span className={cn(styles.garmentTypeWrapper, COLORS[tabIndexD])}>
                <span className={styles.bannerText}>{TABS[tabIndexD]}</span>
                <span className={styles.gap} />
              </span>
              {parseInt(garment.id, 10) >= 20 && parseInt(garment.id, 10) <= 28 && (
                <video autoPlay muted loop className={styles.clothesPhoto}>
                  <source src={`/video/${garment.id}.mp4`} type="video/mp4" />
                </video>
              )}
              {(parseInt(garment.id, 10) < 20 || parseInt(garment.id, 10) > 28) &&
                (tokenInfo && imageUrl ? (
                  isVideo ? (
                    <video autoPlay muted loop className={styles.clothesPhoto} key={imageUrl}>
                      <source
                        src={imageUrl.replace('gateway.pinata', 'digitalax.mypinata')}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <Image
                      className={styles.clothesPhoto}
                      src={imageUrl.replace('gateway.pinata', 'digitalax.mypinata')}
                      alt={garment.id}
                    />
                  )
                ) : null)}
            </a>
          </Link>
          {isOpen && (
            <div className={cn(styles.chart, { [styles.chartActive]: isOpen })}>
              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
          )}
          {tabIndex === 0 && (
            <button
              onClick={() => {
                if (!showGraphIds.includes(garment.id)) {
                  setShowGraphIds([...showGraphIds, garment.id]);
                } else {
                  setShowGraphIds(showGraphIds.filter((id) => id !== garment.id));
                }
                setIsOpen(!isOpen);
              }}
              className={cn(styles.triangle, { [styles.triangleActive]: isOpen })}
            >
              <img src="/images/icons/triangle.svg" alt="triangle" className={styles.triangleImg} />
            </button>
          )}
        </div>
        <ImportantProductInformation
          collectionId={collectionId}
          garment={garment}
          auctionId={auctionId}
          auctionIndex={auctionIndex}
          garmentId={garmentId}
          tabIndex={tabIndexD}
        />
      </div>
    </li>
  );
};

CardProductDigi.propTypes = {
  auctionId: PropTypes.object.isRequired,
  garment: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
  history: PropTypes.array,
  className: PropTypes.string,
  showGraphIds: PropTypes.array,
  setShowGraphIds: PropTypes.func,
};

CardProductDigi.defaultProps = {
  tabIndex: 0,
  className: '',
  history: [],
  showGraphIds: [],
  setShowGraphIds: () => {},
};

export default CardProductDigi;
