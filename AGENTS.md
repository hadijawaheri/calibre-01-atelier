<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

The project rules live in [CLAUDE.md](./CLAUDE.md); decisions are recorded in [docs/adr](./docs/adr).

Since the move to the pnpm monorepo (apps/api, apps/web, packages/contracts) the Lovable editor can no longer build
this project; treat Lovable as read-only history.
