# fast-archy

![npm bundle size](https://img.shields.io/bundlephobia/min/fast-archy) ![npm](https://img.shields.io/npm/v/fast-archy) ![NPM](https://img.shields.io/npm/l/fast-archy)

Render nested hierarchies `npm ls` style with unicode pipes.

Rewrite of [archy](https://www.npmjs.com/package/archy) in TypeScript, making it faster.

## Install

```sh
npm install fast-archy
```

## Usage

```js
import archy from "fast-archy";

const s = archy({
  label: "beep\none\ntwo",
  nodes: [
    "ity",
    {
      label: "boop",
      nodes: [
        {
          label: "o_O\nwheee",
          nodes: [
            {
              label: "oh",
              nodes: ["hello", "puny\nmeat"],
            },
            "creature",
          ],
        },
        "party\ntime!",
      ],
    },
  ],
});

console.log(s);
```

Output:

```
beep
│ one
│ two
├── ity
└─┬ boop
  ├─┬ o_O
  │ │ wheee
  │ ├─┬ oh
  │ │ ├── hello
  │ │ └── puny
  │ │     meat
  │ └── creature
  └── party
      time!
```

## API

### archy(obj, prefix?, opts?)

- `obj` `object|string` - Tree object or string label.
  - `obj.label` `string` - Node label.
  - `obj.nodes` `array` - Array of child nodes (same structure as `obj`).
- `prefix` `string` - Custom prefix for tree branches (default: `""`).
- `opts` `object` - Options object.
  - `opts.unicode` `boolean` - Use Unicode characters (default: `true`). If `false`, uses ASCII characters.

## Benchmarks

```
clk: ~4.03 GHz
cpu: 13th Gen Intel(R) Core(TM) i5-13400F
runtime: node 24.1.0 (x64-win32)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
• archy - simple tree
------------------------------------------- -------------------------------
fast-archy                   184.88 ns/iter 185.82 ns  █▂
                    (174.24 ns … 327.10 ns) 249.10 ns ▃██▅▅▂▂▁▂▁▁▁▁▁▁▁▁▁▁▁▁
                  gc(  1.43 ms …   4.21 ms) 412.22  b (138.33  b…812.80  b)

archy                        739.96 ns/iter 739.09 ns  █
                      (714.04 ns … 1.26 µs) 914.82 ns ▆██▅▃▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁
                  gc(  1.47 ms …   3.67 ms)   1.88 kb (  1.84 kb…  2.40 kb)

summary
  fast-archy
   4x faster than archy

• archy - medium tree
------------------------------------------- -------------------------------
fast-archy                     1.33 µs/iter   1.33 µs  ▆█
                        (1.30 µs … 1.62 µs)   1.52 µs ▃██▇▆▃▂▂▂▁▁▁▁▁▁▁▁▁▁▁▁
                  gc(  1.48 ms …   3.35 ms)   2.44 kb (  2.42 kb…  3.38 kb)

archy                          3.84 µs/iter   3.89 µs           ▄█
                        (3.52 µs … 4.39 µs)   4.09 µs ▂▁▁▁▂▄▂▂▄▂██▇▇█▂▂▁▂▁▂
                  gc(  1.76 ms …   2.89 ms)   8.47 kb (  7.81 kb…  8.49 kb)

summary
  fast-archy
   2.89x faster than archy

• archy - complex tree
------------------------------------------- -------------------------------
fast-archy                   744.95 µs/iter 749.10 µs  ▆▇█
                    (718.30 µs … 989.60 µs) 854.40 µs ▄████▆▄▃▄▂▂▂▁▂▁▁▁▁▁▁▁
                  gc(  1.46 ms …   2.12 ms)   1.39 mb (  1.13 mb…  2.09 mb)

archy                          1.42 ms/iter   1.42 ms  ▆█▅▃
                        (1.33 ms … 2.29 ms)   1.81 ms ▃████▃▂▃▁▂▂▁▁▁▁▁▁▁▁▁▁
                  gc(  1.53 ms …   2.47 ms)   3.20 mb (  2.85 mb…  4.34 mb)

summary
  fast-archy
   1.9x faster than archy

• archy - ascii mode
------------------------------------------- -------------------------------
fast-archy (ascii)           876.87 ns/iter 879.76 ns  ▄▅█▄
                      (851.05 ns … 1.28 µs) 950.17 ns ▂████▅▅▃▅▃▃▁▂▃▁▁▂▂▁▁▁
                  gc(  1.49 ms …   3.16 ms)   2.12 kb (  2.07 kb…  3.26 kb)

archy (ascii)                  2.98 µs/iter   3.00 µs              █▄█
                        (2.79 µs … 3.06 µs)   3.06 µs ▂▁▂▁▁▁▃▁▂▁▂▃█████▄▃▂▂
                  gc(  1.66 ms …   3.01 ms)   8.60 kb (  8.57 kb…  9.82 kb)

summary
  fast-archy (ascii)
   3.4x faster than archy (ascii)
```

## License

MIT
