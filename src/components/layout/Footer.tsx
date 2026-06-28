import { Heart } from "lucide-react";
import { ROBLOX_PROFILE_URL } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-panel/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="text-lg font-bold gradient-text-animated">DErk2104</p>
            <p className="mt-1 text-sm text-muted">Roblox development portfolio</p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-4 text-sm text-muted">
              <li>
                <a href="#best-work" className="hover:text-cyan transition-colors">
                  Work
                </a>
              </li>
              <li>
                <a
                  href="#why-hire-me"
                  className="hover:text-cyan transition-colors"
                >
                  Why Hire Me
                </a>
              </li>
              <li>
                <a
                  href="#commission-process"
                  className="hover:text-cyan transition-colors"
                >
                  Commissions
                </a>
              </li>
              <li>
                <a
                  href={ROBLOX_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan transition-colors"
                >
                  Roblox
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 border-t border-white/5 pt-6 text-center text-sm text-muted sm:flex-row sm:justify-between">
          <p>© {year} DErk2104. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Roblox development
            <Heart className="h-3.5 w-3.5 text-pink" aria-hidden />
          </p>
        </div>
      </div>
    </footer>
  );
}
