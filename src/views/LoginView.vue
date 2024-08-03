<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'

const form = reactive({
  login: '2252137',
  pass: '123456',
  remember: true
})

const router = useRouter()

const submit = () => {
  router.push('/dashboard')
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purple">
      <div class="main-container">
        <div class="header">
          <h1>海洋数据分析平台</h1>
        </div>
        <CardBox :class="cardClass, cardbox" is-form @submit.prevent="submit">
          <FormField label="账号" help="请输入你的账号">
            <FormControl v-model="form.login" :icon="mdiAccount" name="login" autocomplete="username" />
          </FormField>

          <FormField label="密码" help="请输入你的密码">
            <FormControl v-model="form.pass" :icon="mdiAsterisk" type="password" name="password"
              autocomplete="current-password" />
          </FormField>

          <FormCheckRadio v-model="form.remember" name="remember" label="记住密码" :input-value="true" />

          <template #footer>
            <BaseButtons>
              <BaseButton type="submit" color="info" label="登录" />
              <BaseButton to="/dashboard" color="info" outline label="返回" />
            </BaseButtons>
          </template>
        </CardBox>
      </div>
    </SectionFullScreen>
  </LayoutGuest>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.header {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.header h1 {
  font-size: 2.5rem;
  text-align: center;
  color: blue;
  margin: 0;
}

.cardbox {
  width: 100%;
  max-width: 400px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  transition: transform 0.3s ease-in-out;
}

.cardbox:hover {
  transform: translateY(-10px);
}
</style>
