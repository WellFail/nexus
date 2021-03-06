# `import { log }`

[issues](https://nxs.li/issues/component/logger) / [features](https://nxs.li/issues/components/logger/features) | [bugs](https://nxs.li/issues/component/logger/bugs)

### `fatal`

A <code class="TypeRef" >[Log](#Log)</code> that outputs at `fatal` (6) level.

### `error`

A <code class="TypeRef" >[Log](#Log)</code> that outputs at `error` (5) level.

### `warn`

A <code class="TypeRef" >[Log](#Log)</code> that outputs at `warn` (4) level.

### `info`

A <code class="TypeRef" >[Log](#Log)</code> that outputs at `info` (3) level.

### `debug`

A <code class="TypeRef" >[Log](#Log)</code> that outputs at `debug` (2) level.

### `trace`

A <code class="TypeRef" >[Log](#Log)</code> that outputs at `trace` (1) level.

### `addToContext`

Add context to the logger. All subsequent logs will have this information included under their `context` property. Data is merged deeply using [lodash merge](https://lodash.com/docs/4.17.15#merge).

Use this if you have some information that you wish all logs to include in their context.

##### Signature

<p class="OneLineSignature"></p>

<!-- prettier-ignore -->
```ts
(context: Record<string, unknown>) => Logger
```

##### Example

```ts
log.addToContext({ user: 'Toto' })
log.info('hello')
log.warn('bye')
// { "context": { "user": "Toto"  }, "event": "hello", ... }
// { "context": { "user": "Toto"  }, "event": "bye", ... }
```

##### Example of local scalar precedence

```ts
log.addToContext({ user: { name: 'Toto', age: 10 })
log.info("hi", { user: { name: 'Titi', heightCM: 155 })
// { "context": { "user": { "name": "Titi", age: 10, heightCM: 155 }}, ... }
```

### `child`

Create a new logger that inherits its parents' context and path.

Context added by children is never visible to parents.

Context added by children is deeply merged using [lodash merge](https://lodash.com/docs/4.17.15#merge) with the context inherited from parents.

Context added to parents is immediately visible to all existing children.

##### Signature

<p class="OneLineSignature"></p>

<!-- prettier-ignore -->
```ts
(name: string) => Logger
```

##### Example

```ts
log.addToContext({ user: 'Toto' })

const bar = log.child('bar').addToContext({ bar: 'bar' })
const foo = log.child('foo').addToContext({ foo: 'foo' })

log.info('hello')
bar.info('bar')
foo.info('foo')

// { "context": { "user": "Toto"  }, path: ["app"], "event": "hello", ... }
// { "context": { "user": "Toto", "bar": "bar"  }, path: ["app", "bar"], "event": "bar", ... }
// { "context": { "user": "Toto", "foo": "foo"  }, path: ["app", "foo"], "event": "foo", ... }
```

### Type Glossary

#### `F` `Log`

##### Signature

```ts
(event: string, context?: Record<string, unknown>) => void
```

Parameters:

- `event`

  The event name of this log. Maps to the `event` property in the output JSON.

  ##### Remarks

  The log api is designed to get you thinking about logs in terms of events with structured data instead of strings of interpolated data. This approach gets you significantly more leverage out of your logs once they hit your logging platform, e.g. [ELK](https://www.elastic.co/what-is/elk-stack)

- `context`

  Contextual information about this log. The object passed here is deeply merged under the log's `context` property.

  ##### Example

  ```ts
  log.info('hello', { user: 'Toto' })
  // { "context": { "user": "Toto"  }, ... }
  ```

##### Example

```ts
import { log } from 'nexus'

log.info('hello')
```

#### `I` `JSONLog`

##### Type

```ts
{
  level: 10 | 20 | 30 | 40 | 50
  time: number
  pid: number
  hostname: string
  path: string[]
  context: JSON
  event: string
}
```

- `level`  
  Numeric representation of log levels. Numeric because it easy later to filter e.g. level `30` and up. `10` is `trace` while on the other end of the scale `50` is `fatal`.

- `time`  
  Unix timestamp in milliseconds.

- `pid`  
  The process ID given by the host kernel.

- `hostname`  
  The machine host (`require('os').hostname()`)

- `path`  
  The fully qualified name of the logger.

  ##### Example

  ```ts
  import { log } from 'nexus'

  log.info('hi') //              { path: ['nexus'], ... }
  log.child('b').info('hallo') // { path: ['nexus', 'b'], ... }
  ```

- `context`  
  Custom contextual data added by you. Any data added by the log call, previous `addToContext` calls, or inheritance from parent context.

- `event`  
  The name of this log event.

##### Example

```json
{
  "path": ["nexus", "dev", "watcher"],
  "event": "restarting",
  "level": 30,
  "time": 1582856917643,
  "pid": 49426,
  "hostname": "Jasons-Prisma-Machine.local",
  "context": {
    "changed": "api/graphql/user.ts"
  }
}
```
