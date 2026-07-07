export interface PriceItem {
  label: string;
  robux: string;
  usd: string;
}

export interface PriceGroup {
  title?: string;
  items: PriceItem[];
}

export interface PricingCategory {
  id: string;
  title: string;
  accent: "cyan" | "purple" | "pink" | "orange" | "lime";
  groups: PriceGroup[];
  info: string[];
  cta: string;
}

const SHARED_INFO = [
  "Prices are starting prices.",
  "Robux prices include Roblox tax in the final payment amount.",
  "USD prices do not need Roblox tax added.",
  "50% payment is required once half the work is done.",
  "Final files are sent after full payment is complete.",
];

export const PRICING_CATEGORIES: PricingCategory[] = [
  {
    id: "scripting",
    title: "Scripting",
    accent: "cyan",
    groups: [
      {
        items: [
          { label: "Small bug fix, 1 clear issue", robux: "300+", usd: "$3+" },
          { label: "Basic script, 1 simple feature", robux: "700+", usd: "$6+" },
          { label: "Tool script, weapon/tool/item", robux: "1,200+", usd: "$10+" },
          {
            label: "Ability script, dash, boost, attack, power",
            robux: "1,500+",
            usd: "$13+",
          },
          {
            label: "Movement mechanic, slide, dash, roll, double jump",
            robux: "2,000+",
            usd: "$18+",
          },
          {
            label: "Movement system, multiple mechanics together",
            robux: "3,500+",
            usd: "$30+",
          },
          {
            label: "UI system scripting, buttons, menus, shops, inventory logic",
            robux: "3,500+",
            usd: "$30+",
          },
          {
            label: "Combat system, basic attacks, blocking, cooldowns",
            robux: "4,000+",
            usd: "$35+",
          },
          {
            label: "Custom system, multiple features",
            robux: "5,500+",
            usd: "$45+",
          },
        ],
      },
    ],
    info: [
      ...SHARED_INFO.slice(0, 1),
      "More features, cleaner polish, or fast deadlines cost more.",
      "I can script full UI systems, but I do not make custom UI designs.",
      ...SHARED_INFO.slice(1),
    ],
    cta: "DM me with what system you need, references, deadline, and budget.",
  },
  {
    id: "animation",
    title: "Animation",
    accent: "purple",
    groups: [
      {
        title: "Single animations",
        items: [
          {
            label: "Static idle/blocking loop, 1–3 seconds",
            robux: "450+",
            usd: "$4+",
          },
          {
            label: "Walking/blocking loop, 1–3 seconds",
            robux: "520+",
            usd: "$5+",
          },
          {
            label: "Basic movement animation, 0.5–2 seconds",
            robux: "600+",
            usd: "$6+",
          },
          {
            label: "Dash, slide, roll, jump animation",
            robux: "600+",
            usd: "$6+",
          },
          {
            label: "Combat animation, swing, hit, block, parry",
            robux: "750+",
            usd: "$7+",
          },
          {
            label: "Transition animation, guard swap or pose change",
            robux: "400+",
            usd: "$4+",
          },
        ],
      },
      {
        title: "Packs",
        items: [
          { label: "4–6 animations", robux: "2,000+", usd: "$18+" },
          { label: "7–10 animations", robux: "3,500+", usd: "$30+" },
          { label: "11–15 animations", robux: "5,500+", usd: "$45+" },
        ],
      },
    ],
    info: [
      ...SHARED_INFO.slice(0, 1),
      "More detail, longer animations, or fast deadlines cost more.",
      "R6 rigs only — emotes are made in Blender for Roblox.",
      ...SHARED_INFO.slice(1),
    ],
    cta: "DM me with references, deadline, budget, and details.",
  },
  {
    id: "modeling",
    title: "3D Modeling",
    accent: "lime",
    groups: [
      {
        items: [
          { label: "Simple prop, low detail object", robux: "300+", usd: "$3+" },
          { label: "Small asset, crate, sign, simple decor", robux: "500+", usd: "$5+" },
          { label: "Weapon/tool, sword, hammer, item", robux: "1,000+", usd: "$9+" },
          { label: "Detailed asset, clean shape and details", robux: "1,800+", usd: "$16+" },
          { label: "Stylized model, more custom design", robux: "2,500+", usd: "$22+" },
          { label: "Asset pack, 4–6 simple assets", robux: "3,500+", usd: "$30+" },
        ],
      },
    ],
    info: [
      ...SHARED_INFO.slice(0, 1),
      "Textures, extra detail, changes, or fast deadlines cost more.",
      ...SHARED_INFO.slice(1),
    ],
    cta: "DM me with references, style, deadline, and budget.",
  },
  {
    id: "building",
    title: "Building",
    accent: "orange",
    groups: [
      {
        items: [
          { label: "Single prop/detail piece", robux: "300+", usd: "$3+" },
          { label: "Small room, 1 basic room", robux: "1,000+", usd: "$9+" },
          { label: "Obby section, 5–10 obstacles", robux: "1,500+", usd: "$13+" },
          { label: "Arena, one playable fight area", robux: "2,500+", usd: "$22+" },
          { label: "Lobby, small spawn/lobby area", robux: "3,500+", usd: "$30+" },
          { label: "Medium lobby, multiple sections/details", robux: "5,000+", usd: "$40+" },
          { label: "Small map, one full playable area", robux: "7,000+", usd: "$55+" },
        ],
      },
    ],
    info: [
      ...SHARED_INFO.slice(0, 1),
      "More detail, larger spaces, or fast deadlines cost more.",
      ...SHARED_INFO.slice(1),
    ],
    cta: "DM me with references, map size, deadline, and budget.",
  },
  {
    id: "vfx",
    title: "VFX",
    accent: "pink",
    groups: [
      {
        items: [
          { label: "Simple VFX, 1 quick effect", robux: "500+", usd: "$5+" },
          { label: "Impact VFX, hit, ground slam, burst", robux: "700+", usd: "$6+" },
          { label: "Movement VFX, dash, jump, trail, slide", robux: "800+", usd: "$7+" },
          { label: "Ability VFX, one full ability effect", robux: "1,200+", usd: "$10+" },
          { label: "Aura VFX, looped body effect", robux: "1,200+", usd: "$10+" },
          { label: "VFX pack, 3–5 effects", robux: "3,000+", usd: "$25+" },
          { label: "Cinematic VFX, cutscene or special move", robux: "3,500+", usd: "$30+" },
        ],
      },
    ],
    info: [
      ...SHARED_INFO.slice(0, 1),
      "More particles, timing, sound syncing, or fast deadlines cost more.",
      ...SHARED_INFO.slice(1),
    ],
    cta: "DM me with references, style, deadline, and budget.",
  },
  {
    id: "bundles",
    title: "Bundles",
    accent: "cyan",
    groups: [
      {
        items: [
          { label: "Animation + VFX, 1 move/ability", robux: "1,500+", usd: "$13+" },
          {
            label: "Simple ability setup, script + animation or VFX",
            robux: "3,000+",
            usd: "$25+",
          },
          { label: "Movement mechanic + animation", robux: "3,500+", usd: "$30+" },
          { label: "Movement system + animations", robux: "5,000+", usd: "$40+" },
          { label: "Combat mechanic + animation", robux: "5,000+", usd: "$40+" },
          { label: "Combat system + animations", robux: "6,500+", usd: "$55+" },
          { label: "Full system with animation and VFX", robux: "8,000+", usd: "$65+" },
          { label: "UI scripting + system setup", robux: "6,000+", usd: "$50+" },
        ],
      },
    ],
    info: [
      ...SHARED_INFO.slice(0, 1),
      "Final price depends on detail, amount of work, and deadline.",
      "I can script UI systems, but I do not make custom UI designs.",
      ...SHARED_INFO.slice(1),
    ],
    cta: "DM me with the full idea, references, deadline, and budget.",
  },
];
