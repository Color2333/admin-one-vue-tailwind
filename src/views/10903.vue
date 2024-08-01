<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="SEB16 数据总览" main>
      </SectionTitleLineWithButton>
      <NotificationBar color="info" :icon="mdiMonitorCellphone">
        <b>Responsive table.</b> Collapses on mobile
      </NotificationBar>

      <CardBox class="mb-6" has-table>
        <TableSampleClients />
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiChartPie" title="选择日期范围">
      </SectionTitleLineWithButton>
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
        <SectionTitleLineWithButton :icon="mdiChartPie" :title="element.label">
        </SectionTitleLineWithButton>
        <CardBox class="mb-6">
          <div v-if="element.chartData">
            <line-chart :data="element.chartData" class="h-96" />
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
import { ref, onMounted } from 'vue'
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiReload,
  mdiChartPie
} from '@mdi/js'
import axios from 'axios';
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import TableSampleClients from '@/components/Table10903.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import LineChart from '@/components/Charts/LineChart.vue'
import BaseButton from '@/components/BaseButton.vue'

const elements = ref([
  { key: 'Temp', label: 'Temperature', chartData: null },
  { key: 'Conductivity', label: 'Conductivity', chartData: null },
  { key: 'Strains', label: 'Strains', chartData: null },
  { key: 'First_external_voltage', label: 'First External Voltage', chartData: null },
  { key: 'Second_external_voltage', label: 'Second External Voltage', chartData: null },
  { key: 'DO', label: 'Dissolved Oxygen', chartData: null },
  { key: 'Chlorophyll', label: 'Chlorophyll', chartData: null },
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

.mb-6 {
  margin-top: 20px;
}

.right-align-button {
  margin-left: auto;
}
</style>
