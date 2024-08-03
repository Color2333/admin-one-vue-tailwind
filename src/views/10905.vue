<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="SEB26 数据总览" main />

      <CardBox class="mb-6" has-table>
        <TableSampleClients />
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiChartPie" title="选择日期范围" />
      <CardBox class="mb-6">
        <div class="demo-date-picker">
          <el-date-picker v-model="value" type="datetimerange" start-placeholder="Start date" end-placeholder="End date"
            format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd" time-format="A hh:mm:ss"
            @change="handleDateChange" />
          <BaseButton class="right-align-button" color="info" label="更新图表" @click="fetchSEB26Data" :small="buttonsSmall"
            :outline="buttonsOutline" :disabled="buttonsDisabled" :rounded-full="buttonsRounded" />
        </div>
      </CardBox>

      <div v-for="element in elements" :key="element.key">
        <SectionTitleLineWithButton :icon="mdiChartPie" :title="element.label" />
        <CardBox class="mb-6">
          <div v-if="element.chartData">
            <line-chart :data="element.chartData" class="h-96" />
          </div>
        </CardBox>
        <CardBox class="mb-6">
          <div v-if="element.statistics">
            <el-row :gutter="20">
              <el-col :span="8" v-for="stat in element.statistics" :key="stat.label">
                <div class="statistic-card">
                  <el-statistic :value="stat.value"
                    :formatter="value => typeof value === 'number' ? value.toFixed(4) : value" :title="stat.label" />
                </div>
              </el-col>
            </el-row>
          </div>
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
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiChartPie
} from '@mdi/js';
import axios from 'axios';
import SectionMain from '@/components/SectionMain.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import TableSampleClients from '@/components/Table10905.vue'; // 确保这里的组件是针对SEB26的表格组件
import CardBox from '@/components/CardBox.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import LineChart from '@/components/Charts/LineChart.vue';
import BaseButton from '@/components/BaseButton.vue';

const elements = ref([
  { key: 'Depth', label: 'Depth-深度', chartData: null, statistics: [] },
  { key: 'Temp', label: 'Temperature-温度', chartData: null, statistics: [] },
  { key: 'Turbidity', label: 'Turbidity-浊度', chartData: null, statistics: [] }
]);


const value = ref(['2018-03-01T16:00:00.000Z', '2018-03-01T17:00:00.000Z']);

const buttonsSmall = ref(true);
const buttonsOutline = ref(false);
const buttonsDisabled = ref(false);
const buttonsRounded = ref(true);

const handleDateChange = () => {
  console.log('Date range selected:', value.value);
};

const fetchSEB26Data = async () => {
  const start_time = value.value[0];
  const end_time = value.value[1];
  console.log('Fetching data for range:', start_time, end_time);

  for (let element of elements.value) {
    await fetchElementData(element.key, start_time, end_time);
    await fetchStatistics(element.key, start_time, end_time);
  }
};

const fetchElementData = async (parameter, start_time, end_time) => {
  try {
    const response = await axios.post('http://localhost:8000/seb26/query', {
      start_time,
      end_time,
      parameters: [parameter, 'Time']
    });
    const element = elements.value.find(el => el.key === parameter);
    element.chartData = formatChartData(response.data.data, parameter);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
const fetchStatistics = async (parameter, start_time, end_time) => {
  try {
    // 向后端发送请求，获取统计数据
    const response = await axios.post('http://localhost:8000/seb26/statistics', {
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
  fetchSEB26Data();
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

.mb-6 {
  margin-top: 20px;
}

.right-align-button {
  margin-left: auto;
}
</style>
