import variables from '@/styles/variables.module.less'

export const useDesign = () => {
  const lessVariables = variables

  const getPrefixCls = (scope) => {
    return `${lessVariables.namespace}-${scope}`
  }

  return {
    variables: lessVariables,
    getPrefixCls
  }
}
