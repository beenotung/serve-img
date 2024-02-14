import { readdir, stat } from 'fs/promises'
import { extname, join } from 'path'

type ImageFile = {
  dir: string
  filename: string
}

export async function* scanDir(dir: string): AsyncGenerator<ImageFile> {
  let filenames = await readdir(dir)
  for (let filename of filenames) {
    let file = join(dir, filename)
    let stats = await stat(file)
    if (stats.isDirectory()) {
      yield* scanDir(file)
      continue
    }
    if (stats.isFile()) {
      if (isImage(file)) {
        yield {
          dir,
          filename,
        }
      }
    }
  }
}

let imageExts = 'png jpg jpeg webp gif bmp'.split(' ').map(s => '.' + s)

function isImage(file: string): boolean {
  let ext = extname(file)
  return imageExts.includes(ext)
}

type Media = {
  url: string
  dir: string
  filename: string
}

export function toMedia(root_dir: string, image: ImageFile): Media {
  let { dir, filename } = image
  let url = encodeURIComponent(join(dir.replace(root_dir, '/'), filename))
  return {
    url,
    dir,
    filename,
  }
}
