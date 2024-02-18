import { reactive } from 'vue'
import { eachTree, treeMap, filter } from '@/utils/tree'

export const useCrudSchemas = (
  crudSchema
) => {
  const allSchemas = reactive({
    searchSchema: [],
    tableColumns: [],
    formSchema: [],
    detailSchema: []
  })

  const searchSchema = filterSearchSchema(crudSchema)
  // @ts-ignore
  allSchemas.searchSchema = searchSchema || []

  const tableColumns = filterTableSchema(crudSchema)
  allSchemas.tableColumns = tableColumns || []

  const formSchema = filterFormSchema(crudSchema)
  allSchemas.formSchema = formSchema

  const detailSchema = filterDescriptionsSchema(crudSchema)
  allSchemas.detailSchema = detailSchema

  return {
    allSchemas
  }
}

// 过滤 Search 结构
const filterSearchSchema = (crudSchema) => {
  const searchSchema = []
  const length = crudSchema.length

  for (let i = 0; i < length; i++) {
    const schemaItem = crudSchema[i]
    const searchSchemaItem = {
      component: schemaItem?.search?.component || 'Input',
      ...schemaItem.search,
      field: schemaItem.field,
      label: schemaItem.search?.label || schemaItem.label
    }

    searchSchema.push(searchSchemaItem)
  }

  return searchSchema
}

const filterTableSchema = (crudSchema) => {
  const tableColumns = treeMap(crudSchema, {
    conversion: (schema) => {
      if (!schema?.table?.hidden) {
        return {
          ...schema,
          ...schema.table
        }
      }
    }
  })

  // 第一次过滤会有 undefined 所以需要二次过滤
  return filter(tableColumns, (data) => {
    if (data.children === void 0) {
      delete data.children
    }
    return !!data.field
  })
}

// 过滤 form 结构
const filterFormSchema = (crudSchema) => {
  const formSchema = []
  const length = crudSchema.length

  for (let i = 0; i < length; i++) {
    const formItem = crudSchema[i]
    const formSchemaItem = {
      component: formItem?.form?.component || 'Input',
      ...formItem.form,
      field: formItem.field,
      label: formItem.form?.label || formItem.label
    }

    formSchema.push(formSchemaItem)
  }

  return formSchema
}

// 过滤 descriptions 结构
const filterDescriptionsSchema = (crudSchema) => {
  const descriptionsSchema = []

  eachTree(crudSchema, (schemaItem) => {
    // 判断是否隐藏
    if (!schemaItem?.detail?.hidden) {
      const descriptionsSchemaItem = {
        ...schemaItem.detail,
        field: schemaItem.field,
        label: schemaItem.detail?.label || schemaItem.label
      }

      // 删除不必要的字段
      delete descriptionsSchemaItem.hidden

      descriptionsSchema.push(descriptionsSchemaItem)
    }
  })

  return descriptionsSchema
}
