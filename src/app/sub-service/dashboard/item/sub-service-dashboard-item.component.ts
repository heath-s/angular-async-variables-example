import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DashboardDrawn } from '../../types/dashboard-drawn';

const ECHARTS_INIT_OPTS = { renderer: 'canvas' };
const ECHARTS_THEME = {
  color: ['#2f4554', '#c23531', '#61a0a8', '#d48265', '#91c7ae', '#749f83',  '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
};

interface GridLayout {
  cols: number;
  layout: {
    type: string;
    rowspan: number;
  }[];
}

@Component({
  selector: 'app-sub-service-dashboard-item',
  templateUrl: './sub-service-dashboard-item.component.html',
  styleUrls: ['./sub-service-dashboard-item.component.scss']
})
export class SubServiceDashboardItemComponent {

  @Input() dashboard: DashboardDrawn;
  BOXPLOT_VALUES = [
    { index: 4, label: 'Upper' },
    { index: 3, label: 'Q3' },
    { index: 2, label: 'Median' },
    { index: 1, label: 'Q1' },
    { index: 0, label: 'Lower' },
  ];
  ECHARTS_INIT_OPTS = ECHARTS_INIT_OPTS;
  ECHARTS_THEME = ECHARTS_THEME;
  gridLayout$: Observable<GridLayout>;
  TOOLTIP_CONTRIBUTE_RATIO = 'RECO 가입 기여율 = RECO 가입률 - Base 가입률';
  TOOLTIP_LTV = [
    '객단가 = 월매출 × 기대가입월',
    'LTV 기여분 = RECO 가입 건수 × 객단가'
  ].join('\n');

  constructor(private readonly breakpointObserver: BreakpointObserver) {
    this.gridLayout$ = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map(({ breakpoints, matches }) => {
        if (matches) {
          return breakpoints[Breakpoints.XSmall] ?
            {
              cols: 1,
              layout: [
                { type: 'Counts.CountReco', rowspan: 1 },
                { type: 'Counts.RateReco', rowspan: 1 },
                { type: 'Counts.RateSubscribe', rowspan: 1 },
                { type: 'RateDiffSubscribe', rowspan: 1 },
                { type: 'RateSurvival', rowspan: 2 }
              ]
            } :
            {
              cols: 2,
              layout: [
                { type: 'Counts.CountReco', rowspan: 1 },
                { type: 'Counts.RateReco', rowspan: 1 },
                { type: 'Counts.RateSubscribe', rowspan: 1 },
                { type: 'RateSurvival', rowspan: 2 },
                { type: 'RateDiffSubscribe', rowspan: 1 },
              ]
            };
        } else {
          return {
            cols: 3,
            layout: [
              { type: 'Counts.CountReco', rowspan: 1 },
              { type: 'Counts.RateReco', rowspan: 1 },
              { type: 'RateSurvival', rowspan: 2 },
              { type: 'Counts.RateSubscribe', rowspan: 1 },
              { type: 'RateDiffSubscribe', rowspan: 1 }
            ]
          };
        }
      }));
  }

  chartsTrackBy(_, { type }) {
    return type;
  }

}
