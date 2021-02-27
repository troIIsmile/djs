import { join } from 'path'
import { readdir, stat } from 'fs/promises'
export async function recursive_readdir (dir: string, allFiles: string[] = []): Promise<string[]> {
  const files = (await readdir(dir)).map(file => join(dir, file))
  allFiles.push(...files)
  await Promise.all(files.map(async (file: string) => ((await stat(file)).isDirectory() && recursive_readdir(file, allFiles))))
  return allFiles
}
