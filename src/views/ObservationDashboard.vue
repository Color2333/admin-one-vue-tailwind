<template>
    <div class="bg">
        <!-- 顶部 -->
        <div class="header">
            <span class="header-title">海洋气象观测数据</span>
            <span class="header-text">综合监控平台</span>
        </div>
        <!-- 内容 -->
        <div class="wrap">
            <!-- 左侧 -->
            <div class="left fl">
                <div class="left-header">
                    <span style="font-size: large;font-weight: bolder; margin-left: 5px;">风速（已校正）</span>
                    <div class="gauge-container" ref="gaugeRef"
                        style="display: flex; justify-content: space-around; margin-top: -80px;">
                        <div ref="gauge1Ref" style="flex: 1; height: 100%;">
                        </div>
                        <div ref="gauge2Ref" style="flex: 1; height: 100%;">
                        </div>
                    </div>
                </div>
                <div class="left-mid">
                    <span style="font-size: large;font-weight: bolder; margin-left: 5px;">温度和湿度</span>
                    <div class="gauge-container" ref="gaugeRef"
                        style="display: flex; justify-content: space-around; margin-top: -80px;">
                        <div ref="gauge3Ref" style="flex: 1; height: 100%;"></div>
                        <div ref="gauge4Ref" style="flex: 1; height: 100%;"></div>
                    </div>
                </div>
                <div class="left-bottom">
                    <span style="font-size: large;font-weight: bolder; margin-left: 5px;">风速变化</span>
                    <div ref="mainChartRef" style="width: 100%; height: 300px;"></div>
                </div>
            </div>
            <!-- 中间 -->
            <div class="center fl">
                <!-- 地图 -->
                <div class="center-map">
                    <div><img src="../../img/datu.jpg" style="width:100%;height:100%;" /></div>
                </div>
                <!-- 离线清单 -->
                <div class="center-offline">
                    <div class="center-offline-header">
                        <p>仪器列表</p>
                    </div>
                    <div class="center-offline-mid">
                        <table class="styled-table">
                            <thead>
                                <tr>
                                    <th>仪器名称</th>
                                    <th>仪器编号</th>
                                    <th>数据来源</th>
                                    <th>测量要素</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>SEB16</td>
                                    <td>10903</td>
                                    <td>东海海底观测试验系统四脚架观测平台</td>
                                    <td>温度、电导率 压力等</td>
                                </tr>
                                <tr>
                                    <td>SEB26</td>
                                    <td>10905</td>
                                    <td>东海海底观测试验系统四脚架观测平台</td>
                                    <td>深度、温度 、浊度等</td>
                                </tr>
                                <tr>
                                    <td>气象观测仪</td>
                                    <td>NULL</td>
                                    <td>浮标</td>
                                    <td>风速、风向、温度等</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- 右侧 -->
            <div class="right fr">
                <span class="right-title">站点信息</span>
                <div class="right-top">
                    <div class="right-top-content">
                        <span class="name">站名:</span>
                        <span class="text">浮标</span>
                    </div>
                    <div class="right-top-content">
                        <span class="name">编号:</span>
                        <span class="text">NULL</span>
                    </div>
                    <div class="right-top-content">
                        <span class="name">传感器:</span>
                        <span class="text">气象观测仪</span>
                    </div>
                    <div class="right-top-content">
                        <span class="name">采样频率:</span>
                        <span class="text">1s</span>
                    </div>
                </div>
                <div class="right-mid">
                    <div class="right-mid-header">
                        实时数据
                    </div>
                    <div class="right-mid-scroll">
                        <div class="right-mid-content">
                            <!-- Dynamically create data entries -->
                            <div v-for="(value, key) in weatherData" :key="key" class="right-top-content">
                                <span class="name">{{ key }}:</span>
                                <span class="text">{{ value }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-bottom">
                    <div class="right-mid-header">
                        实时监控
                    </div>
                    <div ref="polarChartRef" style="width: 100%; height: 300px;"></div> <!-- Chart container -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
const setBaseFontSize = () => {
    const html = document.documentElement;
    const width = window.innerWidth;
    const fontSize = width / 100;  // This means 1 rem = 1% of the viewport width
    html.style.fontSize = `${fontSize}px`;
};

onMounted(() => {
    window.addEventListener('resize', setBaseFontSize);
    setBaseFontSize(); // Set initial size on load
});

onUnmounted(() => {
    window.removeEventListener('resize', setBaseFontSize);
});

const weatherData = ref({});
const gauge1Ref = ref(null);
const gauge2Ref = ref(null);
const windSpeed1 = ref(0);
const windSpeed2 = ref(0);
let gauge1Chart = null;
let gauge2Chart = null;
const polarChartRef = ref(null);
const windDirection1 = ref(90);  // Example static value for testing
const windDirection2 = ref(180); // Example static value for testing
let polarChart = null;
const gauge3Ref = ref(null);
const gauge4Ref = ref(null);
let gauge3Chart = null;
let gauge4Chart = null;
const mainChartRef = ref(null);
let mainChart = null;

let ws;

function connectWebSocket() {
    const url = 'ws://10.50.31.240:8083/fb2/qixiang';
    ws = new WebSocket(url);

    ws.onopen = () => {
        console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        updateWeatherData(message);
    };

    ws.onerror = (error) => {
        console.error('WebSocket Error: ', error);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
        // Optionally try to reconnect or handle closure
    };
}
function initGauges() {
    if (gauge1Ref.value && !gauge1Chart) {
        gauge1Chart = echarts.init(gauge1Ref.value);
    }
    if (gauge2Ref.value && !gauge2Chart) {
        gauge2Chart = echarts.init(gauge2Ref.value);
    }

    const commonOptions = {
        title: { show: true, color: 'white' },
        type: 'gauge',
        progress: {
            show: true
        },
        detail: { formatter: '{value} m/s', valueAnimation: true, color: 'white', fontSize: 16, offsetCenter: [0, '70%'] },
        axisLine: { lineStyle: { width: 8 } },
        axisTick: { show: true },
        splitLine: { show: true },
        axisLabel: { show: true, color: 'white' }, // Changed color to white
        max: 5,
        min: 0,
    };

    gauge1Chart.setOption({
        series: [{ ...commonOptions, data: [{ value: windSpeed1.value, name: 'Wind Speed 1', itemStyle: { color: '#FF6347' } }] }]
    });
    gauge2Chart.setOption({
        series: [{ ...commonOptions, data: [{ value: windSpeed2.value, name: 'Wind Speed 2', itemStyle: { color: '#4682B4' } }] }]
    });
}
function initPolarChart() {
    if (polarChartRef.value) {
        polarChart = echarts.init(polarChartRef.value);
        const options = {
            polar: {},
            angleAxis: {
                type: 'value',
                min: 0,
                max: 360,
                startAngle: 90,
                axisLabel: {
                    color: 'white' // Set the color of the angle axis labels to white
                }
            },
            radiusAxis: {
                min: 0,
                max: 100,
                axisLabel: {
                    color: 'white' // Set the color of the radius axis labels to white
                }
            },
            series: [{
                type: 'bar',
                data: [
                    { value: [0, windDirection1.value], itemStyle: { color: '#FF6347' } }, // Tomato color for Wind Direction 1
                    { value: [0, windDirection2.value], itemStyle: { color: '#4682B4' } } // SteelBlue color for Wind Direction 2
                ],
                coordinateSystem: 'polar',
                name: 'Wind Direction',
                label: {
                    show: true,
                    color: 'white',
                    formatter: '{b}: {c}°'
                }
            }]
        };
        polarChart.setOption(options);
        console.log('Polar chart initialized with dynamic data.');
    } else {
        console.error('Polar chart element is not available.');
    }
}
function initChart() {
    if (mainChartRef.value) {
        mainChart = echarts.init(mainChartRef.value);
        mainChart.setOption({
            title: {
                text: '实时风速数据',
                show: false
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            textStyle: {
                color: 'white'
            },
            xAxis: {
                type: 'category',
                data: [],
                label: {
                    color: 'white' // Set the color of the x-axis labels to white
                }
            },
            yAxis: {
                type: 'value',
                name: '风速 (m/s)',
                min: 0,
                max: 5,
                label: {
                    color: 'white' // Set the color of the y-axis labels to white
                }
            },
            legend: {
                data: ['风速1', '风速2'],
                label: { color: 'white' }
            },
            series: [{
                name: '风速1',
                type: 'line',
                data: [],
                color: '#FF6347'
            }, {
                name: '风速2',
                type: 'line',
                data: [],
                color: '#4682B4'
            }]
        });
    }
}

function updateWeatherData(data) {
    // Parsing and assigning data received to weatherData reactive reference
    weatherData.value = {
        '接收时间': data.receiveTime,
        '设备采集时间': data.deviceTime,
        '第一台风向风速仪_风向未校正': `${data.wind_direction_uncorrected_1}°`,
        '第二台风向风速仪_风向未校正': `${data.wind_direction_uncorrected_2}°`,
        '第一台风向风速仪_风向_已校正': `${data.wind_direction_1}°`,
        '第二台风向风速仪_风向_已校正': `${data.wind_direction_2}°`,
        '第一台风向风速仪风速': `${data.wind_speed_1} m/s`,
        '第二台风向风速仪风速': `${data.wind_speed_2} m/s`,
        '第一台仪器的气温': `${data.air_temperature_1}°C`,
        '第一台仪器的相对湿度': `${data.relative_humidity_1}%`,
        '气压传感器数据': `${data.atmospheric_pressure} hPa`
    };
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    windSpeed1.value = parseFloat(data.wind_speed_1);
    windSpeed2.value = parseFloat(data.wind_speed_2);
    windDirection1.value = parseFloat(data.wind_direction_1);
    windDirection2.value = parseFloat(data.wind_direction_2);
    gauge1Chart.setOption({
        series: [{ data: [{ value: windSpeed1.value }] }]
    });
    gauge2Chart.setOption({
        series: [{ data: [{ value: windSpeed2.value }] }]
    });
    if (polarChart) {
        polarChart.setOption({
            series: [{
                data: [
                    { value: windDirection1.value, name: 'Wind Direction 1', itemStyle: { color: '#FF6347' } },
                    { value: windDirection2.value, name: 'Wind Direction 2', itemStyle: { color: '#4682B4' } }
                ]
            }]
        });
    }
    gauge3Chart.setOption({
        series: [{
            data: [{ value: parseFloat(data.air_temperature_1), name: 'Temperature' }]
        }]
    });

    gauge4Chart.setOption({
        series: [{
            data: [{ value: parseFloat(data.relative_humidity_1), name: 'Humidity' }]
        }]
    });
    if (mainChart) {
        const option = mainChart.getOption();
        option.xAxis[0].data.push(timeStr);
        option.series[0].data.push(windSpeed1.value);
        option.series[1].data.push(windSpeed2.value);

        if (option.xAxis[0].data.length > 20) {
            option.xAxis[0].data.shift();
            option.series[0].data.shift();
            option.series[1].data.shift();
        }

        mainChart.setOption(option);
    }
}
onMounted(() => {
    initGauges();
    initPolarChart();
    initChart();
    window.addEventListener('resize', () => {
        if (polarChart) {
            polarChart.resize();
        }
    });
    if (gauge3Ref.value) {
        gauge3Chart = echarts.init(gauge3Ref.value);
        gauge3Chart.setOption({
            series: [{
                type: 'gauge',
                center: ['50%', '60%'],
                startAngle: 200,
                endAngle: -20,
                min: 0,
                max: 60,
                itemStyle: {
                    color: '#FFAB91'
                },
                progress: {
                    show: true,
                    width: 30
                },
                pointer: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        width: 30
                    }
                },
                axisTick: {
                    distance: -45,
                    splitNumber: 5,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                splitLine: {
                    distance: -52,
                    length: 14,
                    lineStyle: {
                        width: 3,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: 10,
                    color: 'white',
                    fontSize: 10
                },
                anchor: {
                    show: false
                },
                title: {
                    show: true,
                    color: 'white'
                },
                detail: {
                    valueAnimation: true,
                    width: '60%',
                    lineHeight: 40,
                    borderRadius: 8,
                    offsetCenter: [0, '-15%'],
                    fontSize: 20,
                    fontWeight: 'bolder',
                    formatter: '{value} °C',
                    color: 'inherit'
                },
                data: [{
                    value: 20
                }]
            }]
        });
    }

    if (gauge4Ref.value) {
        gauge4Chart = echarts.init(gauge4Ref.value);
        gauge4Chart.setOption({
            series: [{
                type: 'gauge',
                center: ['50%', '60%'],
                startAngle: 200,
                endAngle: -20,
                min: 0,
                max: 100,  // Assume the max value for humidity is 100%
                itemStyle: {
                    color: '#00FF00'  // Green for humidity
                },
                progress: {
                    show: true,
                    width: 30
                },
                pointer: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        width: 30
                    }
                },
                axisTick: {
                    distance: -45,
                    splitNumber: 5,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                splitLine: {
                    distance: -52,
                    length: 14,
                    lineStyle: {
                        width: 3,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: 10,
                    color: 'white',
                    fontSize: 10
                },
                anchor: {
                    show: false
                },
                title: {
                    show: true,
                    color: 'white'
                },
                detail: {
                    valueAnimation: true,
                    width: '60%',
                    lineHeight: 40,
                    borderRadius: 8,
                    offsetCenter: [0, '-15%'],
                    fontSize: 20,
                    fontWeight: 'bolder',
                    formatter: '{value} %',
                    color: 'inherit'
                },
                data: [{
                    value: 40  // Assume an initial value for humidity
                }]
            }]
        });
    }
    connectWebSocket();
});

onUnmounted(() => {
    if (gauge1Chart) gauge1Chart.dispose();
    if (gauge2Chart) gauge2Chart.dispose();
    if (gauge3Chart) gauge3Chart.dispose();
    if (gauge4Chart) gauge4Chart.dispose();
    if (mainChart) {
        mainChart.dispose();
    }
    polarChart.dispose();
    if (ws) ws.close();
});
</script>


<style scoped>
.styled-table {
    width: 100%;
    border-collapse: collapse;
    background-color: transparent;
}

.styled-table th {
    color: white;
    font-weight: bold;
    font-size: large;
}

.styled-table td {
    color: white;
}

.styled-table th,
.styled-table td {
    padding: 0.5rem;
    text-align: left;
}

.styled-table thead tr {
    background-color: transparent;
}

.styled-table tbody tr:nth-child(even) {
    background-color: transparent;
}


/* CSS Reset */
body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
hr,
ul,
ol,
li,
dl,
dt,
dd,
tr,
th,
td,
form,
fieldset,
legend,
input,
button,
select,
textarea,
pre {
    padding: 0;
    margin: 0;
}

.chart-container {
    flex: 1;
    /* Takes up all available space */
    min-height: 0;
    /* Prevents overflow in flex containers */
}

/* 重置默认样式 */
body,
button,
input,
select,
textarea {
    color: #333;
    font: 12px/1 "Microsoft YaHei", Tahoma, Helvetica, Arial, SimSun, sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-size: 100%;
    font-weight: normal;
}

em,
i {
    font-style: normal;
}

a {
    text-decoration: none;
}

li {
    list-style-type: none;
    vertical-align: top;
}

/* 公共样式 */
.fl {
    float: left;
    display: inline;
}

.fr {
    float: right;
    display: inline;
}

.cf:before,
.cf:after {
    content: " ";
    display: table;
}

.cf:after {
    clear: both;
}

html {
    overflow-x: hidden;
}


/* 大屏样式 */
.bg {
    background: url('../img/beijing.png') no-repeat;
    background-size: cover;
    width: 100vw;
    height: 100vh;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 2rem;
    box-sizing: border-box;
}

.header {
    background: url('../img/header.png') no-repeat center center;
    width: 75%;
    height: 5.5rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    padding-right: 1.8rem;
    box-sizing: border-box;
}

.header-title {
    font-size: 1.2rem;
    color: #fff;
    padding-top: 1rem;
    display: block;
    letter-spacing: 0.2rem;
    font-weight: 600;
}

.header-text {
    font-size: 0.9rem;
    display: block;
    color: #fff;
    padding-top: 0.3rem;
    letter-spacing: 0.2rem;
    font-weight: 600;
}

/* 内容区域 */
.wrap {
    position: absolute;
    top: 7.3rem;
    display: flex;
    justify-content: space-between;
    width: 100%;
}

/* 左侧样式 */
.left {
    margin-right: 1.3rem;
}

.left-mid,
.left-bottom,
.left-header {
    background: url('../img/kuang4.png') no-repeat;
    background-size: cover;
    width: 24rem;
    height: 15rem;
}

.left-bottom span,
.left-mid span,
.left-header span {
    color: #2b8fff;
    font-size: 0.7rem;
}

/* 中间样式 */
.center {
    margin-right: 1.3rem;
}

.center-map {
    width: 43rem;
    height: 27.3rem;
    border: 1px solid #43dcff;
    margin-bottom: 1rem;
    padding: 1rem;
    box-sizing: border-box;
}

.center-offline {
    width: 43rem;
}

.center-offline-header {
    width: 100%;
    height: 3.5rem;
    background: url('../img/kuang3.png') no-repeat center center;
    background-size: cover;
    text-align: center;
}

.center-offline-header p {
    font-size: 1.4rem;
    color: #fff;
    line-height: 3.5rem;
    letter-spacing: 0.2rem;
}

.center-offline-mid {
    width: 100%;
    height: 11.1rem;
    box-sizing: border-box;
    background-color: rgba(15, 52, 129, 0.3);
}

.title {
    height: 1.5rem;
    margin-bottom: 1.3rem;
}

.sit {
    text-align: center;
    width: 25%;
}

.sit-title {
    font-size: 1rem;
    color: #52d2ff;
}

.list {
    height: 6.8rem;
    overflow: hidden;
}

.list-item {
    height: 1.4rem;
}

.sit-item {
    font-size: 0.9rem;
    color: #fff;
    width: 25%;
    text-align: center;
}

.center-offline-bottom {
    width: 100%;
    height: 2.3rem;
    background-color: #04153b;
    text-align: center;
}

.center-offline-bottom p {
    color: #fff;
    line-height: 2.3rem;
}

/* 右侧样式 */
.right {
    width: 24rem;
    height: 46.8rem;
    background: url('../img/kuang2.png') no-repeat;
    background-size: cover;
}

.right .right-title {
    display: inline-block;
    color: #2b8fff;
    font-size: 0.8rem;
    font-weight: 600;
    padding-top: 0.3rem;
    padding-left: 0.9rem;
    letter-spacing: 0.4rem;
}

.right-top {
    padding: 0 0 0 1rem;
}

.right-top-content {
    margin-top: 0.8rem;
}

.right-top:nth-last-child(1) {
    margin-top: none;
}

.right-top-content .name {
    font-size: 0.9rem;
    color: #52d2ff;
    margin-right: 0.5rem;
}

.right-top-content .text {
    font-size: 0.7rem;
    color: #fff;
}

.right-mid {
    margin-top: 1rem;
}

.right-mid-header {
    background: url('../img/jianbian.png') no-repeat;
    background-size: cover;
    width: 100%;
    height: 2.2rem;
    text-align: left;
    line-height: 2.2rem;
    color: #00ffff;
    font-size: 0.9rem;
    padding-left: 1rem;
    box-sizing: border-box;
    font-weight: 500;
}

.right-mid-scroll {
    padding-left: 1rem;
    margin-top: 1rem;
    height: 14.1rem;
    width: 90%;
    box-sizing: border-box;
    overflow-y: scroll;
}

.right-mid-content {
    width: 100%;
    height: 20.2rem;
}

.right-bottom-content {
    width: 21.9rem;
    height: 13.6rem;
    margin: 0.4rem 1rem 0.3rem 1rem;
    padding: 0.2rem 0.5rem;
    box-sizing: border-box;
    border: 1px solid #43dcff;
    overflow: hidden;
}

.right-bottom-content img {
    width: 100%;
    height: 98%;
}

/* 历史记录 */
.history {
    display: block;
    margin-top: 0.3rem;
    width: 100%;
    font-size: 0.7rem;
    color: #4b7ae2;
    text-align: center;
    margin-bottom: 0.5rem;
}

.history-pic {
    display: block;
    width: 100%;
    font-size: 0.7rem;
    color: #4b7ae2;
    text-align: center;
}

.gauge-container {
    width: 100%;
    height: 400px;
    /* Adjust based on your layout needs */
}

/* 去除水印 */
.anchorBL {
    display: none;
}
</style>