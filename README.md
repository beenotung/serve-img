# serve-img

A simple cli to show local images in browser.

[![npm Package Version](https://img.shields.io/npm/v/serve-img)](https://www.npmjs.com/package/serve-img)
[![Minified Package Size](https://img.shields.io/bundlephobia/min/serve-img)](https://bundlephobia.com/package/serve-img)
[![Minified and Gzipped Package Size](https://img.shields.io/bundlephobia/minzip/serve-img)](https://bundlephobia.com/package/serve-img)

## Usage

This package can be executed in cli via npx without installation.

Optionally, you can install it as global package as well to skip startup overhead:

```bash
npm i -g serve-img
```

Usage without installation:

```bash
npx -y serve-img [options]
```

Usage with installation:

```bash
serve-img [options]
```

### Options

The options are optional and they can be specified in any order.

**port**: default is 8100

**root_directory**: default is current directory

### Usage Example

```bash
# port: 8100, root_directory: current directory
npx -y serve-img

# port: 8200, root_directory: current directory
npx -y serve-img 8200

# port: 8100, root_directory: ~/Pictures
npx -y serve-img ~/Pictures

# port: 8200, root_directory: ~/Pictures
npx -y serve-img ~/Pictures 8200

# port: 8200, root_directory: ~/Pictures
npx -y serve-img 8200 ~/Pictures
```

### Example Output

```
root directory: /home/username/Pictures
listening on http://localhost:8200
listening on http://127.0.0.1:8200 (lo)
listening on http://192.168.1.100:8200 (wlp3s0)
```
