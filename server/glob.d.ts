/* eslint-disable */

declare module 'glob:./sources/{*.ts,**/index.ts}' {
  export const cls: typeof import('./sources/cls/index')
  export const github: typeof import('./sources/github')
  export const hackernews: typeof import('./sources/hackernews')
  export const solidot: typeof import('./sources/solidot')
  export const v2ex: typeof import('./sources/v2ex')
  export const wallstreetcn: typeof import('./sources/wallstreetcn')
  export const xueqiu: typeof import('./sources/xueqiu')
}
