<script setup>
import { computed, ref } from 'vue'
import { mdiEye, mdiTrashCan } from '@mdi/js'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'

const dataItems = ref([
    { name: 'SEB16', id: '10903', source: '东海海底观测试验系统四脚架观测平台', elements: '温度、电导率、压力等' },
    { name: 'SEB26', id: '10905', source: '东海海底观测试验系统四脚架观测平台', elements: '深度、温度、浊度等' },
    { name: '气象观测仪', id: 'NULL', source: '浮标', elements: '风速、风向、温度等' }
])

const isVisible = ref({
    name: true,
    id: true,
    source: true,
    elements: true,
    actions: true
})

</script>

<template>
    <table>
        <thead>
            <tr>
                <th v-if="isVisible.name">名称</th>
                <th v-if="isVisible.id">编号</th>
                <th v-if="isVisible.source">来源</th>
                <th v-if="isVisible.elements">观察要素</th>
                <th v-if="isVisible.actions">操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in dataItems" :key="item.name">
                <td v-if="isVisible.name" data-label="Name">{{ item.name }}</td>
                <td v-if="isVisible.id" data-label="Meaning">{{ item.id }}</td>
                <td v-if="isVisible.source" data-label="Value">{{ item.source }}</td>
                <td v-if="isVisible.elements" data-label="Value">{{ item.elements }}</td>
                <td v-if="isVisible.actions" class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton color="info" :icon="mdiEye" small />
                        <BaseButton color="danger" :icon="mdiTrashCan" small />
                    </BaseButtons>
                </td>
            </tr>
        </tbody>
    </table>

    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <small>课程学习使用数据</small>
    </div>
</template>

<style scoped>
.mb-6 {
    margin-bottom: 1.5rem;
}
</style>
