<template>
  <ElForm ref="formRef" :rules="rules" :model="form" label-position="top" hide-required-asterisk size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)">
    <ElFormItem label="Login" prop="username">
      <ElInput v-model="form.username" />
    </ElFormItem>
    <ElFormItem label="Password" prop="password">
      <ElInput v-model="form.password" />
    </ElFormItem>
    
    <BaseButton class="w-[100%]" @click="signIn">
      {{t('login.login')}}
    </BaseButton>
  </ElForm>
</template>
<script setup>
import { ElForm, ElFormItem, ElInput } from 'element-plus';
import { onMounted, reactive, ref, unref, watch } from 'vue'
import { BaseButton } from '@/components/Button'
import { useUserStore } from '@/store/modules/user'
import { loginApi } from '@/api/login'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { useValidator } from '@/hooks/web/useValidator'

const { required } = useValidator()

const userStore = useUserStore()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const { t } = useI18n()

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [required()],
  password: [required()]
}

const initLoginInfo = () => {
  const loginInfo = userStore.getLoginInfo
  if (loginInfo) {
    const { username, password } = loginInfo
    form.username = username
    form.password = password
  }
}
onMounted(() => {
  initLoginInfo()
})

const loading = ref(false)

const remember = ref(false)

const redirect = ref('')
const formRef = ref(null)

watch(
  () => currentRoute.value,
  (route) => {
    redirect.value = route?.query?.redirect
  },
  {
    immediate: true
  }
)

const signIn = async () => {
  const formValidate = unref(formRef)
  await formValidate?.validate(async (isValid) => {
    console.log("🚀 ~ awaitformValidate?.validate ~ isValid:", isValid)
    if (isValid) {
      loading.value = true

      try {
        const res = await loginApi(form)

        if (res) {
          if (unref(remember)) {
            userStore.setLoginInfo({
              username: form.username,
              password: form.password
            })
          } else {
            userStore.setLoginInfo(undefined)
          }
          userStore.setRememberMe(unref(remember))
          userStore.setUserInfo(res.data)
          
          await permissionStore.generateRoutes('static').catch(() => {})
          permissionStore.getAddRouters.forEach((route) => {
            addRoute(route)
          })
          permissionStore.setIsAddRouters(true)
          push({ path: redirect.value || permissionStore.addRouters[0].path })
        }
      } finally {
        loading.value = false
      }
    }
  })
}

</script>
<style lang="scss" scoped></style>