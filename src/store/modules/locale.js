import { defineStore } from 'pinia'
import { store } from '../index'
import it from 'element-plus/es/locale/lang/it'
import en from 'element-plus/es/locale/lang/en'
import { useStorage } from '@/hooks/web/useStorage'

const { getStorage, setStorage } = useStorage('localStorage')

const elLocaleMap = {
  en: en,
  it: it
}

export const useLocaleStore = defineStore('locales', {
  state: () => {
    return {
      currentLocale: {
        lang: getStorage('lang') || 'it',
        elLocale: elLocaleMap[getStorage('lang') || 'it']
      },
      localeMap: [
        {
          lang: 'it',
          name: 'Italiano'
        },
        {
          lang: 'en',
          name: 'English'
        }
      ]
    }
  },
  getters: {
    getCurrentLocale() {
      return this.currentLocale
    },
    getLocaleMap() {
      return this.localeMap
    }
  },
  actions: {
    setCurrentLocale(localeMap) {
      // this.locale = Object.assign(this.locale, localeMap)
      this.currentLocale.lang = localeMap?.lang
      this.currentLocale.elLocale = elLocaleMap[localeMap?.lang]
      setStorage('lang', localeMap?.lang)
    }
  }
})

export const useLocaleStoreWithOut = () => {
  return useLocaleStore(store)
}
