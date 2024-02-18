import { Icon } from './Icon'
import { Permission } from './Permission'
import { BaseButton } from './Button'

export const setupGlobCom = (app) => {
  app.component('Icon', Icon)
  app.component('Permission', Permission)
  app.component('BaseButton', BaseButton)
}
