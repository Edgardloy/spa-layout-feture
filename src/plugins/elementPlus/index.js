import { ElLoading, ElScrollbar } from 'element-plus'

const plugins = [ElLoading]

const components = [ElScrollbar]

export const setupElementPlus = (app) => {
  plugins.forEach((plugin) => {
    app.use(plugin)
  })

  import('element-plus/dist/index.css')

  components.forEach((component) => {
    app.component(component.name, component)
  })
}
