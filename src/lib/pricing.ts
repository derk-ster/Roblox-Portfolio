export interface PriceItem {
  label: string;
  robux?: string;
  usd?: string;
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

const SHARED_PAYMENT = [
  "Robux prices include Roblox tax in the final payment price.",
  "USD payments are through PayPal Business. No PayPal account is needed, card payments are accepted.",
  "Once half of the work is done, 50% payment is required.",
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
          {
            label:
              "Basic script: bug fixes, simple tools, basic buttons, interactions, cooldowns, or one straightforward gameplay feature",
            robux: "1,600+",
            usd: "$15+",
          },
          {
            label:
              "Intermediate script: abilities, movement mechanics, UI functionality, shops, data handling, weapons, or several connected gameplay features",
            robux: "3,200+",
            usd: "$30+",
          },
          {
            label:
              "Hard/complex script: combat systems, movement systems, inventories, advanced UI systems, custom frameworks, or multiple interconnected mechanics",
            robux: "5,500+",
            usd: "$50+",
          },
        ],
      },
    ],
    info: [
      "Prices are starting prices. More features, complexity, polish, debugging, or fast deadlines cost more.",
      "I can script full UI systems. Custom UI design is priced separately under UI.",
      ...SHARED_PAYMENT,
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
          { label: "Basic animation", robux: "850+", usd: "$8+" },
          { label: "Intermediate animation", robux: "1,100+", usd: "$10+" },
          { label: "Hard/complex animation", robux: "1,400+", usd: "$13+" },
        ],
      },
      {
        title: "Cutscenes",
        items: [
          { label: "Cutscenes", usd: "$5 per second" },
          { label: "5 second cutscene", usd: "$25+" },
          { label: "10 second cutscene", usd: "$50+" },
          { label: "15 second cutscene", usd: "$75+" },
        ],
      },
      {
        title: "Packs",
        items: [
          { label: "4 to 6 animations", robux: "4,000+", usd: "$38+" },
          { label: "7 to 10 animations", robux: "6,500+", usd: "$62+" },
          { label: "11 to 15 animations", robux: "9,500+", usd: "$90+" },
        ],
      },
    ],
    info: [
      "Prices are starting prices. More detail, longer animations, or fast deadlines cost more.",
      "More complex choreography, multiple characters, or detailed camera movement may cost more.",
      ...SHARED_PAYMENT,
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
          {
            label:
              "Basic model: simple props, crates, signs, basic tools, low-detail decor, or other straightforward models",
            robux: "1,100+",
            usd: "$10+",
          },
          {
            label:
              "Intermediate model: custom props, stylized objects, furniture, equipment, detailed assets, or models requiring custom shapes and design",
            robux: "2,200+",
            usd: "$20+",
          },
          {
            label:
              "Hard/complex model: highly detailed assets, complex stylized models, mechanical objects, textured assets, or models requiring extensive custom work",
            robux: "4,000+",
            usd: "$35+",
          },
        ],
      },
    ],
    info: [
      "Prices are starting prices. Texturing, UV work, extra detail, revisions, or fast deadlines cost more.",
      ...SHARED_PAYMENT,
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
          {
            label:
              "Basic build: simple rooms, small obby sections, basic structures, small environmental pieces, or straightforward Studio builds",
            robux: "1,600+",
            usd: "$15+",
          },
          {
            label:
              "Intermediate build: arenas, detailed rooms, small lobbies, larger obby sections, moderately detailed environments, or multi-area builds",
            robux: "4,500+",
            usd: "$40+",
          },
          {
            label:
              "Hard/complex build: full lobbies, full playable maps, large environments, detailed terrain, complex structures, or multiple themed areas",
            robux: "9,000+",
            usd: "$80+",
          },
        ],
      },
      {
        title: "Larger builds",
        items: [
          { label: "Small/full lobby", usd: "$80–$125+" },
          { label: "Medium detailed lobby", usd: "$125–$200+" },
          { label: "Large/polished lobby", usd: "$200+" },
          { label: "Full maps, based on size and detail", usd: "Custom quote" },
        ],
      },
    ],
    info: [
      "Prices are starting prices. More detail, larger spaces, custom assets, or fast deadlines cost more.",
      ...SHARED_PAYMENT,
    ],
    cta: "DM me with references, map size, style, deadline, and budget.",
  },
  {
    id: "vfx",
    title: "VFX",
    accent: "pink",
    groups: [
      {
        items: [
          {
            label:
              "Basic VFX: impact effects, small bursts, simple trails, basic auras, sparks, slashes, or other straightforward single effects",
            robux: "1,100+",
            usd: "$10+",
          },
          {
            label:
              "Intermediate VFX: full ability effects, ground slams, detailed movement effects, layered auras, larger attacks, or effects using multiple timed elements",
            robux: "2,200+",
            usd: "$20+",
          },
          {
            label:
              "Hard/complex VFX: multi-stage abilities, cinematic attacks, highly detailed effects, complex particle/beam combinations, custom meshes, or large coordinated VFX sequences",
            robux: "4,000+",
            usd: "$35+",
          },
        ],
      },
    ],
    info: [
      "Prices are starting prices. More layers, custom textures/models, complexity, sound syncing, or fast deadlines cost more.",
      ...SHARED_PAYMENT,
    ],
    cta: "DM me with references, style, deadline, and budget.",
  },
  {
    id: "ui",
    title: "UI",
    accent: "cyan",
    groups: [
      {
        title: "Prices",
        items: [
          {
            label:
              "Basic UI: simple buttons, popups, small HUD elements, loading screens, basic menus, or simple interface frames",
            robux: "1,600+",
            usd: "$10+",
          },
          {
            label:
              "Intermediate UI: shops, settings menus, profiles, upgrade menus, gamepass menus, or moderately detailed interface screens",
            robux: "2,800+",
            usd: "$18+",
          },
          {
            label:
              "Hard/complex UI: inventories, unit/character menus, detailed shops, large stylized menus, multi-section interfaces, or heavily customized UI designs",
            robux: "4,500+",
            usd: "$30+",
          },
        ],
      },
      {
        title: "UI packs",
        items: [
          { label: "3 to 5 UI screens", robux: "7,000+", usd: "$50+" },
          { label: "6 to 10 UI screens", robux: "12,500+", usd: "$90+" },
          { label: "11 to 15 UI screens", robux: "18,500+", usd: "$135+" },
        ],
      },
      {
        title: "Extras",
        items: [
          {
            label:
              "Custom icons/assets may cost extra depending on complexity",
          },
          {
            label:
              "Extra variants or additional states of the same UI are cheaper than completely new screens",
          },
          {
            label:
              "Mobile/tablet adjustments can be included depending on the project",
          },
          {
            label:
              "UI animation/tweening and scripting are priced separately unless included in a bundle",
          },
        ],
      },
    ],
    info: [
      "Prices are starting prices.",
      "Final price depends on complexity, number of screens, amount of custom artwork, revisions, polish, and deadline.",
      "I can create UI designs and import/setup the interface inside Roblox Studio.",
      "UI scripting is not included unless specifically agreed upon. I also offer scripting separately if the UI needs functionality.",
      "Larger UI packs receive discounted pricing compared to ordering every screen individually.",
      ...SHARED_PAYMENT,
    ],
    cta: "DM me with references, the screens you need, your preferred style, deadline, and budget.",
  },
  {
    id: "bundles",
    title: "Bundles",
    accent: "cyan",
    groups: [
      {
        items: [
          { label: "Animation + VFX, 1 move/ability", robux: "2,800+", usd: "$25+" },
          {
            label: "Simple ability setup, script + animation or VFX",
            robux: "4,000+",
            usd: "$35+",
          },
          { label: "Movement mechanic + animation", robux: "5,000+", usd: "$45+" },
          { label: "Movement system + animations", robux: "8,500+", usd: "$75+" },
          { label: "Combat mechanic + animation", robux: "5,500+", usd: "$50+" },
          { label: "Combat system + animations", robux: "11,000+", usd: "$100+" },
          { label: "Full system with animation and VFX", robux: "14,000+", usd: "$125+" },
          { label: "UI scripting + system setup", robux: "6,500+", usd: "$60+" },
        ],
      },
    ],
    info: [
      "Prices are starting prices.",
      "Final price depends on complexity, amount of content, polish, and deadline.",
      "Bundled services are priced based on the total work required across each role.",
      "Custom UI design is available as its own service. UI scripting stays separate unless a bundle includes it.",
      ...SHARED_PAYMENT,
    ],
    cta: "DM me with the full idea, references, deadline, and budget.",
  },
];
