import { EChartOption } from 'echarts';

import { DashboardDataTableItem } from '../types/dashboard-data';
import Product from './product';

export interface DashboardDrawnCounts {
  Daily: DashboardDrawnCountsItem;
  Weekly: DashboardDrawnCountsItem;
  Monthly: DashboardDrawnCountsItem;
}

export interface DashboardDrawnCountsItem {
  CountReco: EChartOption;
  RateReco: EChartOption;
  RateSubscribe: EChartOption;
}

export interface DashboardDrawn {
  from: Date;
  to: Date;
  product: Product;
  Table: DashboardDataTableItem;
  Counts: DashboardDrawnCounts;
  RateDiffSubscribe: EChartOption<EChartOption.SeriesBoxplot>;
  RateSurvival: {
    all: EChartOption;
    buckets: EChartOption;
  };
}
