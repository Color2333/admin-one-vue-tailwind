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
                    <span>你猜你猜你猜</span>
                </div>
                <div class="left-mid">
                    <span>按观测作物分类</span>
                </div>
                <div class="left-bottom">
                    <span>农业小气候站</span>
                </div>
            </div>
            <!-- 中间 -->
            <div class="center fl">
                <!-- 地图 -->
                <div class="center-map">
                    <div style="width:100%;height:100%;"></div>
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
                        <span class="text">观测站</span>
                    </div>
                    <div class="right-top-content">
                        <span class="name">编号:</span>
                        <span class="text">LOO33</span>
                    </div>
                    <div class="right-top-content">
                        <span class="name">地址:</span>
                        <span class="text">观测站</span>
                    </div>
                    <div class="right-top-content">
                        <span class="name">观测作物:</span>
                        <span class="text">西红柿</span>
                    </div>
                </div>
                <div class="right-mid">
                    <div class="right-mid-header">
                        实时数据
                    </div>
                    <div class="right-mid-scroll">
                        <div class="right-mid-content">
                            <div class="right-top-content">
                                <span class="name">要素数:</span>
                                <span class="text">7</span>
                            </div>
                            <div class="right-top-content">
                                <span class="name">观测时间:</span>
                                <span class="text">2020-03-16 10:40:00</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-bottom">
                    <div class="right-mid-header">
                        实时监控
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

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

/* 去除水印 */
.anchorBL {
    display: none;
}
</style>