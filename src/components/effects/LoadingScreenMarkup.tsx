import {
  LOADER_SESSION_KEY,
  PORTFOLIO_LOGO,
  PORTFOLIO_NAME,
} from "@/lib/constants";

/** Server-rendered loader shell — visible before React hydrates. */
export function LoadingScreenMarkup() {
  return (
    <div
      id="loading-screen"
      className="loading-screen"
      role="presentation"
      aria-hidden
      suppressHydrationWarning
    >
      <div className="loading-screen__bg" />
      <div className="loading-screen__intro">
        <p className="loading-screen__eyebrow">{PORTFOLIO_NAME}</p>
        <div className="loading-screen__bar" aria-hidden>
          <span />
        </div>
      </div>
      <div className="loading-screen__logo" id="loading-screen-logo">
        <div className="loading-screen__logo-spin">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PORTFOLIO_LOGO}
            alt=""
            width={120}
            height={120}
            className="loading-screen__logo-img"
            decoding="async"
            fetchPriority="high"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

export const LOADER_BOOT_SCRIPT = `(function(){try{var p=sessionStorage.getItem("${LOADER_SESSION_KEY}")==="1";if(!p){document.documentElement.classList.add("is-loading");}else{var el=document.getElementById("loading-screen");if(el)el.remove();}}catch(e){document.documentElement.classList.add("is-loading");}})();`;
