import { useI18n } from '@/hooks/web/useI18n'
import router from '@/router'

const { t } = useI18n()

const hasPermission = (value) => {
  const permission = (router.currentRoute.value.meta.permission || [])
  if (!value) {
    throw new Error(t('permission.hasPermission'))
  }
  if (permission.includes(value)) {
    return true
  }
  return false
}
function hasPermi(el, binding) {
  const value = binding.value

  const flag = hasPermission(value)
  if (!flag) {
    el.parentNode?.removeChild(el)
  }
}
const mounted = (el, binding) => {
  hasPermi(el, binding)
}

const permiDirective = {
  mounted
}

export const setupPermissionDirective = (app) => {
  app.directive('hasPermi', permiDirective)
}

export default permiDirective
