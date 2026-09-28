{
  "brand": {
    "name": "AGROLINK",
    "tagline": "CONNECTING AGRICULTURE",
    "attributes": [
      "premium",
      "international",
      "trustworthy",
      "minimalist",
      "modern African agribusiness",
      "reliable supply connections",
      "growth + sustainability"
    ],
    "north_star": "A premium international agribusiness company with the simplicity of a modern technology brand.",
    "avoid": [
      "generic farming clichés (barn icons, rustic textures)",
      "cartoonish illustrations",
      "overloaded pages",
      "excessive gradients/parallax",
      "old-fashioned agricultural aesthetics",
      "transparent/glass backgrounds for content blocks"
    ]
  },
  "design_tokens": {
    "notes": [
      "Use the user-mandated palette. Green dominates; gold is a premium accent only.",
      "No heavy gradients; if used, keep to hero decorative overlays only (<20% viewport).",
      "Prefer off-white backgrounds for reading comfort; reserve dark green for footer + strong CTA bands."
    ],
    "css_custom_properties": {
      "/app/frontend/src/index.css": {
        "replace_root_tokens_with": {
          "--background": "72 33% 97%",
          "--foreground": "150 16% 11%",
          "--card": "0 0% 100%",
          "--card-foreground": "150 16% 11%",
          "--popover": "0 0% 100%",
          "--popover-foreground": "150 16% 11%",
          "--primary": "154 81% 13%",
          "--primary-foreground": "72 33% 97%",
          "--secondary": "120 20% 94%",
          "--secondary-foreground": "154 81% 13%",
          "--muted": "120 14% 93%",
          "--muted-foreground": "150 8% 43%",
          "--accent": "43 56% 47%",
          "--accent-foreground": "72 33% 97%",
          "--destructive": "0 72% 52%",
          "--destructive-foreground": "0 0% 98%",
          "--border": "120 10% 86%",
          "--input": "120 10% 86%",
          "--ring": "141 55% 33%",
          "--radius": "0.9rem",
          "--chart-1": "141 55% 33%",
          "--chart-2": "154 81% 13%",
          "--chart-3": "43 56% 47%",
          "--chart-4": "120 45% 46%",
          "--chart-5": "150 8% 43%"
        },
        "add_brand_hex_reference_comment": {
          "primary_dark_green": "#063B2A",
          "primary_green": "#1F8A3B",
          "fresh_green": "#5DBB32",
          "agricultural_gold": "#C9972B",
          "off_white": "#F7F9F5",
          "white": "#FFFFFF",
          "dark_text": "#17231D",
          "muted_text": "#66736B"
        },
        "additional_tokens_to_add": {
          "--shadow-sm": "0 1px 2px rgba(6,59,42,0.06)",
          "--shadow-md": "0 10px 30px rgba(6,59,42,0.10)",
          "--shadow-lg": "0 18px 60px rgba(6,59,42,0.14)",
          "--focus-ring": "0 0 0 4px rgba(31,138,59,0.18)",
          "--container": "72rem",
          "--section-y": "clamp(3rem, 6vw, 5.5rem)",
          "--leaf-pattern-opacity": "0.06"
        }
      }
    },
    "tailwind_usage": {
      "backgrounds": {
        "page": "bg-[hsl(var(--background))]",
        "section_alt": "bg-white",
        "dark_band": "bg-[#063B2A] text-[#F7F9F5]"
      },
      "text": {
        "heading": "text-[#17231D]",
        "body": "text-[#17231D]/90",
        "muted": "text-[#66736B]"
      },
      "borders": {
        "default": "border-[#17231D]/10",
        "subtle": "border-[#17231D]/8"
      },
      "shadows": {
        "card": "shadow-[0_10px_30px_rgba(6,59,42,0.10)]",
        "hover": "hover:shadow-[0_18px_60px_rgba(6,59,42,0.14)]"
      },
      "radius": {
        "cards": "rounded-2xl",
        "buttons": "rounded-xl"
      }
    }
  },
  "typography": {
    "font_family": {
      "primary": "Manrope",
      "fallback": "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
    },
    "google_fonts": {
      "include": "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
      "implementation": "Add <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"/> and the stylesheet link in /app/frontend/public/index.html (or equivalent). Then set body font-family in index.css."
    },
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight",
      "h2": "text-base md:text-lg font-medium text-[#66736B]",
      "h3": "text-xl sm:text-2xl font-bold",
      "section_label": "text-xs tracking-[0.22em] font-semibold text-[#1F8A3B]",
      "body": "text-sm sm:text-base leading-relaxed",
      "small": "text-xs text-[#66736B]"
    },
    "copy_rules": [
      "Keep paragraphs <= 3 lines on desktop where possible; split into bullets.",
      "Use section labels (ABOUT AGROLINK, SOLUÇÕES, PRODUTOS) to create corporate rhythm.",
      "Avoid long centered text blocks; left-align body copy."
    ]
  },
  "layout": {
    "grid": {
      "container": "mx-auto w-full max-w-[var(--container)] px-4 sm:px-6 lg:px-8",
      "section_spacing": "py-[var(--section-y)]",
      "bento_principle": "Use bento-like card groupings for value props, sectors, and solutions: 2 cols on mobile -> 3/4 cols on desktop with one featured card occasionally."
    },
    "page_shell": {
      "public_pages": "Sticky header + content sections + premium dark footer",
      "admin_pages": "App shell with left sidebar (desktop) + Sheet drawer (mobile), top bar with search + user menu"
    },
    "responsive_rules": [
      "Mobile-first: stack sections; convert timelines to vertical; filters become Sheet.",
      "Images: aspect-ratio boxes + lazy loading; avoid layout shift with fixed heights.",
      "Catalog grid: 1 col (mobile) / 2 (sm) / 3 (lg) / 4 (xl)."
    ]
  },
  "components": {
    "shadcn_primary": {
      "navigation": ["/app/frontend/src/components/ui/navigation-menu.jsx", "/app/frontend/src/components/ui/sheet.jsx"],
      "buttons": ["/app/frontend/src/components/ui/button.jsx"],
      "forms": ["/app/frontend/src/components/ui/form.jsx", "/app/frontend/src/components/ui/input.jsx", "/app/frontend/src/components/ui/textarea.jsx", "/app/frontend/src/components/ui/select.jsx", "/app/frontend/src/components/ui/label.jsx", "/app/frontend/src/components/ui/checkbox.jsx"],
      "content": ["/app/frontend/src/components/ui/card.jsx", "/app/frontend/src/components/ui/badge.jsx", "/app/frontend/src/components/ui/separator.jsx", "/app/frontend/src/components/ui/accordion.jsx", "/app/frontend/src/components/ui/tabs.jsx"],
      "overlays": ["/app/frontend/src/components/ui/dialog.jsx", "/app/frontend/src/components/ui/alert-dialog.jsx", "/app/frontend/src/components/ui/popover.jsx", "/app/frontend/src/components/ui/tooltip.jsx"],
      "data_display": ["/app/frontend/src/components/ui/table.jsx", "/app/frontend/src/components/ui/pagination.jsx", "/app/frontend/src/components/ui/skeleton.jsx", "/app/frontend/src/components/ui/progress.jsx"],
      "feedback": ["/app/frontend/src/components/ui/sonner.jsx"]
    },
    "custom_components_to_build": {
      "PublicHeader": {
        "description": "Sticky header that compacts on scroll; includes logo, primary nav, EN|PT toggle, Request a Quote CTA.",
        "micro_interactions": [
          "On scroll > 12px: reduce height, add subtle border + shadow",
          "Nav links: underline grows from left on hover",
          "Language toggle: segmented control with animated thumb"
        ],
        "data_testids": [
          "site-header",
          "nav-language-toggle",
          "nav-request-quote-button"
        ]
      },
      "Hero": {
        "description": "Cinematic agriculture photo with subtle leaf/line pattern overlay; headline + subhead + 2 CTAs.",
        "cta_variants": {
          "primary": "Request a Quote",
          "secondary": "Explore Products"
        },
        "pattern": "Use an SVG leaf-vein line pattern at opacity var(--leaf-pattern-opacity) positioned top-right; do not cover text.",
        "data_testids": ["hero-primary-cta", "hero-secondary-cta"]
      },
      "ValuePropCards": {
        "description": "4 cards with minimal line icons (lucide-react). Use off-white page background; cards white with subtle shadow.",
        "icon_style": "stroke-[#1F8A3B] with occasional gold dot accent",
        "data_testids": ["value-prop-card"]
      },
      "ProductCatalog": {
        "description": "Filterable grid with category tabs or select, search input, and product cards.",
        "filters_mobile": "Use Sheet for filters; keep search always visible.",
        "data_testids": [
          "product-catalog-search-input",
          "product-catalog-category-filter",
          "product-card",
          "product-card-view-button",
          "product-card-request-quote-button"
        ]
      },
      "ProductDetail": {
        "description": "Two-column layout: gallery + key specs card; below: tabs/accordion for description, applications, packaging, specs, availability.",
        "data_testids": ["product-detail-request-quote-button"]
      },
      "HowItWorksTimeline": {
        "description": "4-step timeline horizontal on desktop, vertical on mobile. Use numbered chips 01-04 with green border and gold dot.",
        "motion": "Fade-up each step on scroll; connecting line draws (CSS background-size animation).",
        "data_testids": ["how-it-works-step"]
      },
      "NetworkGraphic": {
        "description": "Animated connection graphic: Farmers → Suppliers → Products → Logistics → Markets.",
        "implementation": "Use lightweight SVG + Framer Motion path animations; avoid canvas for performance.",
        "data_testids": ["network-graphic"]
      },
      "QuoteForm": {
        "description": "Business enquiry form with strong validation, WhatsApp branch buttons (Angola/Namibia).",
        "data_testids": [
          "quote-form",
          "quote-form-submit-button",
          "whatsapp-angola-button",
          "whatsapp-namibia-button"
        ]
      },
      "AdminShell": {
        "description": "Professional admin with sidebar nav, top bar, tables, CRUD dialogs.",
        "data_testids": ["admin-sidebar", "admin-topbar-search"]
      }
    },
    "button_system": {
      "style": "Professional / Corporate with premium softness",
      "tokens": {
        "radius": "rounded-xl",
        "height": "h-11",
        "padding": "px-5",
        "shadow": "shadow-[0_10px_30px_rgba(6,59,42,0.10)]",
        "press": "active:scale-[0.98]",
        "transition": "transition-colors duration-200"
      },
      "variants": {
        "primary": "bg-[#1F8A3B] text-white hover:bg-[#167233] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(31,138,59,0.18)]",
        "secondary": "bg-white text-[#063B2A] border border-[#17231D]/10 hover:bg-[#F7F9F5]",
        "gold_accent": "bg-[#C9972B] text-[#063B2A] hover:bg-[#b88722]"
      },
      "rules": [
        "Gold buttons only for 1-2 moments per page (e.g., final CTA band, Request Quote in hero).",
        "Never use gradients on buttons (keep solid fills)."
      ]
    },
    "cards": {
      "base": "rounded-2xl bg-white border border-[#17231D]/10 shadow-[0_10px_30px_rgba(6,59,42,0.10)]",
      "hover": "hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(6,59,42,0.14)] transition-shadow duration-200",
      "rules": [
        "Do not animate transform on everything; only on card hover wrappers.",
        "Keep card content left-aligned; use small section labels for hierarchy."
      ]
    }
  },
  "motion": {
    "library": {
      "recommended": "framer-motion",
      "install": "npm i framer-motion",
      "usage": "Use for fade-up on scroll, header compact animation, SVG path draw in NetworkGraphic."
    },
    "principles": [
      "Fast + subtle: 160–220ms for hover, 280–420ms for entrance.",
      "Use opacity + translateY (6–12px) for section reveals.",
      "Respect prefers-reduced-motion: disable scroll animations and path drawing."
    ],
    "micro_interactions": {
      "buttons": [
        "hover: slight shade shift",
        "active: scale 0.98",
        "focus-visible: ring using --focus-ring"
      ],
      "nav": [
        "sticky -> compact on scroll",
        "language toggle thumb slides"
      ],
      "cards": ["hover lift -0.5 translateY + shadow deepen"],
      "images": ["image reveal: clip-path or opacity fade-in (no heavy parallax)"],
      "timeline": ["connector line draws as user scrolls into view"]
    }
  },
  "imagery": {
    "direction": [
      "Natural light, authentic African agribusiness scenes",
      "Green/earth tones; avoid overly staged studio shots",
      "Mix: landscapes + people + logistics + product close-ups",
      "Use consistent color grading: slightly warm highlights, controlled greens"
    ],
    "image_urls": {
      "hero_background": [
        {
          "url": "https://images.unsplash.com/photo-1579336013770-20af0d433bed?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZmFybWVyJTIwZmllbGQlMjBuYXR1cmFsJTIwbGlnaHQlMjBwb3J0cmFpdHxlbnwwfHx8Z3JlZW58MTc5MDYwNTY0NHww&ixlib=rb-4.1.0&q=85",
          "description": "Authentic farmer portrait in field; use as hero with dark-green overlay gradient-free (solid overlay at 35–45% opacity)."
        }
      ],
      "about_section": [
        {
          "url": "https://images.unsplash.com/photo-1567471894556-0d81c2936777?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwyfHxhZnJpY2FuJTIwZmFybWVyJTIwZmllbGQlMjBuYXR1cmFsJTIwbGlnaHQlMjBwb3J0cmFpdHxlbnwwfHx8Z3JlZW58MTc5MDYwNTY0NHww&ixlib=rb-4.1.0&q=85",
          "description": "About split image; crop to 4:5; keep subject left for text breathing room."
        }
      ],
      "sectors_livestock": [
        {
          "url": "https://images.unsplash.com/photo-1610784172483-b0bbc98742f4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwyfHxhZnJpY2FuJTIwY2F0dGxlJTIwcmFuY2glMjBoZXJkJTIwbGFuZHNjYXBlfGVufDB8fHxncmVlbnwxNzkwNjA1NjQ3fDA&ixlib=rb-4.1.0&q=85",
          "description": "Livestock sector card background; apply subtle dark overlay for legibility."
        }
      ],
      "logistics_supply_chain": [
        {
          "url": "https://images.unsplash.com/photo-1518889767729-1db630b9253b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYWdyaWJ1c2luZXNzJTIwbG9naXN0aWNzJTIwd2FyZWhvdXNlJTIwZ3JhaW4lMjBzaWxvfGVufDB8fHxncmVlbnwxNzkwNjA1NjQxfDA&ixlib=rb-4.1.0&q=85",
          "description": "Supply chain / network section background; use as wide banner with off-white content cards on top."
        }
      ]
    }
  },
  "page_blueprints": {
    "home": {
      "order": [
        "Sticky Header",
        "Hero (headline + 2 CTAs + trust strip)",
        "Value Props (4 cards)",
        "About (split image/text)",
        "Mission/Vision/Values (3 cards)",
        "Product Categories (showcase)",
        "Solutions (4 cards)",
        "How AgroLink Works (timeline)",
        "Why AgroLink (6-benefit grid)",
        "Agricultural Sectors (interactive image cards)",
        "Partners (placeholder)",
        "Network Graphic (animated SVG)",
        "Strong CTA band",
        "Footer"
      ],
      "trust_strip": "Under hero CTAs: small row of partner placeholders + 'Trusted connections across Africa' copy."
    },
    "products": {
      "layout": "Top intro + filter bar + grid + pagination",
      "filters": ["Search", "Category", "Availability", "Sort"],
      "empty_state": "Use Card with icon + 'No products match your filters' + Reset button."
    },
    "product_detail": {
      "layout": "Breadcrumb + title + two-column (gallery/specs) + tabs/accordion + related products",
      "cta": "Sticky mobile bottom bar with Request Quote button"
    },
    "contact_quote": {
      "layout": "Two-column: form + contact cards; WhatsApp buttons prominent",
      "validation": "Inline errors + toast on submit success/failure"
    },
    "admin": {
      "sections": [
        "Login",
        "Dashboard KPIs",
        "Products CRUD",
        "Categories CRUD",
        "Team CRUD",
        "Partners CRUD",
        "Enquiries inbox",
        "Settings"
      ],
      "tables": "Use shadcn Table + pagination; row actions in DropdownMenu; bulk actions bar when selecting rows."
    }
  },
  "accessibility": {
    "requirements": [
      "WCAG AA contrast: ensure muted text still readable on off-white.",
      "Visible focus states on all interactive elements (ring + outline).",
      "Keyboard navigation for menus, dialogs, tabs.",
      "Use aria-labels for icon-only buttons (e.g., language toggle on mobile).",
      "Respect prefers-reduced-motion."
    ]
  },
  "testing_attributes": {
    "rule": "All interactive and key informational elements MUST include data-testid (kebab-case).",
    "examples": [
      "data-testid=\"nav-request-quote-button\"",
      "data-testid=\"product-catalog-search-input\"",
      "data-testid=\"admin-products-add-button\"",
      "data-testid=\"enquiry-status-badge\""
    ]
  },
  "implementation_notes_for_js": {
    "react_files": "Project uses .js/.jsx. Write components in .jsx and keep named exports for components, default exports for pages.",
    "icons": "Use lucide-react (already common with shadcn). Do not use emoji icons.",
    "images": "Use <img loading=\"lazy\" decoding=\"async\" /> and set width/height or aspect-ratio wrappers to prevent CLS."
  },
  "instructions_to_main_agent": [
    "Replace the default CRA App.css centered header styles; do not center the entire app container.",
    "Update /app/frontend/src/index.css :root tokens to match the mandated green/gold system (values provided above).",
    "Build a bilingual header with a visible EN|PT segmented toggle; store language in global state (context) and persist to localStorage.",
    "Use shadcn components for all inputs, selects, dialogs, sheets, tables, tabs, accordion, pagination.",
    "Keep gold as a premium accent: only for small highlights (badges, dots, one CTA band).",
    "Implement sticky compact-on-scroll header and subtle scroll reveal animations using Framer Motion + IntersectionObserver.",
    "Ensure every button/link/input/menu item has data-testid in kebab-case.",
    "Admin: implement table toolbars with search + filters + column visibility + bulk actions; use DropdownMenu for row actions."
  ],
  "references": {
    "structure_reference": "farmfeed.com.br (structure only)",
    "inspiration_sources": [
      {
        "title": "Agriculture website design inspiration roundup",
        "url": "https://me.muz.li/oripio/agriculture-website-design"
      },
      {
        "title": "Dribbble agribusiness concept",
        "url": "https://dribbble.com/shots/25135978-AgrisVara-Website-Design-Creasions"
      },
      {
        "title": "Shadcn admin kit",
        "url": "https://www.shadcnblocks.com/admin-dashboard"
      },
      {
        "title": "Shadcn table template",
        "url": "https://www.shadcn.io/template/sadmann7-shadcn-table"
      }
    ]
  },

  "General UI UX Design Guidelines": "- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals."
}
