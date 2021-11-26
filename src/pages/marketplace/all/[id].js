import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import Container from '@components/container';
import { getCollectionGroupById, getDigitalaxMarketplaceV2Offers } from '@services/api/apiService';
import { useSelector } from 'react-redux';
import { getChainId } from '@selectors/global.selectors';
import HeroSection from '@components/hero-section';
import ProductInfoCard from '@components/product-info-card';
import { filterProducts } from '@utils/helpers';

const Auctions = () => {
  const route = useRouter();
  const chainId = useSelector(getChainId);
  const [auctions, setAuctions] = useState([]);
  const [collections, setCollections] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const { id } = route.query;

  useEffect(() => {
    const fetchCollectionGroup = async () => {
      let aucs = [];
      let colls = [];
      const { digitalaxCollectionGroup } = await getCollectionGroupById(chainId, id);
      if (
        !(
          digitalaxCollectionGroup.auctions.length === 1 &&
          digitalaxCollectionGroup.auctions[0].id === '0'
        )
      ) {
        digitalaxCollectionGroup.auctions.forEach((auction) => {
          aucs.push({
            ...auction,
            sold: Date.now() > auction.endTime * 1000,
            auction: true,
            rarity: 'Exclusive',
          });
        });
      }

      const { digitalaxMarketplaceV2Offers } = await getDigitalaxMarketplaceV2Offers(chainId);
      if (
        !(
          digitalaxCollectionGroup.collections.length === 1 &&
          digitalaxCollectionGroup.collections[0].id === '0'
        )
      ) {
        digitalaxCollectionGroup.collections.forEach((collection) => {
          const foundOfferItem = digitalaxMarketplaceV2Offers.find(
            (offer) => offer.id === collection.id,
          );
          if (!foundOfferItem) return;
          colls.push({
            designer: collection.designer,
            developer: collection.developer,
            auction: false,
            startTime: foundOfferItem.startTime,
            sold: collection.garments.length === parseInt(foundOfferItem.amountSold),
            garment: {
              ...collection.garments[0],
            },
            primarySalePrice: foundOfferItem ? foundOfferItem.primarySalePrice : 0,
            id: collection.id,
            rarity: collection.rarity,
          });
        });
      }

      setAuctions(aucs);
      setCollections(colls);
    };

    fetchCollectionGroup();
  }, []);

  const getLogo = () => {
    if (id === '0') return '/images/metaverse/amongus-logo1.png';
    if (id === '1') return '/images/metaverse/minecraft-logo.png';
    if (id === '3') return '/images/metaverse/auctionsLogo.png';
    return null;
  };

  const filteredProducts = filterProducts([...auctions, ...collections], filter, sortBy) || [];

  return (
    <div className={styles.wrapper}>
      <HeroSection
        width={id === '0' ? '60%' : '80%'}
        logo={getLogo()}
        title='DIGITAL'
        subTitle='INDIE WEB3 FASHION'
        filter={filter}
        setFilter={(v) => setFilter(v)}
        setSortBy={(v) => setSortBy(v)}
      />

      {filteredProducts
        .sort((a, b) => {
          if (a.sold && !b.sold) return 1;
          if (!a.sold && b.sold) return -1;
          return 0;
        })
        .sort((a, b) => {
          if (parseInt(a.startTime) > parseInt(b.startTime)) return -1;
          if (parseInt(a.startTime) < parseInt(b.startTime)) return 1;
          return 0;
        })
        .map((prod, index) => {
          if (index % 2 === 1) return <> </>;
          return (
            <section className={styles.productsSection} key={prod.id}>
              <Container>
                <div className={styles.body}>
                  <ProductInfoCard
                    product={filteredProducts[index]}
                    price={
                      filteredProducts[index].topBid || filteredProducts[index].primarySalePrice
                    }
                    showRarity
                    showCollectionName
                    sold={filteredProducts[index].sold}
                    isAuction={filteredProducts[index].auction}
                  />
                  {index + 1 < filteredProducts.length ? (
                    <ProductInfoCard
                      isLook={id === '15'}
                      product={filteredProducts[index + 1]}
                      price={
                        filteredProducts[index + 1].topBid ||
                        filteredProducts[index + 1].primarySalePrice
                      }
                      showRarity
                      sold={filteredProducts[index + 1].sold}
                      showCollectionName
                      isAuction={filteredProducts[index].auction}
                    />
                  ) : null}
                </div>
              </Container>
            </section>
          );
        })}
    </div>
  );
};

export default Auctions;
