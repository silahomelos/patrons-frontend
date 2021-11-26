import React, { memo, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { convertToEth } from '@helpers/price.helpers';
import auctionPageActions from '@actions/auction.page.actions';
import { TOTAL_VOLUME_DAYS } from '@constants/global.constants';
import { getMonaPerEth } from '@selectors/global.selectors';
import collectionActions from '@actions/collection.actions';
import {
  getAllAuctions,
  getGlobalStats,
  getWeekResultedAuctions,
} from '@selectors/auction.selectors';
import { useAPY } from '@hooks/apy.hooks';
import TextContent from '@containers/page-products-list/text-content';
import ProductCollection from '@components/product-collection';
import 'semantic-ui-css/components/dropdown.css';
import 'semantic-ui-css/components/transition.css';
import styles from './styles.module.scss';

const collections = [
  {
    id: 3,
    text: 'MineCraft',
    designer: 'Cleora',
    image: 'https://digitalax.mypinata.cloud/ipfs/QmTfYwLRhqpYBaSoFFGKUJcYU6XSbHpsQvRen2dWQZ8WKH',
  },
  {
    image: 'https://digitalax.mypinata.cloud/ipfs/QmXQrcfSzSGCRbcGbAFGR3gRpbB89hnSMpGfcfn3cVGVRi',
    designer: 'Digitalax',
    id: 4,
    image1: 'https://digitalax.mypinata.cloud/ipfs/QmctArVrTggDjdXafbbLMCrk13qRqpdbYKxKLKxHvGT2M5',
    text: 'Minecraft DIGI Bundle',
  },
  {
    id: 1,
    text: 'Collection: Cosmos x Charli Cohen',
    designer: 'Cosmos',
    image1: 'https://digitalax.mypinata.cloud/ipfs/QmYvo2f6NfCD75nL49Gy5wi1jEYSh8z7wTHJjnJbV9KJt3',
    image: 'https://digitalax.mypinata.cloud/ipfs/QmaXujooccp7MsnNSk6M3A6oxGiPnsvTwwu8hutefFgDEJ',
  },
  {
    id: 2,
    text: 'DIGI Bundle',
    designer: 'Digitalax',
    image: 'https://digitalax.mypinata.cloud/ipfs/QmRdxLAmXR36dNr6cKJeXNyEzSd1JKYMmzbQipHv3HZ1b1',
  },
];

const PageAuctionList = () => {
  const dispatch = useDispatch();
  const auctions = useSelector(getAllAuctions);
  const weekResultedAuctions = useSelector(getWeekResultedAuctions).toJS();
  const globalStats = useSelector(getGlobalStats).toJS();
  const monaPerEth = useSelector(getMonaPerEth);
  const currentAuctions = auctions.toJS();

  useEffect(
    () => () => {
      dispatch(auctionPageActions.reset());
      dispatch(collectionActions.clear());
    },
    [],
  );

  const nowTimestamp = Date.now();

  const filteredAuctionsTimes = currentAuctions
    .filter((item) => item.endTime * 1000 - nowTimestamp > 0)
    .map((item) => item.endTime * 1000);

  const minTimestampAutcionTime = filteredAuctionsTimes.length
    ? Math.min(...filteredAuctionsTimes)
    : 0;

  const sumTopBids = (items) =>
    items.reduce(
      (acc, auction) =>
        auction.totalNetBidActivity
          ? acc.plus(
              new BigNumber(auction.totalNetBidActivity)
                .plus(new BigNumber(auction.totalMarketplaceVolumeInETH))
                .plus(
                  new BigNumber(auction.totalMarketplaceVolumeInMona).times(
                    new BigNumber(monaPerEth),
                  ),
                ),
            )
          : acc,
      new BigNumber(0),
    );

  const totalWeekValue = sumTopBids(weekResultedAuctions);
  let highestBid = new BigNumber(0);

  currentAuctions.forEach((auction) => {
    if (!auction.topBid) {
      return;
    }

    const bid = new BigNumber(auction.topBid);

    if (bid.gt(highestBid)) {
      highestBid = bid;
    }
  });
  const estimateApy = useAPY(highestBid.toString(10));

  const list = useMemo(() => {
    let totalSum = new BigNumber(0);
    if (globalStats.totalSalesValue) {
      totalSum = totalSum.plus(
        new BigNumber(globalStats.totalMarketplaceSalesInMona).times(new BigNumber(monaPerEth)),
      );
      totalSum = totalSum.plus(new BigNumber(globalStats.totalMarketplaceSalesInETH));
      totalSum = totalSum.plus(new BigNumber(globalStats.totalSalesValue));
    }
    return [
      {
        description: 'Total NFT’s value',
        value: Math.round(parseFloat(convertToEth(totalSum.integerValue())) * 10000) / 10000,
      },
      {
        description: `Total Vol ${TOTAL_VOLUME_DAYS} days`,
        value:
          Math.round(
            parseFloat(
              convertToEth(totalWeekValue.gte(0) ? totalWeekValue : totalWeekValue.times(-1)),
            ) * 100,
          ) / 100,
      },
      {
        description: 'Highest APY',
        value: estimateApy,
      },
    ];
  }, [globalStats, totalWeekValue, estimateApy]);

  return (
    <>
      <div className={styles.textContent}>
        <TextContent />
      </div>

      <ul className={cn(styles.list, 'animate__animated animate__fadeIn')}>
        {collections.map((collection) => (
          <ProductCollection key={collection.id} collection={collection} />
        ))}
      </ul>
    </>
  );
};

export default memo(PageAuctionList);
