import { UUID } from './uuid';

type BucketId = string;

export interface DashboardData {
  from: string;
  to: string;
  channelUUID: UUID;
  productUUID: UUID;
  buckets: BucketId[];
  Table: DashboardDataTableItem;
  Counts: {
    Daily: DashboardDataCountsItem,
    Weekly: DashboardDataCountsItem,
    Monthly: DashboardDataCountsItem
  };
  RateDiffSubscribe: number[];
  RateSurvival: number[][];
}

interface DashboardDataCountsItem {
  x: string[];
  CountReco: number[][];
  RateReco: number[][];
  RateSubscribe: number[][];
}

export interface DashboardDataTableItem {
  CountSubscribeByReco: number;
  CountBase: number;
  CountSubscribeByBase: number;
  RateSubscribeByReco: number;
  RateSubscribeByBase: number;
  RateContributeSubscribeByReco: number;
  CountReco: number;
  CountContributeSubscribeByReco: number;
  CountDayExpectSubscribe: number;
  SalesMonthSubscribe: number;
  CustomerTransactionSubscribe: number;
  ValueContributeLTV: number;
}
