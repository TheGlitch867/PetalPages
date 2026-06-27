import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from "react";
import {
  getPageBackgroundStyle,
  getPageBackgroundUrl,
  type PageBackgroundId,
  type PageBackgrounds,
} from "../constants/pageBackgrounds";
import { getPageTextColorStyle, type PageTextColors } from "../constants/pageTextColors";

interface PageBackgroundContextValue {
  pageBackgrounds: PageBackgrounds;
  pageTextColors: PageTextColors;
  getUrl: (pageId: PageBackgroundId) => string;
}

const PageBackgroundContext = createContext<PageBackgroundContextValue | null>(null);

interface PageBackgroundProviderProps {
  pageBackgrounds: PageBackgrounds;
  pageTextColors: PageTextColors;
  children: ReactNode;
}

export function PageBackgroundProvider({
  pageBackgrounds,
  pageTextColors,
  children,
}: PageBackgroundProviderProps) {
  const value = useMemo(
    () => ({
      pageBackgrounds,
      pageTextColors,
      getUrl: (pageId: PageBackgroundId) => getPageBackgroundUrl(pageId, pageBackgrounds),
    }),
    [pageBackgrounds, pageTextColors],
  );

  return (
    <PageBackgroundContext.Provider value={value}>{children}</PageBackgroundContext.Provider>
  );
}

function usePageBackgroundContext() {
  const context = useContext(PageBackgroundContext);
  if (!context) {
    throw new Error("usePageBackgroundStyle must be used within PageBackgroundProvider");
  }
  return context;
}

export function usePageBackgroundStyle(pageId: PageBackgroundId): CSSProperties {
  const { pageBackgrounds } = usePageBackgroundContext();
  return useMemo(
    () => getPageBackgroundStyle(pageId, pageBackgrounds),
    [pageBackgrounds, pageId],
  );
}

export function usePageBackgroundUrl(pageId: PageBackgroundId): string {
  const { getUrl } = usePageBackgroundContext();
  return getUrl(pageId);
}

export function usePageTextColorStyle(pageId: PageBackgroundId): CSSProperties {
  const { pageTextColors } = usePageBackgroundContext();
  return useMemo(
    () => getPageTextColorStyle(pageId, pageTextColors),
    [pageTextColors, pageId],
  );
}
