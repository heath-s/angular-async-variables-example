import { EChartOption } from 'echarts';
import { parse } from 'date-fns';
import { prepareBoxplotData } from 'echarts/extension/dataTool';

import { DashboardData } from '../types/dashboard-data';
import { DashboardDrawn, DashboardDrawnCounts } from '../types/dashboard-drawn';
import Product from '../types/product';

function roundDecimal(num: number, fraction: number): number {
  return +num.toFixed(fraction);
}

function tooltipFormatter(options: { fraction: number, title: boolean }) {
  return (params: EChartOption.Tooltip.Format[]) => {
    let text = options.title ? `${params[0].name}<br>` : '';
    text += params
      .map((param) =>
        (params.length > 1 ? `${param.marker}${param.seriesName}: ` : `[${param.name}] `) +
        (typeof param.value === 'number' ? roundDecimal(param.value as number, options.fraction) : '-')
      )
      .join('<br>');
    return text;
  };
}

export default function getDashboardDrawn(dashboardData: DashboardData, product: Product): DashboardDrawn {
  const {
    from,
    to,
    buckets,
    Table: tableData,
    Counts: countsData,
    RateDiffSubscribe: rateDiffSubscribeData,
    RateSurvival: rateSurvivalData
  } = dashboardData;

  const Counts = ['Daily', 'Weekly', 'Monthly'].reduce((echartOptions, unit) => {
    const COUNTS_OPTION: EChartOption = {
      tooltip: {
        trigger: 'axis',
        confine: true,
        textStyle: { fontFamily: 'monospace' }
      },
      legend: {},
      grid: { bottom: '40px', left: '3%', right: '3%', top: '32px', containLabel: true },
      xAxis: {
        type: 'category',
        data: countsData[unit].x,
        boundaryGap: false
      },
      yAxis: {
        type: 'value'
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'empty',
          showDetail: false
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'empty'
        }
      ]
    };
    const COUNTS_SERIES_OPTION = {
      type: 'line',
      connectNulls: true,
      label: { show: false },
      showSymbol: false,
      symbolSize: 10
    };

    const CountReco: EChartOption = {
      ...COUNTS_OPTION,
      series: [...buckets, 'ALL'].map((name, index) => ({
        ...COUNTS_SERIES_OPTION,
        name,
        data: countsData[unit].CountReco[index]
      }))
    };
    const RateReco: EChartOption = {
      ...COUNTS_OPTION,
      tooltip: {
        ...COUNTS_OPTION.tooltip,
        formatter: tooltipFormatter({ fraction: 2, title: true })
      },
      yAxis: {
        axisLabel: { interval: 10 },
        splitArea: { show: true, interval: 10 },
        min: 0,
        max: 100,
        interval: 10
      },
      series: buckets.map((name, index) => ({
        ...COUNTS_SERIES_OPTION,
        name,
        data: countsData[unit].RateReco[index]
      }))
    };
    const RateSubscribe: EChartOption = {
      ...COUNTS_OPTION,
      tooltip: {
        ...COUNTS_OPTION.tooltip,
        formatter: tooltipFormatter({ fraction: 2, title: true })
      },
      series: buckets.map((name, index) => ({
        ...COUNTS_SERIES_OPTION,
        name,
        data: countsData[unit].RateSubscribe[index],
      }))
    };

    echartOptions[unit] = { CountReco, RateReco, RateSubscribe };
    return echartOptions;
  }, {} as DashboardDrawnCounts);

  const rateDiffSubscribeBoxplotData = prepareBoxplotData([rateDiffSubscribeData]);
  const RateDiffSubscribe: EChartOption<EChartOption.SeriesBoxplot> = {
    tooltip: {
      trigger: 'item',
      confine: true,
      textStyle: { fontFamily: 'monospace' }
    },
    grid: { bottom: '3%', left: '3%', right: '3%', top: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: rateDiffSubscribeBoxplotData.axisData,
      axisLine: { lineStyle: { color: '#c23531', width: 3 } },
      axisTick: { show: false },
      axisLabel: { show: false }
    },
    yAxis: {},
    series: [
      {
        name: 'boxplot',
        type: 'boxplot',
        data: rateDiffSubscribeBoxplotData.boxData,
        tooltip: {
          formatter: (param) =>
            [
              'Upper: ' + roundDecimal(param.data[5], 2),
              'Q3: ' + roundDecimal(param.data[4], 2),
              'Median: ' + roundDecimal(param.data[3], 2),
              'Q1: ' + roundDecimal(param.data[2], 2),
              'Lower: ' + roundDecimal(param.data[1], 2)
            ].join('<br>'),
        }
      },
      {
        name: 'outlier',
        type: 'scatter',
        data: rateDiffSubscribeBoxplotData.outliers,
        tooltip: {
          formatter: (params) => roundDecimal(params.data[1] as number, 2)
        },
      }
    ]
  };

  const SURVIVAL_OPTION: EChartOption = {
    tooltip: {
      trigger: 'axis',
      confine: true,
      textStyle: { fontFamily: 'monospace' }
    },
    grid: { bottom: '32px', left: '3%', right: '3%', top: '32px', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: { interval: 29, showMaxLabel: true },
      splitArea: { show: true, interval: 29 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { interval: 10 },
      splitArea: { show: true, interval: 10 },
      min: 0,
      max: 100,
      interval: 10
    },
  };
  const SURVIVAL_SERIES_OPTION = {
    type: 'line',
    connectNulls: true,
    label: {
      show: true,
      formatter: (params) => roundDecimal(params.value, 2)
    },
    showSymbol: true,
    symbolSize: 10
  };

  const survivalAll = rateSurvivalData[rateSurvivalData.length - 1];
  const survivalAllEChartOption: EChartOption = {
    ...SURVIVAL_OPTION,
    tooltip: {
      ...SURVIVAL_OPTION.tooltip,
      formatter: tooltipFormatter({ fraction: 2, title: false })
    },
    xAxis: {
      ...SURVIVAL_OPTION.xAxis,
      data: survivalAll.map((_, i) => i)
    },
    series: [{
      ...SURVIVAL_SERIES_OPTION,
      data: survivalAll
    }]
  };
  const survivalBucketsEChartOption: EChartOption = {
    ...SURVIVAL_OPTION,
    tooltip: {
      ...SURVIVAL_OPTION.tooltip,
      formatter: tooltipFormatter({ fraction: 2, title: true })
    },
    legend: {},
    xAxis: {
      ...SURVIVAL_OPTION.xAxis,
      data: rateSurvivalData[0].map((_, i) => i)
    },
    series: buckets.map((name, index) => ({
      ...SURVIVAL_SERIES_OPTION,
      name,
      data: rateSurvivalData[index]
    }))
  };

  return {
    from: parse(from, 'yyyyMMdd', new Date(0)),
    to: parse(to, 'yyyyMMdd', new Date(0)),
    product,
    Table: tableData,
    Counts,
    RateDiffSubscribe,
    RateSurvival: {
      all: survivalAllEChartOption,
      buckets: survivalBucketsEChartOption
    }
  };
}
