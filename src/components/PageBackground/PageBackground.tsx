import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { usePageBackgroundStyle, usePageTextColorStyle } from "../../context/PageBackgroundContext";
import type { PageBackgroundId } from "../../constants/pageBackgrounds";
import "./PageBackground.css";

interface PageBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  pageId: PageBackgroundId;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

export function PageBackground({
  pageId,
  className,
  contentClassName,
  children,
  ...rest
}: PageBackgroundProps) {
  const backgroundStyle = usePageBackgroundStyle(pageId);
  const textColorStyle = usePageTextColorStyle(pageId);

  const rootClass = ["page-background", className].filter(Boolean).join(" ");
  const contentClass = ["page-background__content", contentClassName].filter(Boolean).join(" ");

  return (
    <div className={rootClass} {...rest}>
      <div
        className="page-background__backdrop"
        style={backgroundStyle as CSSProperties}
        aria-hidden="true"
      />
      <div className={contentClass} style={textColorStyle as CSSProperties}>
        {children}
      </div>
    </div>
  );
}

export function PageBackgroundBackdrop({
  pageId,
  className,
  style,
}: {
  pageId: PageBackgroundId;
  className?: string;
  style?: CSSProperties;
}) {
  const backgroundStyle = usePageBackgroundStyle(pageId);
  const backdropClass = ["page-background__backdrop", className].filter(Boolean).join(" ");

  return (
    <div
      className={backdropClass}
      style={{ ...backgroundStyle, ...style }}
      aria-hidden="true"
    />
  );
}
