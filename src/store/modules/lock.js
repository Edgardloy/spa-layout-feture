import { defineStore } from 'pinia'
import { store } from '../index'

export const useLockStore = defineStore('lock', {
  state: () => {
    return {
      lockInfo: {
        // isLock: false, // 是否锁定屏幕
        // password: '' // 锁屏密码
      }
    }
  },
  getters: {
    getLockInfo() {
      return this.lockInfo
    }
  },
  actions: {
    setLockInfo(lockInfo) {
      this.lockInfo = lockInfo
    },
    resetLockInfo() {
      this.lockInfo = {}
    },
    unLock(password) {
      if (this.lockInfo?.password === password) {
        this.resetLockInfo()
        return true
      } else {
        return false
      }
    }
  },
  persist: true
})

export const useLockStoreWithOut = () => {
  return useLockStore(store)
}
