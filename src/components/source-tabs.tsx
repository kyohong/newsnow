import type { SourceID } from "@shared/types"
import { mobileSourceFilterAtom } from "~/atoms"

interface SourceTab {
  key: string
  label: string
  ids: SourceID[] | null
}

const TABS: SourceTab[] = [
  { key: "all", label: "全部", ids: null },
  { key: "jin10", label: "金十", ids: ["jin10"] },
  { key: "cls", label: "财联社", ids: ["cls-telegraph", "cls-hot"] },
  { key: "wscn", label: "华见", ids: ["wallstreetcn-quick", "wallstreetcn-hot"] },
  { key: "xueqiu", label: "雪球", ids: ["xueqiu-hotstock"] },
  { key: "hn", label: "HN", ids: ["hackernews"] },
]

export function SourceTabs() {
  const [filter, setFilter] = useAtom(mobileSourceFilterAtom)
  const activeKey = filter ? (TABS.find(t => t.ids && t.ids.length === filter.length && t.ids.every(id => filter.includes(id)))?.key ?? "custom") : "all"
  return (
    <div className="md:hidden flex gap-2 overflow-x-auto px-2 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="数据源筛选">
      {TABS.map(tab => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeKey === tab.key}
          onClick={() => setFilter(tab.ids)}
          className={$(
            "shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all",
            activeKey === tab.key
              ? "text-[#04121d] bg-[#38bdf8] border border-transparent"
              : "text-neutral-400 bg-white dark:bg-white/[0.04] border border-black/10 dark:border-white/10",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
