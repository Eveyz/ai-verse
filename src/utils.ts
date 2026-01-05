export function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function bootstrapTheme() {
  // Default assumption: system theme
  const resolved = getSystemTheme()

  if (resolved === "dark") {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

export function applyTheme(mode: "light" | "dark") {
  const root = document.documentElement

  if (mode === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

export function watchSystemTheme(
  cb: (theme: "light" | "dark") => void
) {
  const media = window.matchMedia("(prefers-color-scheme: dark)")
  const handler = () => cb(media.matches ? "dark" : "light")

  media.addEventListener("change", handler)
  return () => media.removeEventListener("change", handler)
}
