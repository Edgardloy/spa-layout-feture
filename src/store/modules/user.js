import { defineStore } from 'pinia'
import { store } from '../index'
import { ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { loginOutApi } from '@/api/login'
import { useTagsViewStore } from './tagsView'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: undefined,
      tokenKey: 'Authorization',
      token: '',
      roleRouters: undefined,
      rememberMe: true,
      loginInfo: undefined
    }
  },
  getters: {
    getTokenKey() {
      return this.tokenKey
    },
    getToken() {
      return this.token
    },
    getUserInfo() {
      return this.userInfo
    },
    getRoleRouters() {
      return this.roleRouters
    },
    getRememberMe() {
      return this.rememberMe
    },
    getLoginInfo() {
      return this.loginInfo
    }
  },
  actions: {
    setTokenKey(tokenKey) {
      this.tokenKey = tokenKey
    },
    setToken(token) {
      this.token = token
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    setRoleRouters(roleRouters) {
      this.roleRouters = roleRouters
    },
    logoutConfirm() {
      const { t } = useI18n()
      ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          const res = await loginOutApi().catch(() => {})
          if (res) {
            this.reset()
          }
        })
        .catch(() => {})
    },
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setToken('')
      this.setUserInfo(undefined)
      this.setRoleRouters([])
      router.replace('/login')
    },
    logout() {
      this.reset()
    },
    setRememberMe(rememberMe) {
      this.rememberMe = rememberMe
    },
    setLoginInfo(loginInfo) {
      this.loginInfo = loginInfo
    }
  },
  persist: true
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
