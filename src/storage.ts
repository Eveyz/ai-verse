// src/theme/storage.ts
import { Store } from "@tauri-apps/plugin-store"

type ThemeMode = "light" | "dark" | "system"

let storePromise: Promise<Store> | null = null

function getStore(): Promise<Store> {
  if (!storePromise) {
    storePromise = Store.load("settings.json")
  }
  return storePromise
}

export async function loadThemeMode(): Promise<ThemeMode | null> {
  const store = await getStore()
  return (await store.get("theme")) as ThemeMode | null
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  const store = await getStore()
  await store.set("theme", mode)
  await store.save()
}
