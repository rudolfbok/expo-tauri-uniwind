This is a pnpm monorepo for one React Native app: Expo ships it to iOS, Android and web, and Tauri 2 ships it to macOS, Windows and Linux. Uniwind (Tailwind CSS 4) styles it on every platform.

## Layout

- `apps/expo` — Expo SDK 58 + Expo Router. Has its own `AGENTS.md`; follow it for anything in that folder.
- `apps/tauri` — Tauri 2 desktop shell. The frontend is Vite + react-native-web (`src/`); the Rust side lives in `src-tauri/`.
- `packages/ui` (`@app/ui`) — shared React Native components and the theme tokens in `theme.css`.
- `packages/shared` (`@app/shared`) — platform-agnostic TypeScript (API client, constants). No React Native imports.

Workspace packages are consumed as TypeScript source (their `exports` point at `src/`), so there is no build step for them.

## Commands

Run from the repo root. Use pnpm only, never npm, yarn or bun.

```bash
pnpm install
pnpm dev:tauri                                     # Tauri window with Vite HMR on port 1420
pnpm dev:expo                                      # Expo dev server
pnpm typecheck                                     # tsc in every workspace package
pnpm --filter @app/tauri build                     # desktop frontend build
pnpm --filter @app/expo exec expo export --platform all
pnpm --filter <package> add <pkg>                  # add a dependency to one package
pnpm --filter @app/expo exec expo install <pkg>    # Expo dependencies (SDK-compatible versions)
```

Rust, from `apps/tauri/src-tauri`: `cargo fmt --check` and `cargo clippy -- -D warnings`.

CI runs all of the checks above. Run `pnpm typecheck`, plus the cargo checks after Rust changes, before declaring a task done.

## Rules

- Put code both apps need in `packages/ui` or `packages/shared`, not in one app. Keep the apps thin.
- Shared UI uses React Native primitives (`View`, `Text`, `Pressable`), never DOM elements. The desktop app renders them through react-native-web.
- Style with `className`. Colors come from the semantic tokens in `packages/ui/theme.css` (`background`, `foreground`, `primary`, …); add new tokens there, in both the `light` and `dark` variants, instead of hardcoding colors.
- Tailwind only scans `packages/ui/src` because of `@source "./src"` in `theme.css`. A new package that uses class names needs its own `@source`.
- Versions shared across packages (React, React Native, TypeScript, Uniwind, Tailwind) live in the `catalog` in `pnpm-workspace.yaml`. Reference them as `"catalog:"` and bump them there.
- Keep Tauri-specific code (`@tauri-apps/api`, Rust commands) in `apps/tauri`. Inside the Tauri window `Platform.OS` is `"web"`, so use `isTauri()` from `@tauri-apps/api/core` to detect desktop. New Tauri permissions go in `apps/tauri/src-tauri/capabilities/default.json`.
- The Tauri dev server port `1420` is fixed (`strictPort`); don't change it in only one place.
- Don't edit generated files: `uniwind-types.d.ts`, `expo-env.d.ts`, `apps/tauri/src-tauri/gen/`, and `apps/expo/ios/` / `apps/expo/android/`.
