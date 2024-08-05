<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiTableBorder" title="数据分析" main />
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
            <CardBox class="mb-6" height="600px">
                <el-select v-model="chartType" placeholder="请选择图表类型" style="margin-bottom: 10px;width:50%">
                    <el-option label="柱状图" value="bar"></el-option>
                    <el-option label="环形图" value="pie"></el-option>
                </el-select>
                <el-button @click="fetchAllData" style="margin-bottom: 10px;">更新图表</el-button>
                <div id="dataCompositionChart" style="width: 100%; height: 600px;"></div>
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
                    <el-button @click="performCorrelationAnalysis">分析相关度</el-button>
                    <el-button @click="fetchTimeSeriesData">绘制时间序列图</el-button>
                </div>
            </CardBox>
            <CardBox class="mb-6">
                <div id="correlationChart" style="height: 600px;"></div>
            </CardBox>
            <CardBox class="mb-6" v-if="timeSeriesData.length > 0">
                <line-chart :data="prepareScaledTimeSeriesChartOptions(timeSeriesData)" height="600px"></line-chart>
            </CardBox>
            <CardBox class="mb-6" v-if="showScatterChart">
                <div id="scatterChart" style="height: 600px;"></div>
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
    SEB16: ['Temp', 'Conductivity', 'Strains', 'First_external_voltage', 'Second_external_voltage', 'DO', 'Chlorophyll'],
    SEB26: ['Depth', 'Temp', 'Turbidity'],
    weather_observer: ['Wind_direction_uncorrected_1', 'Wind_direction_uncorrected_2', 'Wind_direction_1', 'Wind_direction_2', 'Wind_speed_1', 'Wind_speed_2', 'Air_temperature_1', 'Relative_humidity_1', 'Atmospheric_pressure']
};

const selectedSensor = ref(null);
const selectedParameters = ref([]);
const availableParameters = ref([]);
const chartType = ref('bar');

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
const scatterData = ref([]);
const showScatterChart = ref(false);

function fetchAllData() {
    if (selectedValue.value.length === 0 || !dateRange.value) {
        alert('请至少选择一个参数');
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
        renderDataCompositionChart(response.data.data);
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
                label: '上界阈值',
                data: Array(processedData.length).fill(upperThreshold),
                borderColor: 'green',
                borderWidth: 2,
                borderDash: [10, 5]
            },
            {
                label: '下界阈值',
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

function renderDataCompositionChart(data) {
    const values = data.map(item => item[selectedValue.value[1]]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const step = (max - min) / 5;

    const distribution = [0, 0, 0, 0, 0];
    values.forEach(value => {
        if (value < min + step) {
            distribution[0]++;
        } else if (value < min + 2 * step) {
            distribution[1]++;
        } else if (value < min + 3 * step) {
            distribution[2]++;
        } else if (value < min + 4 * step) {
            distribution[3]++;
        } else {
            distribution[4]++;
        }
    });

    const dataCompositionChart = echarts.init(document.getElementById('dataCompositionChart'));
    const option = {
        title: {
            text: '数据组成分析',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        xAxis: chartType.value === 'bar' ? {
            type: 'category',
            data: ['0-' + (min + step), (min + step) + '-' + (min + 2 * step), (min + 2 * step) + '-' + (min + 3 * step), (min + 3 * step) + '-' + (min + 4 * step), (min + 4 * step) + '-' + max]
        } : undefined,
        yAxis: chartType.value === 'bar' ? { type: 'value' } : undefined,
        series: [
            {
                name: '数据分布',
                type: chartType.value,
                radius: chartType.value === 'pie' ? '50%' : undefined,
                data: chartType.value === 'bar' ? distribution : [
                    { value: distribution[0], name: `0-${min + step}` },
                    { value: distribution[1], name: `${min + step}-${min + 2 * step}` },
                    { value: distribution[2], name: `${min + 2 * step}-${min + 3 * step}` },
                    { value: distribution[3], name: `${min + 3 * step}-${min + 4 * step}` },
                    { value: distribution[4], name: `${min + 4 * step}-${max}` }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    dataCompositionChart.setOption(option);
}

const correlationResult = ref(null);
let correlationChart = null;
let scatterChart = null;
let scatterChartInitialized = false;

async function performCorrelationAnalysis() {
    if (selectedParameters.value.length < 2) {
        alert("参数选择足够后才能显示计算结果");
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
        alert("至少选取两个参数才可以");
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
            scatterData.value = response.data.data;
            showScatterChart.value = true;
            nextTick(() => {
                if (!scatterChartInitialized) {
                    scatterChart = echarts.init(document.getElementById('scatterChart'));
                    scatterChartInitialized = true;
                }
                renderScatterChart();
            });
        } else {
            timeSeriesData.value = [];
            scatterData.value = [];
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

function renderScatterChart() {
    if (!scatterData.value || !scatterChart) return;

    const [param1, param2] = selectedParameters.value;
    const data = scatterData.value.map(item => [item[param1], item[param2]]);

    // 计算param2的最小值和最大值
    const param2Values = data.map(item => item[1]);
    const minParam2 = Math.min(...param2Values);
    const maxParam2 = Math.max(...param2Values);

    const options = {
        title: {
            text: '相关性散点图',
            left: 'center',
            top: 0
        },
        visualMap: {
            min: minParam2,
            max: maxParam2,
            dimension: 1,
            orient: 'vertical',
            right: 10,
            top: 'center',
            text: ['HIGH', 'LOW'],
            calculable: true,
            inRange: {
                color: ['#f2c31a', '#24b7f2']
            }
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'cross'
            }
        },
        xAxis: {
            type: 'value',
            name: param1,
            scale: true // Enable auto-scaling
        },
        yAxis: {
            type: 'value',
            name: param2,
            scale: true // Enable auto-scaling
        },
        series: [{
            name: `${param1} vs ${param2}`,
            type: 'scatter',
            symbolSize: 5,
            data: data
        }]
    };

    scatterChart.setOption(options);
}

</script>
