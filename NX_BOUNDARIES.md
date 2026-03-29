# Nx Module Boundaries

## Workspace Structure

```
apps/
├── forge/              scope:forge,     type:app
└── forge-api/          scope:forge-api, type:app

libs/
├── ui/                 scope:ui,        type:ui
├── shared/
│   ├── contracts/      scope:shared,    type:contracts
│   └── models/         scope:shared,    type:models
└── features/
    └── search/         scope:search,    type:feature
    └── <feature-name>  scope:<feature-name>, type:feature
```

---

## Scopes

| Scope             | Description                 | Can depend on                              |
| ----------------- | --------------------------- | ------------------------------------------ |
| `scope:forge`     | Angular Frontend App        | `scope:shared`, `scope:ui`, `scope:search` |
| `scope:forge-api` | Express Backend             | `scope:shared` only                        |
| `scope:shared`    | Shared contracts & models   | `scope:shared` only                        |
| `scope:ui`        | Reusable Angular components | `scope:shared` only                        |
| `scope:search`    | Search feature              | `scope:search`, `scope:shared`, `scope:ui` |

---

## Types

| Type             | Description                             | Can depend on                                              |
| ---------------- | --------------------------------------- | ---------------------------------------------------------- |
| `type:app`       | Application entry point                 | `type:feature`, `type:ui`, `type:contracts`, `type:models` |
| `type:feature`   | Smart components, pages, routes, stores | `type:ui`, `type:contracts`, `type:models`                 |
| `type:ui`        | Dumb/presentational components          | `type:contracts`, `type:models`                            |
| `type:contracts` | Zod schemas, API types                  | nothing                                                    |
| `type:models`    | TypeScript interfaces, enums            | nothing                                                    |

---

## Rules

Both `scope` AND `type` constraints must be satisfied simultaneously.
A lib can only import something if it passes **both** its scope rule and its type rule.

**Example — `scope:search` + `type:feature`:**

- Scope rule allows: `scope:search`, `scope:shared`, `scope:ui`
- Type rule allows: `type:ui`, `type:contracts`, `type:models`
- Intersection: `shared/contracts`, `shared/models`, `libs/ui`
- Cannot import: other feature libs, apps, forge-api

---

## Key Rules to Remember

- `scope:shared` and `scope:ui` are foundational — they depend on nothing outside themselves
- Apps (`type:app`) never import from other apps
- Features never import from other features
- Models and contracts have no dependencies — they are the bottom of the dependency chain
- Adding a new feature? Create `scope:<name>` and allow it to depend on `scope:shared` and `scope:ui`
