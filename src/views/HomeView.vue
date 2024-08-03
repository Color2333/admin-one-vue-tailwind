<script setup>
import { computed, ref, onMounted, onUnmounted, reactive } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiScanHelper,
  mdiChartTimelineVariant,
  mdiReload,
  mdiAirHumidifier,
  mdiInstrumentTriangle,
  mdiWeatherWindy,
  mdiCoolantTemperature,
  mdiChartPie
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import CardBox from '@/components/CardBox.vue'
import TableSampleClients from '@/components/TableTotal.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import * as echarts from 'echarts';
const temperature = ref(0);
const previousTemperature = ref(0);
const temperatureTrend = ref('');
const temperatureTrendType = ref('neutral');

const humidity = ref(0);
const previousHumidity = ref(0);
const humidityTrend = ref('');
const humidityTrendType = ref('neutral');

const pressure = ref(0);
const previousPressure = ref(0);
const pressureTrend = ref('');
const pressureTrendType = ref('neutral');
const chartData = ref({
  labels: [],
  windSpeed1: [],
  windSpeed2: []
});
let myChart = null;
let ws;
let refreshInterval;
function setupWebSocket() {
  ws = new WebSocket('ws://10.50.31.240:8083/fb2/qixiang');

  ws.onmessage = event => {
    const data = JSON.parse(event.data);
    // Store data for periodic update
    localStorage.setItem('latestWeatherData', JSON.stringify(data));
    updateChartData(data);

  };

  ws.onerror = error => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };
}
function initChart() {
  const chartDom = document.getElementById('main');
  if (chartDom) {
    myChart = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: chartData.value.labels
      },
      yAxis: {
        type: 'value'
      },
      legend: {
        data: ['Wind Speed 1', 'Wind Speed 2'],
        show: true
      },
      series: [
        {
          name: 'Wind Speed 1',
          type: 'line',
          data: chartData.value.windSpeed1,
          smooth: true,
          symbol: 'none',
          areaStyle: {}
        },
        {
          name: 'Wind Speed 2',
          type: 'line',
          data: chartData.value.windSpeed2,
          smooth: true,
          symbol: 'none',
          areaStyle: {}
        }
      ]
    };
    myChart.setOption(option);
  }
}
function updateChartData(data) {
  const now = new Date();
  const newLabel = now.toLocaleTimeString();

  chartData.value.labels.push(newLabel);
  chartData.value.windSpeed1.push(data.wind_speed_1);
  chartData.value.windSpeed2.push(data.wind_speed_2);

  // Keep only the latest 50 data points
  if (chartData.value.labels.length > 50) {
    chartData.value.labels.shift();
    chartData.value.windSpeed1.shift();
    chartData.value.windSpeed2.shift();
  }

  myChart.setOption({
    xAxis: {
      data: chartData.value.labels
    },
    series: [
      {
        data: chartData.value.windSpeed1
      },
      {
        data: chartData.value.windSpeed2
      }
    ]
  });
}

function refreshData() {
  const data = JSON.parse(localStorage.getItem('latestWeatherData') || '{}');
  updateWeatherData(data);
}

function updateWeatherData(data) {
  // Update temperature with trends
  updateStatistics(temperature, previousTemperature, temperatureTrend, temperatureTrendType, data.air_temperature_1);
  // Update humidity with trends
  updateStatistics(humidity, previousHumidity, humidityTrend, humidityTrendType, data.relative_humidity_1);
  // Update pressure with trends
  updateStatistics(pressure, previousPressure, pressureTrend, pressureTrendType, data.atmospheric_pressure);
}

function updateStatistics(current, previous, trend, trendType, newValue) {
  const difference = newValue - previous.value;
  current.value = newValue;
  trend.value = Math.abs(difference).toFixed(2) + '%';

  if (difference > 0) {
    trendType.value = 'up';
  } else if (difference < 0) {
    trendType.value = 'down';
  } else {
    trendType.value = 'neutral';
  }

  previous.value = newValue; // Update previous value for the next comparison
}

onMounted(() => {
  initChart();
  setupWebSocket();
  // Set up an interval to refresh data every minute
  refreshInterval = setInterval(refreshData, 60000);
  refreshData();
});

onUnmounted(() => {
  if (ws) {
    ws.close();
  }
  if (myChart) {
    myChart.dispose();
  }
  clearInterval(refreshInterval);
});

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Overview" main>
      </SectionTitleLineWithButton>
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget :trend="temperatureTrend" :trend-type="temperatureTrendType" color="text-emerald-500"
          :icon="mdiCoolantTemperature" :number="temperature" label="温度" />
        <CardBoxWidget :trend="humidityTrend" :trend-type="humidityTrendType" color="text-blue-500"
          :icon="mdiAirHumidifier" :number="humidity" label="湿度" />
        <CardBoxWidget :trend="pressureTrend" :trend-type="pressureTrendType" color="text-red-500"
          :icon="mdiWeatherWindy" :number="pressure" label="气压" />
      </div>
      <SectionTitleLineWithButton :icon="mdiChartPie" title="风向时速表">
        <BaseButton :icon="mdiReload" color="whiteDark" />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6">
        <div id="main" style="width: 100%; height: 400px;"></div>
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiInstrumentTriangle" title="仪器概览" />

      <NotificationBar color="info" :icon="mdiScanHelper">
        <b>下面是本次大作业中涉及到的所有数据</b> 注：第三个WebSocket数据仅接收了部分存入数据库。
      </NotificationBar>

      <CardBox has-table>
        <TableSampleClients />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
