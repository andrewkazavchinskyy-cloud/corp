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
./bin/corp cycle       # next unclaimed ready Issue, or research report
./bin/corp take --issue owner/repo#n
./bin/corp run --issue owner/repo#n --agent claude
./bin/corp close --issue owner/repo#n
./bin/corp board --json
./bin/corp queue add --issue owner/repo#n --profile claude
./bin/corp doctor
./bin/corp notify 'text'
./bin/corp workshop-token
./bin/corp catalog
./bin/corp orchestrate --repo owner/name
```

Сервер: [`SERVER.md`](SERVER.md). Спека: [`docs/SPEC.md`](docs/SPEC.md).
Мастерская: [`docs/WORKSHOP.md`](docs/WORKSHOP.md).

## Документы

- [`docs/SPEC.md`](docs/SPEC.md) — что это за продукт (P0)
- [`AGENTS.md`](AGENTS.md) — контракт для любого агента
- [`HARNESS.md`](HARNESS.md) — цикл, Graphify, планер, runner
- [`docs/WORKSHOP.md`](docs/WORKSHOP.md) — pin, оркестратор, слоты, Telegram
- [`docs/HANDOFF.md`](docs/HANDOFF.md) — Tailscale → Passkey → песочница; два дерева
- [`docs/AGENT_ISOLATION.md`](docs/AGENT_ISOLATION.md) — writing agents vs secrets/control plane
- [`SERVER.md`](SERVER.md) — VPS, live `/opt/corp` vs writers
- [`registry.json`](registry.json) — проекты корпорации
