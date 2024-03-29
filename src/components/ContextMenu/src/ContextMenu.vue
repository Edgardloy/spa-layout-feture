<script setup>
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useDesign } from '@/hooks/web/useDesign'
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('context-menu')

const { t } = useI18n()

const emit = defineEmits(['visibleChange'])

const props = defineProps({
  schema: {
    type: Array,
    default: () => []
  },
  trigger: {
    type: String,
    default: 'contextmenu'
  },
  tagItem: {
    type: Object,
    default: () => ({})
  }
})

const command = (item) => {
  item.command && item.command(item)
}

const visibleChange = (visible) => {
  emit('visibleChange', visible, props.tagItem)
}

const elDropdownMenuRef = ref()

defineExpose({
  elDropdownMenuRef,
  tagItem: props.tagItem
})
</script>

<template>
  <ElDropdown
    ref="elDropdownMenuRef"
    :class="prefixCls"
    :trigger="trigger"
    placement="bottom-start"
    @command="command"
    @visible-change="visibleChange"
    popper-class="v-context-menu-popper"
  >
    <slot></slot>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="(item, index) in schema"
          :key="`dropdown${index}`"
          :divided="item.divided"
          :disabled="item.disabled"
          :command="item"
        >
          <Icon :icon="item.icon" /> {{ t(item.label) }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
