# corp

Портативная операционная система для агентов. Один репозиторий: список проектов,
правила работы, цикл задач и Graphify-карта корпорации.

С любого компьютера:

```bash
gh repo clone andrewkazavchinskyy-cloud/corp
cd corp
./bin/corp bootstrap
./bin/corp cycle
```

Дальше открываете эту папку в Cursor, Codex, Claude, Copilot или Grok. Агент
читает `AGENTS.md` и `HARNESS.md` и либо берёт готовый GitHub Issue с меткой
`ready`, либо идёт в исследовательский цикл (PRD / баги / незакрытая работа).

Планер — **GitHub Issues**, не Linear. Так цикл работает на любой подписке и
на любом устройстве, где есть `gh`. Linear можно добавить позже как зеркало.

## Команды

```bash
./bin/corp bootstrap   # clone/pull active repos, install graphify if possible
./bin/corp pull        # git pull existing checkouts
./bin/corp cycle       # next ready Issue, or research report
./bin/corp cycle --json
./bin/corp status      # local checkouts vs registry
```

## Документы

- [`AGENTS.md`](AGENTS.md) — контракт для любого агента
- [`HARNESS.md`](HARNESS.md) — цикл, Graphify, планер, runner
- [`registry.json`](registry.json) — проекты корпорации
