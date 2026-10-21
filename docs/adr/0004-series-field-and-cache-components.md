# 0004. Small deviations from the blueprint

Status: accepted

- The product collection is stored as `series`: `collection` is a reserved property on Mongoose documents and broke
  typing. The public URL and the contracts' constant names keep "collection".
- `cacheComponents` stays off. The catalogue uses tag-based ISR (`catalog`, 60 s) and admin edits call `updateTag`
  through a server action, which is enough for this store.
- Node 22 LTS is pinned in `.nvmrc` because it is what the build machine and the target servers run.
