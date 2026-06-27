import {
  DISCLAIMER_PARAGRAPHS,
  DISCLAIMER_TITLE,
} from "../../constants/disclaimer";
import "./NavDisclaimer.css";

export function NavDisclaimer() {
  return (
    <div className="nav-disclaimer">
      <p className="nav-disclaimer__title">{DISCLAIMER_TITLE}</p>
      {DISCLAIMER_PARAGRAPHS.map((paragraph) => (
        <p key={paragraph} className="nav-disclaimer__text">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
