import "~/styles/globals.css"
import "virtual:uno.css"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { isMobile } from "react-device-detect"
import { GlobalOverlayScrollbar } from "~/components/common/overlay-scrollbar"
import { Toast } from "~/components/common/toast"
import { SearchBar } from "~/components/common/search-bar"
import { useSearchBar } from "~/hooks/useSearch"
import { isEmbed } from "~/utils/embed"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function NotFoundComponent() {
  const nav = Route.useNavigate()
  nav({
    to: "/",
  })
}

function SearchFab() {
  const { toggle } = useSearchBar()
  return (
    <button
      type="button"
      title="搜索"
      aria-label="搜索"
      onClick={() => toggle(true)}
      className="fixed bottom-5 right-5 z-50 w-10 h-10 rounded-full grid place-items-center text-lg text-neutral-400 bg-white dark:bg-white/[0.06] border border-black/10 dark:border-white/10 shadow-lg opacity-70 hover:opacity-100 transition-opacity"
    >
      <span className="i-ph:magnifying-glass-duotone" />
    </button>
  )
}

function RootComponent() {
  useOnReload()
  useSync()
  usePWA()
  useEffect(() => {
    if (isEmbed) document.documentElement.classList.add("embed")
  }, [])
  return (
    <>
      <GlobalOverlayScrollbar
        className={$([
          !isMobile && !isEmbed && "px-4",
          !isEmbed && "md:(px-10)",
          !isEmbed && "lg:(px-24)",
          isEmbed && "px-2",
          "h-full overflow-x-auto",
        ])}
      >
        <main className={$([
          !isEmbed && "mt-2",
          "min-h-[calc(100vh-180px)]",
          "md:(min-h-[calc(100vh-175px)])",
          "lg:(min-h-[calc(100vh-194px)])",
        ])}
        >
          <Outlet />
        </main>
      </GlobalOverlayScrollbar>
      <SearchFab />
      <Toast />
      <SearchBar />
      {import.meta.env.DEV && (
        <>
          <ReactQueryDevtools buttonPosition="bottom-left" />
          <TanStackRouterDevtools position="bottom-right" />
        </>
      )}
    </>
  )
}
