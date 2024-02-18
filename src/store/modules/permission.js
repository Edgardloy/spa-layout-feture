import { defineStore } from 'pinia'
import { asyncRouterMap, constantRouterMap } from '@/router'
import {
  generateRoutesByFrontEnd,
  generateRoutesByServer,
  flatMultiLevelRoutes
} from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  getters: {
    getRouters() {
      return this.routers
    },
    getAddRouters() {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters() {
      return this.isAddRouters
    },
    getMenuTabRouters() {
      return this.menuTabRouters
    }
  },
  actions: {
    generateRoutes(
      type,
      routers
    ) {
      return new Promise((resolve) => {
        let routerMap = []
        if (type === 'server') {
          
          routerMap = generateRoutesByServer(routers)
        } else if (type === 'frontEnd') {
          routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers)
        } else {
          routerMap = cloneDeep(asyncRouterMap)
        }
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
    setIsAddRouters(state) {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers) {
      this.menuTabRouters = routers
    }
  },
  persist: {
    paths: ['routers', 'addRouters', 'menuTabRouters']
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
