import { fileURLToPath } from 'url'
import process from 'process'
import path from 'path'

export function stripExt (name: string) {
  const extension = path.extname(name)
  if (!extension) {
    return name
  }

  return name.slice(0, -extension.length)
}

export function isMain (meta: ImportMeta) {
  const modulePath = fileURLToPath(meta.url)

  const scriptPath = process.argv[1]
  const extension = path.extname(scriptPath)
  if (extension) {
    return modulePath === scriptPath
  }

  return stripExt(modulePath) === scriptPath
}
