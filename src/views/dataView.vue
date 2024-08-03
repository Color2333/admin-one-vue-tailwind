<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiTableBorder" title="数据分析" main />
            <NotificationBar color="info" :icon="mdiMonitorCellphone">
                <b>Responsive table.</b> Collapses on mobile
            </NotificationBar>
            <SectionTitleLineWithButton :icon="mdiChartPie" title="选择日期范围" />
            <CardBox class="mb-6">
                <div>
                    <el-cascader v-model="selectedValue" :options="options" />
                    <el-date-picker v-model="dateRange" type="datetimerange" start-placeholder="Start date"
                        end-placeholder="End date" format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd"
                        time-format="A hh:mm:ss" />
                    <el-button @click="fetchAllData">更新图表</el-button>
                </div>
            </CardBox>

            <SectionTitleLineWithButton :icon="mdiChartPie" title="数据图表" />
            <CardBox class="mb-6" height="600px">
                <line-chart :data="chartData" height="600px" />
            </CardBox>
            <SectionTitleLineWithButton :icon="mdiChartPie" title="异常值捕获" />
            <CardBox class="mb-6">
                <line-chart :data="data_outlier" height="600px"></line-chart>
            </CardBox>
            <SectionTitleLineWithButton :icon="mdiChartPie" title="相关度分析" />
            <CardBox class="mb-6">
                <div>
                    <el-select v-model="selectedSensor" placeholder="请选择传感器" @change="handleSensorChange">
                        <el-option v-for="item in sensors" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="selectedParameters" :disabled="!selectedSensor" multiple placeholder="请选择参数">
                        <el-option v-for="param in availableParameters" :key="param" :label="param" :value="param">
                        </el-option>
                    </el-select>
                    <el-button @click="performCorrelationAnalysis">Analyze Correlation</el-button>
                    <el-button @click="fetchTimeSeriesData">Plot Time Series</el-button>
                </div>
            </CardBox>
            <CardBox class="mb-6">
                <div id="correlationChart" style="height: 600px;"></div>
            </CardBox>
            <CardBox class="mb-6" v-if="timeSeriesData.length > 0">
                <line-chart :data="prepareScaledTimeSeriesChartOptions(timeSeriesData)" height="600px"></line-chart>
            </CardBox>
            <CardBox>
                <CardBoxComponentEmpty />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { mdiMonitorCellphone, mdiTableBorder, mdiChartPie } from '@mdi/js';
import axios from 'axios';
import SectionMain from '@/components/SectionMain.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import CardBox from '@/components/CardBox.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import LineChart from '@/components/Charts/LineChart.vue';
import * as echarts from 'echarts';
import { ElCascader, ElDatePicker, ElButton, ElSelect, ElOption } from 'element-plus';

const options = ref([
    {
        value: 'SEB16',
        label: 'SEB16',
        children: [
            { value: 'Temp', label: 'Temperature' },
            { value: 'Conductivity', label: 'Conductivity' },
            { value: 'Strains', label: 'Strains' },
            { value: 'First_external_voltage', label: 'First External Voltage' },
            { value: 'Second_external_voltage', label: 'Second External Voltage' },
            { value: 'DO', label: 'Dissolved Oxygen' },
            { value: 'Chlorophyll', label: 'Chlorophyll' }
        ],
    },
    {
        value: 'SEB26',
        label: 'SEB26',
        children: [
            { value: 'Depth', label: 'Depth' },
            { value: 'Temp', label: 'Temperature' },
            { value: 'Turbidity', label: 'Turbidity' }
        ],
    },
    {
        value: 'weather_observer',
        label: 'Weather Observer',
        children: [
            { value: 'Wind_direction_uncorrected_1', label: 'Wind Direction Uncorrected 1' },
            { value: 'Wind_direction_uncorrected_2', label: 'Wind Direction Uncorrected 2' },
            { value: 'Wind_direction_1', label: 'Wind Direction 1' },
            { value: 'Wind_direction_2', label: 'Wind Direction 2' },
            { value: 'Wind_speed_1', label: 'Wind Speed 1' },
            { value: 'Wind_speed_2', label: 'Wind Speed 2' },
            { value: 'Air_temperature_1', label: 'Air Temperature 1' },
            { value: 'Relative_humidity_1', label: 'Relative Humidity 1' },
            { value: 'Atmospheric_pressure', label: 'Atmospheric Pressure' }
        ],
    },
]);

const sensors = [
    { value: 'SEB16', label: 'SEB16' },
    { value: 'SEB26', label: 'SEB26' },
    { value: 'weather_observer', label: 'Weather Observer' }
];

const parameters = {
    SEB16: ['Temperature', 'Conductivity', 'Strains', 'First External Voltage', 'Second External Voltage', 'Dissolved Oxygen', 'Chlorophyll'],
    SEB26: ['Depth', 'Temperature', 'Turbidity'],
    weather_observer: ['Wind Direction Uncorrected 1', 'Wind Direction Uncorrected 2', 'Wind Direction 1', 'Wind Direction 2', 'Wind Speed 1', 'Wind Speed 2', 'Air Temperature 1', 'Relative Humidity 1', 'Atmospheric Pressure']
};


const selectedSensor = ref(null);
const selectedParameters = ref([]);
const availableParameters = ref([]);

watch(selectedSensor, (newSensor) => {
    availableParameters.value = parameters[newSensor] || [];
    selectedParameters.value = [];
});

function handleSensorChange(value) {
    console.log('Sensor changed:', value);
}

const selectedValue = ref([]);
const dateRange = ref(['2018-03-01T16:00:00.000Z', '2018-03-01T17:00:00.000Z']);
const chartData = ref([]);
const data_outlier = ref([]);
const timeSeriesData = ref([]);

function fetchAllData() {
    if (selectedValue.value.length === 0 || !dateRange.value) {
        alert('Please select all required options.');
        return;
    }
    const [sensor, parameter] = selectedValue.value;
    const [startDate, endDate] = dateRange.value;
    const apiUrl = getApiUrl(sensor);
    const timeParameter = sensor === 'weather_observer' ? 'DeviceTime' : 'Time';

    axios.post(apiUrl, {
        start_time: startDate,
        end_time: endDate,
        parameters: [parameter, timeParameter]
    }).then(response => {
        const formattedData = formatChartData(response.data.data, parameter);
        chartData.value = formattedData;
        data_outlier.value = formatChartDataWithThresholds(response.data.data, parameter);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}

const formatChartData = (data, label) => {
    return {
        labels: data.map(item => item.Time),
        datasets: [{
            label: label,
            data: data.map(item => item[label]),
            fill: false,
            borderColor: 'blue'
        }]
    };
};

const formatChartDataWithThresholds = (data, label) => {
    const processedData = detectOutliers(data, label);
    const values = processedData.map(item => item[label]);
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
    const stdDev = Math.sqrt(values.map(val => Math.pow(val - mean, 2)).reduce((acc, val) => acc + val, 0) / values.length);
    const upperThreshold = mean + 3 * stdDev;
    const lowerThreshold = mean - 3 * stdDev;

    return {
        labels: processedData.map(item => item.Time),
        datasets: [
            {
                label: label,
                data: processedData.map(item => item[label]),
                fill: false,
                borderColor: 'blue',
                pointBackgroundColor: processedData.map(item => item.outlier ? 'red' : 'blue'),
                pointRadius: processedData.map(item => item.outlier ? 5 : 3)
            },
            {
                label: 'Upper Threshold',
                data: Array(processedData.length).fill(upperThreshold),
                borderColor: 'green',
                borderWidth: 2,
                borderDash: [10, 5]
            },
            {
                label: 'Lower Threshold',
                data: Array(processedData.length).fill(lowerThreshold),
                borderColor: 'green',
                borderWidth: 2,
                borderDash: [10, 5]
            }
        ]
    };
};

function detectOutliers(data, label) {
    const values = data.map(item => item[label]);
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
    const stdDev = Math.sqrt(values.map(val => Math.pow(val - mean, 2)).reduce((acc, val) => acc + val, 0) / values.length);
    const threshold = 3;

    return data.map((item, index) => ({
        ...item,
        outlier: Math.abs(item[label] - mean) > threshold * stdDev
    }));
}

const correlationResult = ref(null);
let correlationChart = null;

async function performCorrelationAnalysis() {
    if (selectedParameters.value.length < 2) {
        alert("Please select at least two parameters to analyze their correlation.");
        return;
    }
    const [startDate, endDate] = dateRange.value;
    const sensor = selectedSensor.value;

    try {
        const response = await axios.post('http://localhost:8000/compute_correlation', {
            sensor: sensor,
            start_time: startDate,
            end_time: endDate,
            parameters: selectedParameters.value
        });
        correlationResult.value = response.data.correlations;
        renderCorrelationChart();
        console.log(response.data.correlations);

    } catch (error) {
        console.error("Failed to fetch correlation data:", error.response ? error.response.data : error);
        alert("Failed to perform correlation analysis. Check the console for more details.");
    }
}

async function fetchTimeSeriesData() {
    if (selectedParameters.value.length < 2) {
        alert("Please select at least two parameters to plot their time series.");
        return;
    }
    const [startDate, endDate] = dateRange.value;
    const sensor = selectedSensor.value;
    const apiUrl = getApiUrl(sensor);
    const timeParameter = sensor === 'weather_observer' ? 'DeviceTime' : 'Time';

    try {
        const response = await axios.post(apiUrl, {
            start_time: startDate,
            end_time: endDate,
            parameters: [timeParameter, ...selectedParameters.value]
        });
        if (response.data && response.data.data) {
            timeSeriesData.value = response.data.data;
        } else {
            timeSeriesData.value = [];
            console.error("Invalid time series data format");
        }
    } catch (error) {
        console.error("Failed to fetch time series data:", error.response ? error.response.data : error);
        alert("Failed to fetch time series data. Check the console for more details.");
    }
}


function prepareScaledTimeSeriesChartOptions(data) {
    if (!data || data.length === 0) {
        return { labels: [], datasets: [] };
    }

    const labels = data.map(item => item.Time);

    const scaleData = (values) => {
        const min = Math.min(...values);
        const max = Math.max(...values);
        return values.map(value => (value - min) / (max - min));
    };

    const datasets = selectedParameters.value.map(param => ({
        label: param,
        data: scaleData(data.map(item => item[param])),
        fill: false,
        borderColor: getRandomColor()
    }));

    return {
        labels: labels,
        datasets: datasets
    };
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getApiUrl(sensor) {
    switch (sensor) {
        case 'SEB16':
            return 'http://localhost:8000/seb16/query';
        case 'SEB26':
            return 'http://localhost:8000/seb26/query';
        case 'weather_observer':
            return 'http://localhost:8000/weather_observer/query';
        default:
            throw new Error('Invalid sensor selected');
    }
}

onMounted(() => {
    nextTick(() => {
        correlationChart = echarts.init(document.getElementById('correlationChart'));
        if (correlationResult.value) {
            renderCorrelationChart();
        }
    });
});

watch(correlationResult, () => {
    if (correlationResult.value && correlationChart) {
        renderCorrelationChart();
    }
});

function renderCorrelationChart() {
    if (!correlationResult.value || !correlationChart) return;

    const labels = selectedParameters.value;
    const flatData = [];
    for (let i = 0; i < correlationResult.value.length; i++) {
        for (let j = 0; j < correlationResult.value[i].length; j++) {
            flatData.push([j, i, correlationResult.value[i][j]]);
        }
    }

    const options = {
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return `${labels[params.value[1]]} vs ${labels[params.value[0]]}: ${params.value[2].toFixed(2)}`;
            }
        },
        visualMap: {
            min: -1,
            max: 1,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            top: 'top',
            color: ['#d94e5d', '#eac736', '#50a3ba'],
        },
        xAxis: {
            type: 'category',
            data: labels
        },
        yAxis: {
            type: 'category',
            data: labels
        },
        series: [{
            name: '相关性',
            type: 'heatmap',
            data: flatData,
            label: {
                show: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

    correlationChart.setOption(options);
}
</script>
