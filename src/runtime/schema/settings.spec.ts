import { cloneDeep } from 'lodash'
import { createSchemaSettingsManager, SchemaSettingsManager } from './settings'

let sm: SchemaSettingsManager

beforeEach(() => {
  sm = createSchemaSettingsManager()
})

it('has defaults', () => {
  expect(sm.data).toMatchInlineSnapshot(`
    Object {
      "authorization": Object {},
      "connections": Object {
        "default": Object {
          "nexusFieldName": "connection",
          "nexusSchemaImportId": "nexus/components/schema",
        },
      },
      "generateGraphQLSDLFile": "api.graphql",
      "nullable": Object {
        "inputs": true,
        "outputs": true,
      },
      "rootTypingsGlobPattern": "./**/*.ts",
    }
  `)
})

describe('connctions', () => {
  it('can be set empty, doing nothing', () => {
    const original = cloneDeep(sm.data)
    sm.change({ connections: {} })
    expect(sm.data).toEqual(original)
  })
  it('new types can be added getting the core settings', () => {
    sm.change({ connections: { a: {} } })
    expect(sm.data.connections).toMatchInlineSnapshot(`
      Object {
        "a": Object {
          "nexusFieldName": "connection",
          "nexusSchemaImportId": "nexus/components/schema",
        },
        "default": Object {
          "nexusFieldName": "connection",
          "nexusSchemaImportId": "nexus/components/schema",
        },
      }
    `)
  })
  it('existing custom types can be changed, preserving its core settings', () => {
    sm.change({ connections: { a: {} } }) // test above says this has the core settings
    sm.change({ connections: { a: { disableForwardPagination: true } } })
    expect(sm.data.connections.a).toMatchInlineSnapshot(`
      Object {
        "disableForwardPagination": true,
        "nexusFieldName": "connection",
        "nexusSchemaImportId": "nexus/components/schema",
      }
    `)
  })
  it('default types can be changed, preserving its core settings', () => {
    sm.change({ connections: { default: { disableForwardPagination: true } } })
    expect(sm.data.connections.default).toMatchInlineSnapshot(`
      Object {
        "disableForwardPagination": true,
        "nexusFieldName": "connection",
        "nexusSchemaImportId": "nexus/components/schema",
      }
    `)
  })
})
