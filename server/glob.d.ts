/* eslint-disable */

declare module 'glob:./sources/{*.ts,**/index.ts}' {
  export const cls: typeof import('./sources/cls/index')
  export const gelonghui: typeof import('./sources/gelonghui')
  export const github: typeof import('./sources/github')
  export const hackernews: typeof import('./sources/hackernews')
  export const jin10: typeof import('./sources/jin10')
  export const solidot: typeof import('./sources/solidot')
  export const wallstreetcn: typeof import('./sources/wallstreetcn')
  export const xueqiu: typeof import('./sources/xueqiu')
}
