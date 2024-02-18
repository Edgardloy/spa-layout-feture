<script setup>
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { ref, watch, computed, unref, TransitionGroup } from 'vue'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { filterBreadcrumb } from './helper'
import { filter, treeToList } from '@/utils/tree'
import { useI18n } from '@/hooks/web/useI18n'
import { Icon } from '@/components/Icon'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('breadcrumb')

const appStore = useAppStore()

// 面包屑图标
const breadcrumbIcon = computed(() => appStore.getBreadcrumbIcon)

const { currentRoute } = useRouter()

const { t } = useI18n()

const levelList = ref([])

const permissionStore = usePermissionStore()

const menuRouters = computed(() => {
  const routers = permissionStore.getRouters
  return filterBreadcrumb(routers)
})

const getBreadcrumb = () => {
  const currentPath = currentRoute.value.matched.slice(-1)[0].path
  levelList.value = filter(unref(menuRouters), (node) => {
    return node.path === currentPath
  })
}

const breadcrumbList = computed(() => treeToList(unref(levelList)))

watch(
  () => currentRoute.value,
  (route) => {
    if (route.path.startsWith('/redirect/')) {
      return
    }
    getBreadcrumb()
  },
  {
    immediate: true
  }
)
</script>

<template>
  <ElBreadcrumb separator="/" :class="`${prefixCls} flex items-center h-full ml-[10px]`">
    <TransitionGroup appear enter-active-class="animate__animated animate__fadeInRight">
      <template v-for="v in breadcrumbList" :key="v.name">
        <ElBreadcrumbItem :to="{ path: !v.redirect || v.redirect === 'noredirect' ? '' : v.path }" >
          <span  v-if="v?.meta?.icon && breadcrumbIcon.value" >
            <Icon :icon="v?.meta.icon" class="mr-[5px]"></Icon> {{t(v?.meta?.title || '')}}
          </span>
          <span v-else>{{ t(v?.meta?.title || '') }}</span>
        </ElBreadcrumbItem>
      </template>
    </TransitionGroup>
  </ElBreadcrumb>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{elNamespace}-breadcrumb';

.@{prefix-cls} {
  :deep(&__item) {
    display: flex;

    .@{prefix-cls}__inner {
      display: flex;
      align-items: center;
      color: var(--top-header-text-color);

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  :deep(&__item):not(:last-child) {
    .@{prefix-cls}__inner {
      color: var(--top-header-text-color);

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  :deep(&__item):last-child {
    .@{prefix-cls}__inner {
      color: var(--el-text-color-placeholder);

      &:hover {
        color: var(--el-text-color-placeholder);
      }
    }
  }
}
</style>
