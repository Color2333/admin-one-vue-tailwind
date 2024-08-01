<script setup>
import { computed, ref } from 'vue'
import { mdiEye, mdiTrashCan } from '@mdi/js'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'

const dataItems = ref([
    { name: 'Depth', meaning: '深度(m)', value: '10.5' },
    { name: 'Temp', meaning: '温度(℃)', value: '15.2' },
    { name: 'Turbidity', meaning: '浊度(NTU)', value: '3.1' },
    { name: 'Time', meaning: '系统时间', value: '2018-03-01T16:00:00' }
]);


const isVisible = ref({
    name: true,
    meaning: true,
    value: true,
    actions: true
})

const toggleColumnVisibility = (column) => {
    isVisible.value[column] = !isVisible.value[column]
}
</script>

<template>
    <table>
        <thead>
            <tr>
                <th v-if="isVisible.name">名称</th>
                <th v-if="isVisible.meaning">含义</th>
                <th v-if="isVisible.value">样例值</th>
                <th v-if="isVisible.actions">操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in dataItems" :key="item.name">
                <td v-if="isVisible.name" data-label="Name">{{ item.name }}</td>
                <td v-if="isVisible.meaning" data-label="Meaning">{{ item.meaning }}</td>
                <td v-if="isVisible.value" data-label="Value">{{ item.value }}</td>
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
        <small>数据列表</small>
    </div>
</template>

<style scoped>
.mb-6 {
    margin-bottom: 1.5rem;
}
</style>
