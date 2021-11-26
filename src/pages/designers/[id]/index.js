import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import kebabCase from 'lodash.kebabcase';
import PageDesignerDescription from '@containers/page-designer-description';
import { getChainId } from '@selectors/global.selectors';
import auctionPageActions from '@actions/auction.page.actions';
import { getDesignerGarmentIds, getDesignerInfoByName } from '@selectors/designer.selectors';
import wsApi from '@services/api/ws.service';
import designerPageActions from '@actions/designer.page.actions';
import historyActions from '@actions/history.actions';
import collectionActions from '@actions/collection.actions';
import auctionActions from '@actions/auction.actions';
import { useSubscription } from '@hooks/subscription.hooks';

const Designers = () => {
  const router = useRouter();
  const { id } = router.query;

  const dispatch = useDispatch();
  const chainId = useSelector(getChainId);
  const currentDesigner = useSelector(getDesignerInfoByName(kebabCase(id)));
  const designerGarmentIds = useSelector(getDesignerGarmentIds());
  const ids = designerGarmentIds.toJS();

  useSubscription(
    {
      request: wsApi.onDesignerByIds(currentDesigner.ids),
      next: (data) => dispatch(designerPageActions.update(data.digitalaxGarmentDesigners)),
    },
    [chainId]
  );

  useSubscription(
    {
      request: wsApi.onAllAuctionsChange(),
      next: (data) => {
        dispatch(auctionPageActions.updateAuctions(data.digitalaxGarmentAuctions));
      },
    },
    [chainId]
  );

  useSubscription(
    {
      request: wsApi.onAuctionsHistoryByIds(ids),
      next: (data) => dispatch(historyActions.mapData(data.digitalaxGarmentAuctionHistories)),
    },
    [chainId, ids]
  );

  useSubscription(
    {
      request: wsApi.getAllDigitalaxMarketplaceOffers(),
      next: (data) => {
        dispatch(collectionActions.updateMarketplaceOffers(data.digitalaxMarketplaceOffers));
      },
    },
    [chainId]
  );

  useSubscription(
    {
      request: wsApi.onDigitalaxGarmentsCollectionChangeByIds(ids),
      next: (data) => dispatch(collectionActions.mapData(data.digitalaxGarmentCollections)),
    },
    [chainId, ids]
  );

  useSubscription(
    {
      request: wsApi.onMarketplaceHistoryByIds(ids),
      next: (data) => {
        dispatch(
          historyActions.updateMarketplaceHistories(data.digitalaxMarketplacePurchaseHistories)
        );
      },
    },
    [chainId, ids]
  );

  const dateMonth = new Date();
  dateMonth.setDate(dateMonth.getDate() - 30); // now - 30 days

  useSubscription(
    {
      request: wsApi.onResultedAuctionsByEndTimeGtAndIds(ids, parseInt(dateMonth / 1000, 10)),
      next: (data) =>
        dispatch(
          auctionActions.setValue('monthDesignerResultedAuctions', data.digitalaxGarmentAuctions)
        ),
    },
    [chainId, JSON.stringify(designerGarmentIds)]
  );

  useEffect(
    () => () => {
      dispatch(designerPageActions.reset());
    },
    []
  );

  return <PageDesignerDescription designerName={id} clothesIds={ids} />;
};

export default memo(Designers);
