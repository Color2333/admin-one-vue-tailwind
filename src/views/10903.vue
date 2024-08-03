<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="SEB16 数据总览" main />

      <CardBox class="mb-6" has-table>
        <TableSampleClients />
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiUpdate" title="选择日期范围" />
      <CardBox class="mb-6">
        <div class="demo-date-picker">
          <el-date-picker v-model="value" type="datetimerange" start-placeholder="Start date" end-placeholder="End date"
            format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd" time-format="A hh:mm:ss"
            @change="handleDateChange" />
          <BaseButton class="right-align-button" color="info" label="更新图表" @click="fetchAllData" :small="buttonsSmall"
            :outline="buttonsOutline" :disabled="buttonsDisabled" :rounded-full="buttonsRounded" />
        </div>
      </CardBox>

      <div v-for="element in elements" :key="element.key">
        <SectionTitleLineWithButton :icon="mdiChartPie" :title="element.label" />
        <CardBox class="mb-6 card-box">
          <div class="chart-container" v-if="element.chartData">
            <line-chart :data="element.chartData" class="h-96" />
          </div>
        </CardBox>
        <CardBox class="mb-6">
          <el-row :gutter="20">
            <el-col :span="8" v-for="stat in element.statistics" :key="stat.label">
              <div class="statistic-card">
                <el-statistic :value="stat.value"
                  :formatter="value => typeof value === 'number' ? value.toFixed(4) : value" :title="stat.label" />
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span>{{ stat.description }}</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </CardBox>
      </div>

      <CardBox>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  mdiUpdate,
  mdiTableBorder,
  mdiChartPie
} from '@mdi/js';
import axios from 'axios';
import SectionMain from '@/components/SectionMain.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import TableSampleClients from '@/components/Table10903.vue';
import CardBox from '@/components/CardBox.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import LineChart from '@/components/Charts/LineChart.vue';
import BaseButton from '@/components/BaseButton.vue';
import { ElStatistic } from 'element-plus';

const elements = ref([
  { key: 'Temp', label: 'Temperature-温度', chartData: null, statistics: [] },
  { key: 'Conductivity', label: 'Conductivity-电导率', chartData: null, statistics: [] },
  { key: 'Strains', label: 'Strains-压力', chartData: null, statistics: [] },
  { key: 'First_external_voltage', label: 'First External Voltage-第一外部电压', chartData: null, statistics: [] },
  { key: 'Second_external_voltage', label: 'Second External Voltage-第二外部电压', chartData: null, statistics: [] },
  { key: 'DO', label: 'Dissolved Oxygen-溶解氧', chartData: null, statistics: [] },
  { key: 'Chlorophyll', label: 'Chlorophyll-叶绿素浓度', chartData: null, statistics: [] },
  // 可以继续添加其他元素
]);


const value = ref(['2018-03-01T16:00:00.000Z', '2018-03-01T17:00:00.000Z']);
const buttonsSmall = ref(true);
const buttonsOutline = ref(false);
const buttonsDisabled = ref(false);
const buttonsRounded = ref(true);

const handleDateChange = () => {
  console.log('Date range selected:', value.value);
};

const fetchAllData = async () => {
  const start_time = value.value[0];
  const end_time = value.value[1];
  console.log('Fetching data for range:', start_time, end_time);

  for (let element of elements.value) {
    await fetchData(element.key, start_time, end_time);
    // Assuming a method to fetch statistics similar to `fetchData`
    await fetchStatistics(element.key, start_time, end_time);
    console.log(element.statistics)
  }
};
const fetchStatistics = async (parameter, start_time, end_time) => {
  try {
    // 向后端发送请求，获取统计数据
    const response = await axios.post('http://localhost:8000/seb16/statistics', {
      start_time,
      end_time,
      parameters: [parameter]
    });

    // 在元素数组中找到当前参数对应的元素
    const element = elements.value.find(el => el.key === parameter);
    if (response.data) {
      // 将获取的统计数据赋值给element.statistics
      element.statistics = [
        { label: '最大值', value: response.data.max[parameter] },
        { label: '最小值', value: response.data.min[parameter] },
        { label: '平均值', value: response.data.average[parameter] },
        { label: '标准差', value: response.data.stddev[parameter] },
        { label: '置信区间', value: response.data.confidence_interval[parameter].join(", ") }
      ];
    }
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // 如果请求失败，可以设置一些默认值或显示错误信息
    const element = elements.value.find(el => el.key === parameter);
    element.statistics = [{ label: 'Error', value: 'Failed to fetch data' }];
  }
};


const fetchData = async (parameter, start_time, end_time) => {
  try {
    const response = await axios.post('http://localhost:8000/seb16/query', {
      start_time,
      end_time,
      parameters: [parameter, 'Time']
    });
    const element = elements.value.find(el => el.key === parameter);
    element.chartData = formatChartData(response.data.data, parameter);
    // Assume fetchStatistics is a similar function that updates element.statistics
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const formatChartData = (data, label) => {
  return {
    labels: data.map(item => item.Time),
    datasets: [{
      label,
      data: data.map(item => item[label]),
      fill: false,
      borderColor: 'blue'
    }]
  };
};

onMounted(() => {
  fetchAllData();
});
</script>

<style scoped>
.demo-date-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 20px;
  width: 50%;
}

.card-box {
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.chart {
  width: 100%;
  height: 100%;
}

.mb-6 {
  margin-top: 20px;
}

.right-align-button {
  margin-left: auto;
}

.el-statistic {
  --el-statistic-content-font-size: 20px;
}



.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}
</style>
