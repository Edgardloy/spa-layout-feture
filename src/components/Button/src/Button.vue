<script setup>
import { useDesign } from '@/hooks/web/useDesign'
import { ElButton } from 'element-plus'
import { computed, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const getTheme = computed(() => appStore.getTheme)

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('button')

const props = defineProps({
  size: {
    type: String,
    default: undefined
  },
  type: {
    type: String,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  plain: {
    type: Boolean,
    default: false
  },
  text: {
    type: Boolean,
    default: false
  },
  bg: {
    type: Boolean,
    default: false
  },
  link: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  circle: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingIcon: {
    type: [String, Object],
    default: undefined
  },
  icon: {
    type: [String, Object],
    default: undefined
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  nativeType: {
    type: String,
    default: 'button'
  },
  autoInsertSpace: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: ''
  },
  darker: {
    type: Boolean,
    default: false
  },
  tag: {
    type: [String, Object],
    default: 'button'
  }
})

const emits = defineEmits(['click'])

const color = computed(() => {
  const { type } = props
  if (type === 'primary') {
    return unref(getTheme).elColorPrimary
  }
  return ''
})

const style = computed(() => {
  const { type } = props
  if (type === 'primary') {
    return '--el-button-text-color: #fff; --el-button-hover-text-color: #fff'
  }
  return ''
})
</script>

<template>
  <ElButton
    :class="`${prefixCls} color-#fff`"
    v-bind="{ ...props }"
    :color="color"
    :style="style"
    @click="() => emits('click')"
  >
    <slot></slot>
    <slot name="icon"></slot>
    <slot name="loading"></slot>
  </ElButton>
</template>
