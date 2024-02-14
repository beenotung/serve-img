import express from 'express'
import { print } from 'listening-on'
import { parseArgs } from './cli'
import { scanDir, toMedia } from './core'
import { join } from 'path'

function escapeHTML(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function main() {
  let { root_dir, port } = parseArgs()
  console.log('root directory:', root_dir)

  let app = express()

  app.get('/', async (req, res, next) => {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'transfer-encoding': 'chunked',
    })
    res.write(/* html */ `<!DOCTYPE html>
<html>
	<head lang="en">
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>serve-img</title>
		<style>
			body {
				margin: 0;
			}
			main {
				display: flex;
				flex-wrap: wrap;
			}
			figure {
				display: inline-flex;
				flex-direction: column;
				margin: 0;
				width: min-content;
			}
			img {
				max-width: calc(100vw);
				max-height: calc(100dvh - 1rem);
			}
			figcaption {
				display: none;
				gap: 0.5rem;
				flex-direction: column;
			}
			figure:hover {
				outline: 1px solid red;
				padding: 0.5rem;
				border-radius: 0.25rem;
				gap: 0.5rem;
				margin: 1px;
			}
			figure:hover figcaption {
				display: inline-flex;
			}
			code {
				background-color: #333;
				color: #eee;
				padding: 0.25rem;
				border-radius: 0.25rem;
				word-break: break-all;
				display: inline-block;
			}
		</style>
	</head>
	<body>
		<script>
			window.addEventListener('click', event => {
				let code = event.target
				if (code.tagName.toLowerCase() != 'code') {
					return
				}
				let selection = window.getSelection()
				if (selection.rangeCount > 0) {
					selection.removeAllRanges()
				}
				let range = document.createRange()
				range.selectNode(code)
				selection.addRange(range)
				document.execCommand('copy')
			})
			window.addEventListener('mouseover', event => {
				let figure = event.target.closest('figure')
				console.log('enter',figure)
				if (!figure) return
				let caption = figure.querySelector('figcaption')
				let img = figure.querySelector('img')
				let rect = caption.getBoundingClientRect()
				console.log('height:', rect.height)
				if (rect.height) {
					img.style.maxWidth = 'calc(100vw - 1rem - 2px)'
					img.style.maxHeight = 'calc(100dvh - 2rem - ' + rect.height + 'px - 2px)'
				}
				figure.onmouseleave = () => {
					img.style.maxWidth = ''
					img.style.maxHeight = ''
				}
			})
		</script>
		<main>
`)
    try {
      for await (let image of scanDir(root_dir)) {
        let media = toMedia(root_dir, image)
        res.write(/* html */ `
			<figure>
					<div>
						<img src=${JSON.stringify(media.url)} loading="lazy">
					</div>
					<figcaption>
						<div>
							filename: <code>${escapeHTML(image.filename)}</code>
						</div>
						<div>
							dir: <code>${escapeHTML(image.dir)}</code>
						</div>
						<div>
							path: <code>${escapeHTML(join(image.dir, image.filename))}</code>
						</div>
					</figcaption>
			</figure>
				`)
      }
    } catch (error) {
      res.write(/* html */ `
			<pre><code>${error}</code></pre>
`)
    }

    res.end(/* html */ `
		</main>
	</body>
</html>
`)
  })

  app.use(express.static(root_dir))
  // app.use(express.json())
  // app.use(express.urlencoded({ extended: false }))

  app.listen(port, () => {
    print(port)
  })
}

main()
