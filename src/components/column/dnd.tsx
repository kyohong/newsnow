import type { PropsWithChildren } from "react"
import type { SourceID } from "@shared/types"
import type { BaseEventPayload, ElementDragType } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types"
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge"
import { createPortal } from "react-dom"
import { useThrottleFn } from "ahooks"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { motion } from "framer-motion"
import { useWindowSize } from "react-use"
import { isMobile } from "react-device-detect"
import { DndContext } from "../common/dnd"
import { useSortable } from "../common/dnd/useSortable"
import { OverlayScrollbar } from "../common/overlay-scrollbar"
import type { ItemsProps } from "./card"
import { CardWrapper } from "./card"
import { currentColumnIDAtom, currentSourcesAtom, mobileSourceFilterAtom } from "~/atoms"
import { isEmbed } from "~/utils/embed"

const AnimationDuration = 200
const WIDTH = 350
export function Dnd() {
  const [items, setItems] = useAtom(currentSourcesAtom)
  const mobileFilter = useAtomValue(mobileSourceFilterAtom)
  const visibleItems = useMemo(
    () => (mobileFilter ? items.filter(id => mobileFilter.includes(id)) : items),
    [items, mobileFilter],
  )
  const currentColumnID = useAtomValue(currentColumnIDAtom)
  const sortable = currentColumnID === "focus"
  const [parent] = useAutoAnimate({ duration: AnimationDuration })
  useEntireQuery(items)
  const { width } = useWindowSize()
  const minWidth = useMemo(() => {
    // double padding = 32
    return Math.min(width - 32, WIDTH)
  }, [width])

  if (!visibleItems.length) return null

  return (
    <DndWrapper items={visibleItems} setItems={setItems} sortable={sortable}>
      <OverlayScrollbar defer className={isMobile ? "overflow-x-hidden" : "overflow-x-auto"}>
        <motion.ol
          className={isMobile
            ? "flex flex-col px-2 gap-3 pb-4"
            : $(isEmbed ? "grid w-full gap-3" : "grid w-full gap-6")}
          ref={parent}
          style={isMobile
            ? undefined
            : {
                gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
              }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.1,
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {visibleItems.map(id => (
            <motion.li
              key={id}
              transition={{
                type: "tween",
                duration: AnimationDuration / 1000,
              }}
              variants={{
                hidden: {
                  y: 20,
                  opacity: 0,
                },
                visible: {
                  y: 0,
                  opacity: 1,
                },
              }}
            >
              <SortableCardWrapper id={id} sortable={sortable} />
            </motion.li>
          ))}
        </motion.ol>
      </OverlayScrollbar>
    </DndWrapper>
  )
}

function DndWrapper({ items, setItems, sortable, children }: PropsWithChildren<{
  items: SourceID[]
  setItems: (items: SourceID[]) => void
  sortable: boolean
}>) {
  const onDropTargetChange = useCallback(({ location, source }: BaseEventPayload<ElementDragType>) => {
    const traget = location.current.dropTargets[0]
    if (!traget?.data || !source?.data) return
    const closestEdgeOfTarget = extractClosestEdge(traget.data)
    const fromIndex = items.indexOf(source.data.id as SourceID)
    const toIndex = items.indexOf(traget.data.id as SourceID)
    if (fromIndex === toIndex || fromIndex === -1 || toIndex === -1) return
    const update = reorderWithEdge({
      list: items,
      startIndex: fromIndex,
      indexOfTarget: toIndex,
      closestEdgeOfTarget,
      axis: "vertical",
    })
    setItems(update)
  }, [items, setItems])
  // 避免动画干扰
  const { run } = useThrottleFn(onDropTargetChange, {
    leading: true,
    trailing: true,
    wait: AnimationDuration,
  })
  const { el } = useAtomValue(goToTopAtom)
  if (!sortable) return children

  return (
    <DndContext onDropTargetChange={run} autoscroll={el ? { element: el } : undefined}>
      {children}
    </DndContext>
  )
}

function CardOverlay({ id }: { id: SourceID }) {
  return (
    <div className={$(
      "flex flex-col p-4",
      "bg-white dark:bg-[#18181b]",
      "border border-[#e5e7eb] dark:border-[rgba(255,255,255,0.08)]",
      !isiOS() && "rounded-xl",
    )}
    >
      <div className={$("flex justify-between mx-2 items-center")}>
        <div className="flex gap-2 items-center">
          <div
            className={$("w-8 h-8 rounded-full bg-cover")}
            style={{
              backgroundImage: `url(/icons/${id.split("-")[0]}.png)`,
            }}
          />
          <span className="flex flex-col">
            <span className="flex items-center gap-2">
              <span className="text-xl font-bold">
                {sources[id].name}
              </span>
            </span>
            <span className="text-xs op-70">拖拽中</span>
          </span>
        </div>
        <div className="flex gap-2 text-lg text-neutral-500 dark:text-neutral-400">
          <button
            type="button"
            className={$("i-ph:dots-six-vertical-duotone", "cursor-grabbing")}
          />
        </div>
      </div>
    </div>
  )
}

function SortableCardWrapper({ id, sortable }: ItemsProps & { sortable: boolean }) {
  const {
    isDragging,
    setNodeRef,
    setHandleRef,
    OverlayContainer,
  } = useSortable({ id })

  useEffect(() => {
    if (OverlayContainer) {
      OverlayContainer!.className += $(`bg-base`, !isiOS() && "rounded-2xl")
    }
  }, [OverlayContainer])

  return (
    <>
      <CardWrapper
        ref={setNodeRef}
        id={id}
        isDragging={isDragging}
        setHandleRef={sortable ? setHandleRef : undefined}
      />
      {OverlayContainer && createPortal(<CardOverlay id={id} />, OverlayContainer)}
    </>
  )
}
