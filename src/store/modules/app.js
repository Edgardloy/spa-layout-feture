import { defineStore } from 'pinia'
import { store } from '../index'
import { setCssVar, humpToUnderline } from '@/utils'
import { colorIsDark, hexToRGB, lighten, mix } from '@/utils/color'
import { ElMessage } from 'element-plus'
import { useCssVar } from '@vueuse/core'
import { unref } from 'vue'
import { useDark } from '@vueuse/core'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      sizeMap: ['default', 'large', 'small'],
      mobile: false, 
      title: import.meta.env.VITE_APP_TITLE,
      pageLoading: false, 
      breadcrumb: true, 
      breadcrumbIcon: true,
      collapse: false, 
      uniqueOpened: false,
      hamburger: true, 
      screenfull: true,
      size: true, 
      locale: true, 
      tagsView: true, 
      tagsViewIcon: true, 
      logo: true, 
      fixedHeader: true, 
      footer: true, 
      greyMode: false, 
      dynamicRouter: true, 
      serverDynamicRouter: false, 
      fixedMenu: false, 

      layout: 'classic', 
      isDark: false, 
      currentSize: 'default', 
      theme: {
        elColorPrimary: '#409eff',
        leftMenuBorderColor: 'inherit',
        leftMenuBgColor: '#001529',
        leftMenuBgLightColor: '#0f2438',
        leftMenuBgActiveColor: 'var(--el-color-primary)',
        leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
        leftMenuTextColor: '#bfcbd9',
        leftMenuTextActiveColor: '#fff',
        logoTitleTextColor: '#fff',
        logoBorderColor: 'inherit',
        topHeaderBgColor: '#fff',
        topHeaderTextColor: 'inherit',
        topHeaderHoverColor: '#f6f6f6',
        topToolBorderColor: '#eee'
      }
    }
  },
  getters: {
    getBreadcrumb() {
      return this.breadcrumb
    },
    getBreadcrumbIcon() {
      return this.breadcrumbIcon
    },
    getCollapse() {
      return this.collapse
    },
    getUniqueOpened() {
      return this.uniqueOpened
    },
    getHamburger() {
      return this.hamburger
    },
    getScreenfull() {
      return this.screenfull
    },
    getSize() {
      return this.size
    },
    getLocale() {
      return this.locale
    },
    getTagsView() {
      return this.tagsView
    },
    getTagsViewIcon() {
      return this.tagsViewIcon
    },
    getLogo() {
      return this.logo
    },
    getFixedHeader() {
      return this.fixedHeader
    },
    getGreyMode() {
      return this.greyMode
    },
    getDynamicRouter() {
      return this.dynamicRouter
    },
    getServerDynamicRouter() {
      return this.serverDynamicRouter
    },
    getFixedMenu() {
      return this.fixedMenu
    },
    getPageLoading() {
      return this.pageLoading
    },
    getLayout() {
      return this.layout
    },
    getTitle() {
      return this.title
    },
    getIsDark() {
      return this.isDark
    },
    getCurrentSize() {
      return this.currentSize
    },
    getSizeMap() {
      return this.sizeMap
    },
    getMobile() {
      return this.mobile
    },
    getTheme() {
      return this.theme
    },
    getFooter() {
      return this.footer
    }
  },
  actions: {
    setBreadcrumb(breadcrumb) {
      this.breadcrumb = breadcrumb
    },
    setBreadcrumbIcon(breadcrumbIcon) {
      this.breadcrumbIcon = breadcrumbIcon
    },
    setCollapse(collapse) {
      this.collapse = collapse
    },
    setUniqueOpened(uniqueOpened) {
      this.uniqueOpened = uniqueOpened
    },
    setHamburger(hamburger) {
      this.hamburger = hamburger
    },
    setScreenfull(screenfull) {
      this.screenfull = screenfull
    },
    setSize(size) {
      this.size = size
    },
    setLocale(locale) {
      this.locale = locale
    },
    setTagsView(tagsView) {
      this.tagsView = tagsView
    },
    setTagsViewIcon(tagsViewIcon) {
      this.tagsViewIcon = tagsViewIcon
    },
    setLogo(logo) {
      this.logo = logo
    },
    setFixedHeader(fixedHeader) {
      this.fixedHeader = fixedHeader
    },
    setGreyMode(greyMode) {
      this.greyMode = greyMode
    },
    setDynamicRouter(dynamicRouter) {
      this.dynamicRouter = dynamicRouter
    },
    setServerDynamicRouter(serverDynamicRouter) {
      this.serverDynamicRouter = serverDynamicRouter
    },
    setFixedMenu(fixedMenu) {
      this.fixedMenu = fixedMenu
    },
    setPageLoading(pageLoading) {
      this.pageLoading = pageLoading
    },
    setLayout(layout) {
      if (this.mobile && layout !== 'classic') {
        ElMessage.warning('移动端模式下不支持切换其它布局')
        return
      }
      this.layout = layout
    },
    setTitle(title) {
      this.title = title
    },
    setIsDark(isDark) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
      this.setPrimaryLight()
    },
    setCurrentSize(currentSize) {
      this.currentSize = currentSize
    },
    setMobile(mobile) {
      this.mobile = mobile
    },
    setTheme(theme) {
      this.theme = Object.assign(this.theme, theme)
    },
    setCssVarTheme() {
      for (const key in this.theme) {
        setCssVar(`--${humpToUnderline(key)}`, this.theme[key])
      }
      this.setPrimaryLight()
    },
    setFooter(footer) {
      this.footer = footer
    },
    setPrimaryLight() {
      if (this.theme.elColorPrimary) {
        const elColorPrimary = this.theme.elColorPrimary
        const color = this.isDark ? '#000000' : '#ffffff'
        const lightList = [3, 5, 7, 8, 9]
        lightList.forEach((v) => {
          setCssVar(`--el-color-primary-light-${v}`, mix(color, elColorPrimary, v / 10))
        })
        setCssVar(`--el-color-primary-dark-2`, mix(color, elColorPrimary, 0.2))
      }
    },
    setMenuTheme(color) {
      const primaryColor = useCssVar('--el-color-primary', document.documentElement)
      const isDarkColor = colorIsDark(color)
      const theme = {
        leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
        leftMenuBgColor: color,
        leftMenuBgLightColor: isDarkColor ? lighten(color, 6) : color,
        leftMenuBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor), 0.1),
        leftMenuCollapseBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor), 0.1),
        leftMenuTextColor: isDarkColor ? '#bfcbd9' : '#333',
        leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
        logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
        logoBorderColor: isDarkColor ? color : '#eee'
      }
      this.setTheme(theme)
      this.setCssVarTheme()
    },
    setHeaderTheme(color) {
      const isDarkColor = colorIsDark(color)
      const textColor = isDarkColor ? '#fff' : 'inherit'
      const textHoverColor = isDarkColor ? lighten(color, 6) : '#f6f6f6'
      const topToolBorderColor = isDarkColor ? color : '#eee'
      setCssVar('--top-header-bg-color', color)
      setCssVar('--top-header-text-color', textColor)
      setCssVar('--top-header-hover-color', textHoverColor)
      this.setTheme({
        topHeaderBgColor: color,
        topHeaderTextColor: textColor,
        topHeaderHoverColor: textHoverColor,
        topToolBorderColor
      })
      if (this.getLayout === 'top') {
        this.setMenuTheme(color)
      }
    },
    initTheme() {
      const isDark = useDark({
        valueDark: 'dark',
        valueLight: 'light'
      })
      isDark.value = this.getIsDark
    }
  },
  persist: true
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
