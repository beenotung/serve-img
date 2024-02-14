export function parseArgs() {
  let root_dir = ''
  let port = 0

  process.argv.slice(2).forEach(arg => {
    if (+arg) {
      if (!port) {
        port = +arg
        return
      }
      console.error('Error: unexpected argument ' + JSON.stringify(arg))
      process.exit(1)
    }
    if (!root_dir) {
      root_dir = arg
      return
    }
    console.error('Error: unexpected argument ' + JSON.stringify(arg))
    process.exit(1)
  })

  port ||= 8100
  root_dir ||= '.'

  return { root_dir, port }
}
