import typescript from 'rollup-plugin-typescript';

export default {
  entry : "./src/index.ts",
  format : 'iife',
  dest : './index-r.js',

  plugins: [
    typescript()
  ]
}