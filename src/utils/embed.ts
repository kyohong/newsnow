/**
 * 嵌入模式（Embed Mode）检测：供 getstockradar.com 以 <iframe> 嵌入"新闻雷达"单页时使用。
 * - URL 显式参数 `?embed=true` 优先；
 * - 否则检测是否运行在 iframe 中（window.self !== window.top，跨域比较安全，读取 top 才抛错）。
 * 会话内不可变，模块级求值一次即可。
 */
function detectEmbed(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get("embed") === "true") return true
  } catch {
    // 非浏览器环境或 URL 解析失败时继续走 iframe 检测
  }
  try {
    return window.self !== window.top
  } catch {
    // 跨域 iframe 下比较即抛错，同样视为嵌入
    return true
  }
}

export const isEmbed = typeof window !== "undefined" ? detectEmbed() : false
