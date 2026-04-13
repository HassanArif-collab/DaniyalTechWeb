const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageOrientation, TableOfContents, SectionType, LevelFormat,
} = require("docx");
const fs = require("fs");

// ─── Palette: GO-1 Graphite Orange (PRD / Proposal) ───
const P = {
  bg: "1A2330",
  primary: "FFFFFF",
  accent: "D4875A",
  cover: { titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078" },
  table: { headerBg: "D4875A", headerText: "FFFFFF", accentLine: "D4875A", innerLine: "DDD0C8", surface: "F8F0EB" },
};
const bodyPalette = {
  primary: "1A2330",
  body: "2C3E50",
  secondary: "607080",
  accent: "D4875A",
  surface: "F8F0EB",
};

const c = (hex) => hex.replace("#", "");

// ─── Helpers ───
function heading(text, level = HeadingLevel.HEADING_1) {
  const sizes = { [HeadingLevel.HEADING_1]: 32, [HeadingLevel.HEADING_2]: 28, [HeadingLevel.HEADING_3]: 24 };
  const befores = { [HeadingLevel.HEADING_1]: 360, [HeadingLevel.HEADING_2]: 280, [HeadingLevel.HEADING_3]: 200 };
  return new Paragraph({
    heading: level,
    spacing: { before: befores[level] || 240, after: 120, line: 312 },
    children: [new TextRun({ text, bold: true, size: sizes[level] || 28, color: c(bodyPalette.primary), font: { ascii: "Times New Roman", eastAsia: "SimHei" } })],
  });
}

function body(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 312 },
    children: [new TextRun({ text, size: 24, color: c(bodyPalette.body), font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })],
  });
}

function bodyBold(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 312 },
    children: [new TextRun({ text, size: 24, color: c(bodyPalette.body), bold: true, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })],
  });
}

function bodyMulti(runs) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 312 },
    children: runs.map(r => {
      if (typeof r === "string") return new TextRun({ text: r, size: 24, color: c(bodyPalette.body), font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } });
      return new TextRun({ text: r.text, size: 24, color: c(bodyPalette.body), bold: r.bold || false, italics: r.italics || false, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } });
    }),
  });
}

function spacer(h = 120) {
  return new Paragraph({ spacing: { before: h, after: 0 }, children: [] });
}

// ─── Table builder ───
function makeTable(headers, rows, colWidths) {
  const t = bodyPalette.table || P.table;
  const totalCols = headers.length;
  const widths = colWidths || headers.map(() => Math.floor(100 / totalCols));

  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map((text, i) => new TableCell({
      width: { size: widths[i], type: WidthType.PERCENTAGE },
      children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text, bold: true, size: 21, color: c(t.headerText), font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] })],
      shading: { type: ShadingType.CLEAR, fill: c(t.headerBg) },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
    })),
  });

  const dataRows = rows.map((row, ri) => new TableRow({
    cantSplit: true,
    children: row.map((text, i) => new TableCell({
      width: { size: widths[i], type: WidthType.PERCENTAGE },
      children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text, size: 21, color: c(bodyPalette.body), font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })] })],
      shading: ri % 2 === 0 ? { type: ShadingType.CLEAR, fill: c(t.surface) } : { type: ShadingType.CLEAR, fill: "FFFFFF" },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
    })),
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(t.accentLine) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(t.accentLine) },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: c(t.innerLine) },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [headerRow, ...dataRows],
  });
}

function tableCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 200 },
    children: [new TextRun({ text, italics: true, size: 20, color: c(bodyPalette.secondary), font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })],
  });
}

// ─── Cover Page (R4 Top Color Block) ───
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

function buildCover() {
  const titleText = "E-Commerce Website";
  const subtitleText = "Product Requirements Document";
  const metaLines = [
    "Industry: Electronics Retail (Pakistan)",
    "Document Type: PRD / Technical Specification",
    "Version: 1.0",
    "Date: April 2026",
  ];

  // R4: Top color block with accent strip
  const colorBlockHeight = 5800;
  const contentAreaTop = colorBlockHeight + 400;

  return [
    new Table({
      borders: allNoBorders,
      rows: [
        new TableRow({
          height: { value: 16838, rule: "exact" },
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: allNoBorders,
              verticalAlign: "top",
              children: [
                // Color block with accent strip
                new Table({
                  borders: allNoBorders,
                  rows: [
                    new TableRow({
                      height: { value: colorBlockHeight, rule: "exact" },
                      children: [
                        new TableCell({
                          width: { size: 100, type: WidthType.PERCENTAGE },
                          borders: allNoBorders,
                          shading: { type: ShadingType.CLEAR, fill: c(P.bg) },
                          verticalAlign: "bottom",
                          children: [
                            // Accent strip
                            new Paragraph({
                              spacing: { before: 0, after: 200 },
                              indent: { left: 900, right: 900 },
                              border: { top: { style: BorderStyle.SINGLE, size: 18, color: c(P.accent), space: 20 } },
                              children: [],
                            }),
                            // Title
                            new Paragraph({
                              spacing: { before: 400, after: 100 },
                              indent: { left: 900 },
                              children: [new TextRun({ text: titleText, bold: true, size: 72, color: c(P.cover.titleColor), font: { ascii: "Times New Roman", eastAsia: "SimHei" } })],
                            }),
                            // Subtitle
                            new Paragraph({
                              spacing: { before: 100, after: 400 },
                              indent: { left: 900 },
                              children: [new TextRun({ text: subtitleText, size: 32, color: c(P.cover.subtitleColor), font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                // Meta info below color block
                ...metaLines.map((line, i) => new Paragraph({
                  spacing: { before: i === 0 ? 400 : 80, after: 80 },
                  indent: { left: 900 },
                  children: [new TextRun({ text: line, size: 22, color: c(bodyPalette.secondary), font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })],
                })),
              ],
            }),
          ],
        }),
      ],
    }),
  ];
}

// ─── TOC Section ───
function buildTOCSection() {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 360 },
      children: [new TextRun({ text: "Table of Contents", bold: true, size: 32, color: c(bodyPalette.primary), font: { ascii: "Times New Roman", eastAsia: "SimHei" } })],
    }),
    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
    }),
    new Paragraph({
      spacing: { before: 200 },
      children: [new TextRun({
        text: "Note: This Table of Contents is generated via field codes. To ensure page number accuracy after editing, please right-click the TOC and select \"Update Field.\"",
        italics: true, size: 18, color: "888888",
      })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── BODY CONTENT ───
function buildBody() {
  const content = [];

  // 1. EXECUTIVE SUMMARY
  content.push(heading("1. Executive Summary"));
  content.push(body("This Product Requirements Document (PRD) defines the complete specification for a minimalist, clean e-commerce website designed specifically for the Pakistani electronics retail market. The website will serve as an online storefront for selling electronics products including mobile phones, AirPods, hands-free devices, chargers, laptops, and accessories. The platform is built around two core principles: simplicity for the end user and powerful control for the administrator."));
  content.push(body("The primary differentiator of this platform is its WhatsApp-native buying experience. Rather than forcing users through a complex checkout process with payment gateways, the website will allow customers to initiate a purchase by sending a pre-filled message directly to the store owner's WhatsApp. This approach aligns perfectly with Pakistani consumer behavior, where over 80% of e-commerce transactions are Cash on Delivery (COD) and WhatsApp is the dominant communication channel. The website acts as a beautiful, searchable product catalog that funnels high-intent buyers into personal WhatsApp conversations where trust is built and deals are closed."));
  content.push(body("The design philosophy is deliberately anti-generic: no default blue/purple gradients, no overused Inter/Roboto fonts, no cookie-cutter AI aesthetics. Instead, the visual identity draws inspiration from award-winning minimalist designs on Behance, Dribbble, and Awwwards, combining warm earthy tones with premium typography to create a distinctive brand presence. The tech stack is optimized for free hosting, fast performance on Pakistani mobile networks, and seamless admin control over products, categories, tags, and media."));

  // 2. PROJECT OVERVIEW & OBJECTIVES
  content.push(heading("2. Project Overview & Objectives"));
  content.push(heading("2.1 Business Context", HeadingLevel.HEADING_2));
  content.push(body("Pakistan's e-commerce market reached $5.77 billion in 2025 and is projected to grow to $20.41 billion by 2029 at a CAGR of 22.2%. With 85 million social media users and 64% of the population under 30, the digital consumer base is expanding rapidly. However, the electronics retail segment remains dominated by either large marketplaces like Daraz that charge high commissions, or informal WhatsApp/Facebook sellers who lack professional storefronts. This website bridges that gap, providing a professional, branded online presence with the personal touch of WhatsApp commerce."));
  content.push(body("The target business is a small-to-medium electronics retailer operating primarily in Pakistan, selling products such as smartphones, AirPods, hands-free earphones, chargers, power banks, and other accessories. The owner needs a platform that is free to host, easy to manage without technical expertise, and designed to convert visitors into WhatsApp conversations where sales are finalized."));

  content.push(heading("2.2 Project Goals", HeadingLevel.HEADING_2));
  content.push(makeTable(
    ["Goal ID", "Goal Description", "Success Metric"],
    [
      ["G-01", "Create a professional, minimalist e-commerce storefront that differentiates from generic AI-designed websites", "Positive user feedback on design uniqueness; zero confusion with competitor sites"],
      ["G-02", "Enable WhatsApp-native purchasing flow for Pakistani consumers", "60%+ of product inquiries initiated via WhatsApp button"],
      ["G-03", "Provide admin with full control over products, categories, tags, and media without developer dependency", "Admin can add/edit/delete products within 2 minutes without assistance"],
      ["G-04", "Implement advanced search and filtering for electronics products", "Users find target products within 3 clicks or 2 search queries"],
      ["G-05", "Achieve zero-cost hosting for MVP phase", "Monthly hosting cost = $0 during launch phase"],
      ["G-06", "Optimize for Pakistani mobile networks (3G/4G) and Core Web Vitals", "LCP < 2.0s on 4G; INP < 200ms; CLS < 0.1"],
    ],
    [10, 55, 35]
  ));
  content.push(tableCaption("Table 1: Project Goals and Success Metrics"));

  content.push(heading("2.3 Scope Boundaries", HeadingLevel.HEADING_2));
  content.push(body("In Scope: Product catalog with images and videos, category and tag management, faceted search and filtering, WhatsApp buy button integration, admin dashboard for product management, SEO optimization for Pakistani market, responsive mobile-first design, and free hosting deployment. Out of Scope: Online payment gateway integration (Phase 2), user accounts and authentication (Phase 2), inventory management with barcode scanning, multi-vendor marketplace functionality, mobile app development, and automated shipping/courier integration."));

  // 3. TARGET USERS & PERSONAS
  content.push(heading("3. Target Users & User Personas"));
  content.push(heading("3.1 Primary User Personas", HeadingLevel.HEADING_2));

  content.push(bodyBold("Persona 1: Ahmed, The Tech-Savvy Student (Age 20-25)"));
  content.push(body("Ahmed is a university student in Lahore who researches gadgets extensively before buying. He watches YouTube reviews, compares prices across Daraz and PriceOye, and always checks if a phone is PTA-approved. He browses on his Samsung Galaxy A-series phone, usually between 8 PM and midnight. He prefers COD because he doesn't trust online payments, and he wants to inspect the product before paying. Ahmed will use the search and filter features heavily, looking for phones under PKR 50,000 with specific RAM and storage requirements. He expects fast page loads on his 4G connection and clear product specifications."));

  content.push(bodyBold("Persona 2: Fatima, The Practical Professional (Age 28-35)"));
  content.push(body("Fatima works in an office in Karachi and needs reliable accessories for her daily commute. She's looking for quality AirPods, chargers, and hands-free devices. She values warranty information and brand authenticity above rock-bottom prices. She browses during her lunch break and commutes, often on slower mobile connections. She will likely use the WhatsApp button to ask about warranty terms and delivery timelines before committing to a purchase. She appreciates clean design that doesn't waste her time with unnecessary animations or clutter."));

  content.push(bodyBold("Persona 3: Omar, The Admin/Store Owner (Age 25-40)"));
  content.push(body("Omar is the store owner who manages the entire product catalog. He is comfortable with technology but is not a developer. He needs to quickly add new products with multiple images and videos, organize them into categories, assign tags for filtering, and control which products appear on the homepage as featured items. He manages orders through WhatsApp, confirming COD deliveries by phone. He wants the admin panel to be intuitive enough that he can manage it from his phone during downtime, without needing to open a laptop."));

  content.push(heading("3.2 User Role Matrix", HeadingLevel.HEADING_2));
  content.push(makeTable(
    ["Capability", "Guest User", "Admin"],
    [
      ["Browse products and categories", "Yes", "Yes"],
      ["Search and filter products", "Yes", "Yes"],
      ["View product details, images, videos", "Yes", "Yes"],
      ["Initiate WhatsApp purchase", "Yes", "Yes"],
      ["Add/edit/delete products", "No", "Yes"],
      ["Manage categories and hierarchy", "No", "Yes"],
      ["Create and assign tags", "No", "Yes"],
      ["Upload product images and videos", "No", "Yes"],
      ["Set featured products and homepage layout", "No", "Yes"],
      ["View order inquiries via WhatsApp", "No", "Yes"],
      ["Access admin dashboard", "No", "Yes"],
    ],
    [45, 27, 28]
  ));
  content.push(tableCaption("Table 2: User Role Capability Matrix"));

  // 4. USER JOURNEY MAPPING
  content.push(heading("4. User Journey Mapping"));
  content.push(heading("4.1 Buyer Journey (Guest User)", HeadingLevel.HEADING_2));

  content.push(bodyBold("Stage 1: Discovery"));
  content.push(body("The user arrives at the website through a social media link (Instagram/Facebook ad, WhatsApp forward, or organic search). The homepage loads instantly with a clean hero section featuring 2-3 featured products and clear category navigation. The minimalist design immediately communicates professionalism and trust. No pop-ups, no cookie banners blocking content, no auto-playing videos. The user sees the category grid (Mobiles, AirPods, Hands-Free, Chargers, Accessories) and a prominent search bar."));

  content.push(bodyBold("Stage 2: Exploration"));
  content.push(body("The user clicks on a category (e.g., 'AirPods') or types a search query. The product listing page displays a clean grid with high-quality product images, product names, prices in PKR, and a subtle 'In Stock' badge. The left sidebar (desktop) or bottom sheet (mobile) shows filter options: Price Range (slider), Brand (checkboxes), Rating (stars), and Availability (toggle). As the user applies filters, the product grid updates instantly with a smooth fade transition. Active filter chips appear at the top, each removable with a single click."));

  content.push(bodyBold("Stage 3: Evaluation"));
  content.push(body("The user clicks on a product card. The product detail page opens with a large hero image, a thumbnail strip below for multiple images, and a video player if a product demo is available. Key information is immediately visible: product name, price in PKR, warranty type (Brand/Shop/None), and a prominent 'Order via WhatsApp' button. Below, organized tabs or sections show: Description, Specifications (structured table), Highlights, and Reviews. Trust badges are visible near the CTA: 'Cash on Delivery Available', 'Free Delivery Across Pakistan', and '7-Day Easy Returns'."));

  content.push(bodyBold("Stage 4: Purchase Intent"));
  content.push(body("The user clicks 'Order via WhatsApp'. A WhatsApp chat window opens with a pre-filled message: 'Hi! I'm interested in [Product Name] (PKR [Price]). Is it available?' The store owner responds with availability confirmation, delivery timeline, and any questions. The conversation builds trust. The user confirms the order and provides delivery address. No account creation, no checkout form, no payment gateway. The entire transaction happens through a trusted, familiar channel."));

  content.push(bodyBold("Stage 5: Post-Purchase"));
  content.push(body("The user receives order confirmation via WhatsApp. Delivery updates are shared proactively. After delivery, the user may receive a follow-up message requesting a review or recommending related products. If the user had a positive experience, they may share the website link with friends, creating organic referral traffic."));

  content.push(heading("4.2 Admin Journey", HeadingLevel.HEADING_2));
  content.push(bodyBold("Stage 1: Login to Admin Panel"));
  content.push(body("The admin navigates to /admin and logs in with credentials. The admin dashboard loads with an overview: total products, orders this week, low stock alerts, and top-viewed products. The dashboard uses the same minimalist design language as the storefront."));

  content.push(bodyBold("Stage 2: Adding a New Product"));
  content.push(body("The admin clicks 'Add Product'. A clean form opens with sections: Basic Info (name, slug, category, brand, tags), Pricing (price in PKR, compare-at price, cost), Media (drag-and-drop image upload with reordering, video upload), Description (rich text editor), Specifications (dynamic key-value pairs), and SEO (meta title, meta description). The admin fills in the details, uploads 5-8 product images and optionally a demo video, sets the featured image, and clicks 'Publish'. The product appears on the storefront instantly."));

  content.push(bodyBold("Stage 3: Managing Categories and Tags"));
  content.push(body("The admin navigates to Categories. A hierarchical tree view shows the current category structure. The admin can drag-and-drop to reorder, add new categories or subcategories, assign category images, and set SEO metadata. For tags, a simple interface allows creating tags and assigning them to products in bulk. Tags are used for cross-category filtering (e.g., 'PTA Approved', 'Fast Charging', 'Noise Cancelling')."));

  content.push(bodyBold("Stage 4: Handling Orders via WhatsApp"));
  content.push(body("When a user clicks 'Order via WhatsApp', the admin receives a message on their WhatsApp Business account. The pre-filled message contains the product name, price, and a link to the product page. The admin can respond directly, confirm availability, negotiate if needed, and arrange delivery. For COD orders, the admin calls to confirm before dispatching to reduce return-to-origin (RTO) rates."));

  // 5. DESIGN SYSTEM & VISUAL IDENTITY
  content.push(heading("5. Design System & Visual Identity"));
  content.push(heading("5.1 Design Philosophy", HeadingLevel.HEADING_2));
  content.push(body("The design philosophy is rooted in intentional minimalism that rejects the homogenous 'AI aesthetic' plaguing modern websites. Most AI-generated e-commerce sites default to the same formula: Inter font, blue/purple gradient hero, generic card layouts, and predictable micro-interactions. This website deliberately breaks that mold by drawing inspiration from award-winning designs on platforms like Awwwards and Dribbble, while staying grounded in the practical needs of Pakistani electronics consumers."));
  content.push(body("Three core design principles guide every decision: (1) Purposeful emptiness, where white space is not waste but a luxury that draws attention to what matters; (2) Warm authority, using earthy tones and serif accents that convey trust and premium quality rather than the cold, corporate feel of tech-default blue; (3) Tactile minimalism, where every interaction feels responsive and physical, with subtle transitions and hover states that reward exploration without demanding attention."));

  content.push(heading("5.2 Color Palette", HeadingLevel.HEADING_2));
  content.push(body("The color palette is deliberately warm and earthy, evoking the materials and textures of handcrafted goods rather than the sterile glow of screens. This creates subconscious trust and differentiates the brand from every blue-and-white competitor in the Pakistani electronics space."));

  content.push(makeTable(
    ["Color Name", "Hex Code", "Usage"],
    [
      ["Charcoal", "#1A1A2E", "Primary text, headings, navigation text"],
      ["Warm Sand", "#F5F0EB", "Page background, card backgrounds"],
      ["Terracotta", "#C1694F", "Primary accent, CTAs, active states, links"],
      ["Sage Green", "#7C9A82", "Secondary accent, success states, in-stock badges"],
      ["Ivory Cream", "#FAF8F5", "Card backgrounds, product tiles, modal overlays"],
      ["Deep Slate", "#2D3436", "Secondary text, captions, footer"],
      ["Muted Gold", "#C9A84C", "Premium highlights, featured badges, sale prices"],
      ["Soft Clay", "#D4B896", "Borders, dividers, subtle separators"],
      ["Error Red", "#C0392B", "Error states, out-of-stock, form validation"],
      ["White", "#FFFFFF", "Modal backgrounds, dropdown menus, clean surfaces"],
    ],
    [20, 20, 60]
  ));
  content.push(tableCaption("Table 3: Website Color Palette"));

  content.push(body("The Terracotta accent (#C1694F) is the signature color. It is used sparingly but impactfully: on the primary CTA button ('Order via WhatsApp'), on active filter states, on link hover effects, and as accent lines in the layout. It is never used as a background fill for large areas, maintaining its visual impact. The Warm Sand (#F5F0EB) background replaces the typical harsh white, reducing eye strain during extended browsing sessions and creating a premium, paper-like canvas."));

  content.push(heading("5.3 Typography & Font System", HeadingLevel.HEADING_2));
  content.push(body("Typography is the single most impactful design decision for a minimalist website. The font system uses a carefully curated pairing that avoids the overused Inter/Roboto/Montserrat combo that makes every AI-generated site look identical."));

  content.push(makeTable(
    ["Usage", "Primary Font", "Fallback", "Weight", "Size Range"],
    [
      ["Display / Hero Headings", "Clash Display", "Playfair Display", "600 (SemiBold)", "36-48px"],
      ["Section Headings", "Plus Jakarta Sans", "DM Sans", "600 (SemiBold)", "24-32px"],
      ["Body Text", "Plus Jakarta Sans", "DM Sans", "400 (Regular)", "16-18px"],
      ["Product Prices", "Space Grotesk", "JetBrains Mono", "500 (Medium)", "20-24px"],
      ["Captions / Meta", "Plus Jakarta Sans", "DM Sans", "400 (Regular)", "12-14px"],
      ["Buttons / CTAs", "Plus Jakarta Sans", "DM Sans", "600 (SemiBold)", "14-16px"],
      ["Navigation", "Plus Jakarta Sans", "DM Sans", "500 (Medium)", "14-16px"],
    ],
    [22, 20, 18, 18, 22]
  ));
  content.push(tableCaption("Table 4: Typography System"));

  content.push(body("Clash Display (available free from Indian Type Foundry / fontshare.com) provides geometric character with slightly unconventional proportions that immediately signal 'designed, not templated.' Its sharp angles and generous x-height make it highly readable at display sizes while maintaining personality. Plus Jakarta Sans serves as the workhorse body font, offering excellent readability at small sizes with a warm, approachable character that complements the earthy color palette. Space Grotesk for prices adds a technical, precise feel that suits electronics specifications, with its monospaced-inspired letterforms making price comparison easy across products."));

  content.push(body("Font loading strategy: Use font-display: swap for all web fonts to prevent invisible text during loading. Preload the primary display font in the HTML head. Subset fonts to include only Latin characters needed for English/Urdu-Roman text. This ensures LCP is not blocked by font downloads on Pakistani 4G connections."));

  content.push(heading("5.4 Layout & Grid System", HeadingLevel.HEADING_2));
  content.push(body("The layout follows a 12-column grid system with 24px gutters on desktop, collapsing to 4 columns on tablet and 2 columns on mobile. Key layout principles:"));
  content.push(makeTable(
    ["Layout Element", "Desktop", "Tablet", "Mobile"],
    [
      ["Navigation", "Sticky top bar, horizontal", "Sticky top bar, hamburger menu", "Sticky top bar, hamburger menu"],
      ["Hero Section", "Full-width, 60vh min-height", "Full-width, 50vh min-height", "Full-width, 40vh min-height"],
      ["Product Grid", "4 columns, 24px gap", "3 columns, 20px gap", "2 columns, 16px gap"],
      ["Filter Panel", "Left sidebar (280px)", "Bottom sheet overlay", "Bottom sheet overlay"],
      ["Product Detail", "2-col (60/40 split)", "Stacked (image above info)", "Stacked (image above info)"],
      ["Footer", "4-column layout", "2-column layout", "Stacked single column"],
    ],
    [22, 26, 26, 26]
  ));
  content.push(tableCaption("Table 5: Responsive Layout Breakpoints"));

  content.push(body("Spacing follows an 8px base unit: 8px, 16px, 24px, 32px, 48px, 64px, 96px. All padding, margins, and gaps use multiples of this unit, creating a consistent vertical rhythm. Card corners use 12px border-radius (not the trendy 24px 'blob' radius that makes everything look like a mobile app). Card shadows are subtle and warm: box-shadow: 0 2px 8px rgba(26, 26, 46, 0.06) rather than the default cold-gray shadows."));

  content.push(heading("5.5 Component Design Principles", HeadingLevel.HEADING_2));
  content.push(body("Every UI component follows these anti-generic design principles:"));
  content.push(body("Product Cards: Use a clean layout with generous padding (24px), the product image occupying the top 65% of the card, and product info below. No star ratings visible on the card (too cluttered for minimalist design). Price is the most prominent text element after the product name. Hover state: subtle scale transform (1.02) with shadow deepening, not a dramatic flip or overlay. The card background is Ivory Cream (#FAF8F5), not pure white, creating a warm, tactile feel against the Warm Sand page background."));
  content.push(body("Buttons: The primary CTA ('Order via WhatsApp') uses Terracotta (#C1694F) background with white text, 12px border-radius, and a subtle shadow. On hover, it deepens to a darker shade (#A85540) with a slight translateY(-1px) lift. Secondary buttons use a transparent background with a 2px Terracotta border and Terracotta text. There are no gradient buttons, no rounded-pill buttons, and no 3D-effect buttons."));
  content.push(body("Navigation: A clean sticky top bar with the brand logo on the left, category links in the center (hidden on mobile), and a search icon plus cart/WhatsApp icon on the right. The navigation background is semi-transparent white with a backdrop-blur effect, creating a frosted-glass appearance as the user scrolls. Active category links are underlined with a Terracotta accent line, not highlighted with background color."));

  // 6. INFORMATION ARCHITECTURE
  content.push(heading("6. Information Architecture"));
  content.push(heading("6.1 Site Map", HeadingLevel.HEADING_2));
  content.push(makeTable(
    ["Page", "URL Pattern", "Description"],
    [
      ["Homepage", "/", "Hero, featured products, category grid, trust badges"],
      ["Category Listing", "/[category-slug]", "Filtered product grid with sidebar filters"],
      ["Subcategory Listing", "/[category]/[subcategory]", "Refined product grid"],
      ["Product Detail", "/[category]/[product-slug]", "Images, video, specs, WhatsApp CTA"],
      ["Search Results", "/search?q=[query]", "Search results with filters"],
      ["About", "/about", "Store story, trust signals, WhatsApp contact"],
      ["Contact", "/contact", "WhatsApp link, email, phone, social media"],
      ["Admin Dashboard", "/admin", "Overview, analytics, quick actions"],
      ["Admin Products", "/admin/products", "Product CRUD, bulk actions"],
      ["Admin Categories", "/admin/categories", "Category hierarchy management"],
      ["Admin Tags", "/admin/tags", "Tag creation and assignment"],
      ["Admin Media", "/admin/media", "Image/video upload and management"],
    ],
    [22, 30, 48]
  ));
  content.push(tableCaption("Table 6: Site Map and URL Structure"));

  content.push(heading("6.2 Category Hierarchy", HeadingLevel.HEADING_2));
  content.push(body("The category structure is designed to be flat enough for easy navigation and SEO, but deep enough to organize products logically. Maximum 3 levels deep: Home > Category > Subcategory > Product."));
  content.push(makeTable(
    ["Category", "Subcategories", "Example Products"],
    [
      ["Mobile Phones", "Smartphones, Feature Phones", "Samsung Galaxy S24, iPhone 15, Xiaomi 14"],
      ["Audio", "Wireless Earbuds, Headphones, Speakers", "AirPods Pro, Sony WH-1000XM5, JBL Flip 6"],
      ["Chargers & Power", "Wall Chargers, Power Banks, Cables", "Anker 65W Charger, Xiaomi Power Bank 20000mAh"],
      ["Accessories", "Cases, Screen Protectors, Stands", "Spigen Case, Tempered Glass, Phone Stand"],
      ["Wearable Tech", "Smartwatches, Fitness Bands", "Apple Watch SE, Xiaomi Mi Band 8"],
    ],
    [22, 38, 40]
  ));
  content.push(tableCaption("Table 7: Product Category Hierarchy"));

  // 7. FEATURE SPECIFICATIONS
  content.push(heading("7. Feature Specifications"));
  content.push(heading("7.1 User Features", HeadingLevel.HEADING_2));

  content.push(heading("7.1.1 Product Browsing & Discovery", HeadingLevel.HEADING_3));
  content.push(body("Homepage: Features a hero section with a lifestyle image or video background showcasing a flagship product, overlaid with a clean tagline and CTA. Below the hero, a 'Featured Products' section displays 8 products hand-picked by the admin. A 'Shop by Category' section shows category cards with images and product counts. The footer includes trust badges (COD, Free Delivery, Warranty), WhatsApp contact, and social media links."));
  content.push(body("Category Pages: Display a product grid with 12 products per page (desktop) or 8 (mobile). The left sidebar shows collapsible filter sections. Each product card shows: primary image, product name, price in PKR, compare-at price (if on sale) with strikethrough, 'In Stock' badge, and a quick 'View' button. Pagination uses a simple numbered list with 'Previous' and 'Next' links."));

  content.push(heading("7.1.2 Search & Filtering System", HeadingLevel.HEADING_3));
  content.push(body("Search: A prominent search bar in the navigation with real-time suggestions (debounced 300ms). Search results display products matching the query in name, description, brand, or specifications. The search URL updates dynamically (/search?q=samsung) for shareability and SEO. Typo-tolerant search is planned for Phase 2 (Meilisearch)."));
  content.push(body("Faceted Filtering: The filter panel supports the following filter types per category:"));
  content.push(makeTable(
    ["Filter Type", "UI Component", "Example Values", "SEO Treatment"],
    [
      ["Price Range", "Dual-handle slider with PKR inputs", "PKR 5,000 - 500,000+", "Canonical to category"],
      ["Brand", "Checkbox list with product counts", "Samsung (23), Apple (15), Xiaomi (31)", "Indexable for top brands"],
      ["Rating", "Star rating selector", "4+ stars, 3+ stars", "Canonical to category"],
      ["Availability", "Toggle switch", "In Stock Only", "Canonical to category"],
      ["Warranty", "Checkbox list", "Brand Warranty, Shop Warranty", "Canonical to category"],
      ["Specifications", "Dynamic per category (checkboxes)", "RAM: 8GB, 12GB | Storage: 128GB, 256GB", "Canonical to category"],
    ],
    [16, 24, 28, 32]
  ));
  content.push(tableCaption("Table 8: Filter Types and Implementation"));

  content.push(body("URL parameters for filters: /mobile-phones?brand=samsung&price=50000-100000&rating=4&in_stock=true. All filtered pages have canonical tags pointing to the unfiltered category page. When 3+ filters are applied, a noindex, follow meta tag prevents index bloat. Active filter chips display at the top of the product grid with individual remove buttons and a 'Clear All' option. On mobile, filters open as a bottom sheet overlay with an 'Apply' button."));

  content.push(heading("7.1.3 Product Detail Page", HeadingLevel.HEADING_3));
  content.push(body("The product detail page is the most critical conversion point. It features a two-column layout on desktop (60/40 split) with the image gallery on the left and product info on the right. The image gallery supports: multiple images (5-8) with a vertical thumbnail strip on the left side of the main image, click-to-zoom on desktop (hover zoom or modal lightbox), swipe-to-browse on mobile, and a video player section below the image gallery if a product demo video exists. The video auto-plays silently on scroll into view with a click-to-unmute control."));
  content.push(body("Product information section includes: Product name (H1), Price in PKR (large, prominent, Space Grotesk font), Compare-at price (strikethrough, Muted Gold color if on sale), Warranty badge (Brand Warranty / Shop Warranty / None), Short description (2-3 sentences), 'Order via WhatsApp' primary CTA button, Trust badges row (COD, Free Delivery, Easy Returns), Collapsible sections for: Full Description, Specifications Table, Highlights, and FAQ. Related products section below with 4 product cards."));

  content.push(heading("7.2 Admin Features", HeadingLevel.HEADING_2));

  content.push(heading("7.2.1 Product Management", HeadingLevel.HEADING_3));
  content.push(body("The admin product management system provides full CRUD operations with the following capabilities: Add new products with a structured form (name, slug auto-generated, category selector, brand selector, tag multi-select), Set pricing in PKR with optional compare-at price for sale display, Upload multiple product images (5-8 recommended) with drag-and-drop reordering for featured image selection, Upload one product demo video (MP4, max 100MB), Enter product description using a rich text editor with basic formatting (bold, italic, lists, links), Add structured specifications as dynamic key-value pairs (e.g., 'Screen Size: 6.1 inches', 'RAM: 8GB', 'Battery: 4000mAh'), Set warranty type and period, Control product status (Draft, Published, Archived), Toggle 'Featured' flag to display on homepage, Set SEO metadata (title, description) per product, and Bulk actions: publish, archive, delete, assign tags."));

  content.push(heading("7.2.2 Category Management", HeadingLevel.HEADING_3));
  content.push(body("Categories support hierarchical structure with drag-and-drop reordering. Admin can create, edit, and delete categories and subcategories. Each category has: name, slug (auto-generated), description, category image, parent category selector, sort order, and SEO metadata. The admin can control which categories appear in the navigation menu. A category tree view displays the full hierarchy visually, making it easy to understand and reorganize the product catalog."));

  content.push(heading("7.2.3 Tag Management", HeadingLevel.HEADING_3));
  content.push(body("Tags provide cross-category product grouping that supplements the hierarchical category structure. Tags are flat (no hierarchy) and are used for: Product attributes that span categories (e.g., 'PTA Approved', 'Fast Charging', 'Noise Cancelling'), Marketing campaigns (e.g., 'Eid Sale', 'New Arrival'), Use cases (e.g., 'For Students', 'For Gaming', 'For Commuting'). Admin can create tags, assign them to products (multi-select), and manage tag slugs. Tags appear as filter options on category pages and as clickable labels on product detail pages that link to filtered product lists."));

  content.push(heading("7.2.4 Media Management", HeadingLevel.HEADING_3));
  content.push(body("The media management system handles image and video uploads with the following specifications: Images: Accept JPG, PNG, WebP; auto-convert to WebP for delivery; generate responsive sizes (400w, 800w, 1200w, 1600w); auto-generate blur placeholder (LQIP) for smooth loading; maximum 5MB per image; drag-and-drop reordering within product. Videos: Accept MP4 (H.264); maximum 100MB per video; auto-extract thumbnail at 1-second mark; optional Cloudflare Stream integration for adaptive streaming. All media is stored in Cloudinary (free tier: 25 credits/month, 2GB storage) with Cloudflare R2 as backup storage for videos (10GB free, zero egress fees)."));

  content.push(heading("7.3 WhatsApp Integration", HeadingLevel.HEADING_2));
  content.push(body("The WhatsApp integration is the cornerstone of the buying experience, designed specifically for the Pakistani market where WhatsApp is the primary communication and commerce channel."));

  content.push(heading("7.3.1 Phase 1: Click-to-Chat (MVP - Free)", HeadingLevel.HEADING_3));
  content.push(body("The simplest and most cost-effective implementation uses wa.me deep links. When a user clicks 'Order via WhatsApp' on any product page, a WhatsApp chat opens with a pre-filled message containing the product name, price, and a direct link to the product page. Implementation: The button triggers a link in the format https://wa.me/92XXXXXXXXXX?text=Hi!%20I%27m%20interested%20in%20[Product%20Name]%20(PKR%20[Price]).%20Is%20it%20available?%20[Product%20URL]. This requires zero API costs, zero server-side integration, and works on all devices. The admin's WhatsApp Business number is stored in environment variables for easy updates."));

  content.push(heading("7.3.2 Phase 2: WhatsApp Business API (Growth)", HeadingLevel.HEADING_3));
  content.push(body("As order volume grows, the admin can upgrade to a self-hosted Chatwoot instance connected to the WhatsApp Business API. This enables: automated order confirmation messages (reducing COD fake orders by 40-60%), cart abandonment recovery messages, delivery tracking notifications, customer support with multiple agents, and broadcast lists for flash sales. WhatsApp API pricing in Pakistan: approximately $0.0544 per marketing message, $0.02-0.04 per utility message, and user-initiated messages are free. The Chatwoot self-hosted option costs only the VPS fee ($5-10/month)."));

  content.push(heading("7.3.3 WhatsApp UI Elements", HeadingLevel.HEADING_3));
  content.push(body("Floating WhatsApp button: A persistent green WhatsApp icon fixed at the bottom-right corner of every page (bottom-center on mobile, above the navigation bar). Clicking it opens a WhatsApp chat with a general inquiry message. Product page CTA: The 'Order via WhatsApp' button is the primary CTA, positioned prominently above the fold on the product detail page. It uses the Terracotta accent color with a WhatsApp icon. Pre-filled messages are dynamically generated based on the product context."));

  // 8. TECHNICAL ARCHITECTURE
  content.push(heading("8. Technical Architecture"));
  content.push(heading("8.1 Tech Stack", HeadingLevel.HEADING_2));
  content.push(makeTable(
    ["Layer", "Technology", "Rationale"],
    [
      ["Framework", "Next.js 15 (App Router)", "SSR, ISR, Server Components, SEO optimization, API routes in single codebase"],
      ["CMS / Admin", "Payload CMS 3", "Runs inside Next.js (single deployment), code-first, TypeScript, auto-generated admin UI"],
      ["Database", "PostgreSQL (Neon free tier)", "JSONB for flexible product specs, GIN indexes for filtering, ACID compliance"],
      ["ORM", "Prisma", "Type-safe database access, migrations, auto-generated types, excellent with Payload CMS"],
      ["Styling", "Tailwind CSS 4 + shadcn/ui", "Rapid UI development, consistent design system, tree-shakeable"],
      ["Image Storage", "Cloudinary (free tier)", "Auto WebP/AVIF, responsive sizes, CDN, blur placeholders, 360-degree viewer"],
      ["Video Storage", "Cloudflare R2 (free tier)", "10GB free, zero egress fees, S3-compatible API"],
      ["Search (Phase 1)", "PostgreSQL JSONB + GIN indexes", "Zero extra infrastructure, sufficient for up to 100K products"],
      ["Search (Phase 2)", "Meilisearch (self-hosted)", "Typo-tolerant search, built-in faceting, 50ms latency, free open-source"],
      ["Font Delivery", "Google Fonts + fontshare CDN", "Free CDN, font-display: swap, subset for performance"],
      ["Analytics", "Google Analytics 4 + Meta Pixel", "Free, comprehensive e-commerce tracking"],
      ["Deployment", "Vercel (frontend) + Neon (DB)", "Generous free tiers, automatic CI/CD, edge network"],
    ],
    [18, 30, 52]
  ));
  content.push(tableCaption("Table 9: Technology Stack"));

  content.push(heading("8.2 Database Schema", HeadingLevel.HEADING_2));
  content.push(body("The database uses a hybrid relational + JSONB approach. Common filterable fields (price, brand, category, stock, rating) are stored as proper columns for fast indexed querying. Variable product specifications (RAM, storage, screen size, battery capacity) are stored as JSONB for flexibility, with GIN indexes for performant filtering."));
  content.push(body("Core tables: Categories (id, name, slug, parentId, image, description, sortOrder, seoTitle, seoDescription), Brands (id, name, slug, logo, description), Tags (id, name, slug), Products (id, name, slug, description, shortDescription, categoryId, brandId, price, compareAtPrice, specifications JSONB, filterableSpecs JSONB, images JSONB, videoUrl, warranty, warrantyPeriod, stock, avgRating, status, isFeatured, seoTitle, seoDescription), ProductTags (productId, tagId), ProductVariants (id, productId, title, sku, price, stock, attributes JSONB, images JSONB), FilterConfig (id, categoryId, name, slug, type, options JSONB, sortOrder), Reviews (id, productId, userId, userName, rating, title, comment, isVerified, isApproved)."));

  content.push(heading("8.3 API Design", HeadingLevel.HEADING_2));
  content.push(body("The API uses Next.js Route Handlers (App Router) with REST conventions. All endpoints return JSON. Key endpoints:"));
  content.push(makeTable(
    ["Endpoint", "Method", "Description"],
    [
      ["/api/products", "GET", "List products with filtering, sorting, pagination"],
      ["/api/products/[slug]", "GET", "Get single product with variants, reviews, related products"],
      ["/api/products", "POST", "Create product (admin)"],
      ["/api/products/[slug]", "PATCH", "Update product (admin)"],
      ["/api/products/[slug]", "DELETE", "Delete product (admin)"],
      ["/api/categories", "GET", "List category tree with product counts"],
      ["/api/categories/[slug]", "GET", "Get category with filters config"],
      ["/api/search", "GET", "Search products by query with suggestions"],
      ["/api/tags", "GET", "List all tags with product counts"],
      ["/api/media/upload", "POST", "Upload image/video to Cloudinary/R2 (admin)"],
    ],
    [30, 12, 58]
  ));
  content.push(tableCaption("Table 10: Key API Endpoints"));

  content.push(heading("8.4 Deployment & Hosting", HeadingLevel.HEADING_2));
  content.push(body("The hosting strategy is optimized for zero-cost operation during the MVP phase, with clear upgrade paths as traffic grows."));
  content.push(makeTable(
    ["Service", "Free Tier", "Limits", "Upgrade Path"],
    [
      ["Vercel (Frontend + API)", "Hobby plan", "100GB bandwidth/month, Serverless Functions, Edge Functions", "Pro $20/month for 1TB"],
      ["Neon (PostgreSQL)", "Free tier", "0.5GB storage, 100 compute hours/month", "Pro $19/month for 10GB"],
      ["Cloudinary (Images)", "Free tier", "25 credits/month, 2GB storage, 5GB bandwidth", "Plus $89/month"],
      ["Cloudflare R2 (Videos)", "Free tier", "10GB storage, 1M Class A ops, zero egress", "Pay-as-you-go $0.015/GB"],
      ["Cloudflare (CDN)", "Free tier", "Unlimited bandwidth, DDoS protection, SSL, 3 PoPs in Pakistan", "Pro $20/month"],
    ],
    [22, 14, 34, 30]
  ));
  content.push(tableCaption("Table 11: Free Hosting Stack"));

  content.push(body("Alternative: Cloudflare Pages offers unlimited bandwidth on its free tier with 3 Pakistan PoPs (Karachi, Lahore, Islamabad), making it an excellent alternative if Vercel's 100GB bandwidth limit becomes restrictive. Cloudflare Pages also includes D1 (SQLite database, 500MB free), KV storage (1GB free), and Workers (100K requests/day free). For a Pakistan-focused store, Cloudflare's local PoPs provide significantly lower latency (approximately 3ms) compared to Vercel's nearest PoP in Mumbai (50-80ms)."));
  content.push(body("Domain recommendation: Purchase a .pk domain (approximately PKR 1,800/year or $6.50 via PKNIC) for automatic geo-targeting and local trust. Alternatively, use a .com domain (approximately $6-9/year via Namecheap/Cloudflare) and set Pakistan as the geographic target in Google Search Console. Avoid free domains (.tk, .ml) as they are blacklisted by Google and frequently revoked."));

  // 9. SEO STRATEGY
  content.push(heading("9. SEO Strategy"));
  content.push(heading("9.1 Technical SEO", HeadingLevel.HEADING_2));
  content.push(body("XML Sitemaps: Generate separate sitemaps for products, categories, and blog content. Submit to Google Search Console and Bing Webmaster Tools. Include only canonical URLs. Use accurate <lastmod> tags. Split sitemaps if exceeding 50,000 URLs."));
  content.push(body("Robots.txt: Block low-value URLs (filter/sort parameters, cart/checkout pages, user account pages, search results with filters, API endpoints). Allow crawling of CSS/JS resources and all canonical product/category pages. Canonical Tags: Every page must have a self-referencing canonical tag. Product pages accessible via multiple URLs (e.g., different categories) must canonicalize to one preferred URL. Filtered pages must canonicalize to the unfiltered category page."));
  content.push(body("Structured Data: Implement JSON-LD Product schema on all product pages with PKR pricing, availability, and review ratings. Implement BreadcrumbList schema on all pages. Implement FAQPage schema on product FAQ sections. Validate all structured data using Google's Rich Results Test. Google no longer requires Merchant Center feeds for product rich results; Product schema alone qualifies pages for rich results."));

  content.push(heading("9.2 On-Page SEO for Pakistani Market", HeadingLevel.HEADING_2));
  content.push(body("Product Title Format: [Brand] [Product Name] [Key Spec] - [Store Name]. Example: 'Samsung Galaxy S24 Ultra 256GB - TechStore.pk'. Keep titles 50-60 characters. Include brand name (critical for electronics searches), key differentiating spec (storage, size, color), and store name for brand recognition."));
  content.push(body("Meta Description Format: Shop [Brand] [Product Name] at [Store Name]. [Key feature]. [Price in PKR]. Free delivery across Pakistan. [Warranty info]. Include price in PKR (major ranking factor for product results), mention Pakistani cities for local intent, include unique selling points (warranty, COD, free delivery), and use action verbs (Shop, Buy, Order)."));
  content.push(body("URL Structure: /[category]/[brand]-[product-name]-[key-spec]. Example: /smartphones/samsung-galaxy-s24-ultra-256gb. Use lowercase with hyphens, 3-5 words ideal, maximum 60 characters, no session IDs or tracking parameters."));
  content.push(body("Pakistan-Specific SEO: Include PTA Approved for smartphones (critical trust signal), mention Cash on Delivery (dominant payment method), use PKR pricing consistently, reference Pakistani cities (Lahore, Karachi, Islamabad), include Official Warranty vs Shop Warranty distinction, and target local search terms like '[product] price in Pakistan' and 'buy [product] online Pakistan'."));

  content.push(heading("9.3 Performance & Core Web Vitals", HeadingLevel.HEADING_2));
  content.push(body("Target metrics for Pakistani mobile users on 4G connections: LCP (Largest Contentful Paint) under 2.0 seconds (more aggressive than the standard 2.5s threshold), INP (Interaction to Next Paint) under 200ms, CLS (Cumulative Layout Shift) under 0.1. Key optimizations: Preload the LCP image, use Next.js Image component with automatic WebP/AVIF conversion and responsive sizing, implement Incremental Static Regeneration (ISR) for product pages with 60-second revalidation, lazy-load below-fold images and videos, inline critical CSS and defer non-critical stylesheets, use Cloudflare CDN with Pakistan PoPs for edge caching, specify width and height on all images to prevent CLS, and set font-display: swap for all web fonts."));

  // 10. MARKETING STRATEGY
  content.push(heading("10. Marketing Strategy"));
  content.push(heading("10.1 Social Media Marketing", HeadingLevel.HEADING_2));
  content.push(body("Facebook remains the number one platform for Pakistani e-commerce with 49 million users, lowest cost-per-click, and the most mature ad system. It supports catalog integration and WhatsApp direct messaging. Instagram (18.8 million users) is ideal for visual product showcasing with higher engagement rates. TikTok is the fastest-growing platform with the lowest CPC, ideal for viral product demos and unboxing content. Posting between 8 PM and 11 PM PKT captures peak engagement hours. Video content outperforms static content 3-5x across all platforms. Urdu-English bilingual captions significantly boost engagement."));

  content.push(heading("10.2 WhatsApp Marketing", HeadingLevel.HEADING_2));
  content.push(body("WhatsApp is the primary sales channel in Pakistan with 90%+ open rates (compared to negligible email open rates). Key strategies include: automated order confirmations (Reply 1 to confirm / 2 to cancel) to reduce COD fraud, personalized product recommendations based on browsing history, cart abandonment recovery messages, broadcast lists for flash sales and Eid collections, VIP customer communities with early access and secret discounts, real-time delivery updates to reduce RTO rates, and WhatsApp-only discount campaigns to build subscriber lists. Compliance warning: Meta is cracking down on unverified broadcasts and spamming; always use official WhatsApp Business API for bulk messaging."));

  content.push(heading("10.3 Influencer Marketing", HeadingLevel.HEADING_2));
  content.push(body("Micro-influencers (5K-50K followers) outperform macro-influencers in Pakistan with better engagement rates, lower cost, and more authentic trust. Category-specific influencers (tech reviewers, gadget unboxers) drive higher conversion than general lifestyle influencers. Pricing benchmarks: micro-influencers charge PKR 5,000-25,000 per post; mid-tier (50K-200K) charge PKR 25,000-100,000. Product seeding (gifting products in exchange for honest reviews) works well for small businesses with limited budgets. Always require disclosure and track with UTM/affiliate links for measurable ROI."));

  content.push(heading("10.4 Analytics & Tracking", HeadingLevel.HEADING_2));
  content.push(body("Google Analytics 4 with enhanced e-commerce events (view_item, add_to_cart, begin_checkout, purchase) tracks the full shopping funnel. Custom dimensions track payment_method (COD vs digital), order_source (Website vs WhatsApp vs Facebook), delivery_city, and is_cod_order for Pakistan-specific insights. Meta Pixel with Conversions API (CAPI) is essential; browser-based pixel alone captures only 50-70% of conversions due to ad blockers and iOS privacy restrictions. WhatsApp click tracking: fire a GA4 event and Meta Pixel Contact event when the WhatsApp button is clicked. COD order confirmation: upload offline conversion data to Google Ads and Meta when delivery is confirmed."));

  // 11. CONTENT WRITING GUIDELINES
  content.push(heading("11. Content Writing Guidelines"));
  content.push(heading("11.1 Product Description Framework", HeadingLevel.HEADING_2));
  content.push(body("Every product description follows the Hook-Benefits-Lifestyle-Specs formula: Hook (1-2 sentences addressing a pain point): 'Tired of earbuds that die halfway through your commute? Meet the ones that last your entire week.' Benefits (2-3 sentences explaining how it solves the problem): 'With 40-hour battery life and active noise cancellation, these earbuds let you zone into your music whether you're on a noisy bus or in a crowded cafe.' Lifestyle (1-2 sentences helping them imagine using it): 'Perfect for daily commuters, gym sessions, and late-night study marathons.' Specs (bullet points for comparison shoppers): '40-hour battery | Bluetooth 5.3 | IPX5 water-resistant | USB-C fast charging.'"));
  content.push(body("Critical rules: Never copy manufacturer descriptions (duplicate content penalty from Google). Minimum 300 words for primary products, 500+ for flagship items. Include specifications, use cases, what's in the box, and compatibility info. Use structured headings within descriptions. Internal link to related products and accessories. Always end with trust signals: 'Free Delivery Across Pakistan | Cash on Delivery Available | 7-Day Easy Returns.'"));

  content.push(heading("11.2 CTA Copywriting", HeadingLevel.HEADING_2));
  content.push(body("Generic CTAs like 'Submit', 'Click Here', and 'Learn More' do not work in Pakistan. High-converting CTAs lead with the benefit and reduce purchase anxiety: 'Order Now - Cash on Delivery' (addresses the number one concern), 'Add to Cart - Free Delivery' (combines action with the top incentive), 'WhatsApp to Order' (for high-consideration items), 'Buy Now - 7-Day Returns' (risk reversal), and 'Order Now, Pay on Delivery' (directly addresses Pakistani consumer behavior). A/B test CTA variations; even changing 'Buy Now' to 'Add to Cart' can lift conversions by 15-20%."));

  content.push(heading("11.3 Microcopy & UX Writing", HeadingLevel.HEADING_2));
  content.push(body("Microcopy is the small text that guides users through the interface: button labels, error messages, empty states, tooltips, and loading states. Every piece of microcopy should be warm, helpful, and culturally appropriate for Pakistani English. Examples: Empty cart state: 'Your cart is empty. Let's find something you'll love!' / No search results: 'We couldn't find anything for [query]. Try a different keyword or browse our categories.' / Out of stock: 'This item is currently out of stock. WhatsApp us to check when it'll be back!' / Loading state: 'Finding the best deals for you...' / Error state: 'Something went wrong. Please try again, or WhatsApp us for help.'"));

  // 12. EDGE CASES & CONSIDERATIONS
  content.push(heading("12. Edge Cases & Considerations"));
  content.push(heading("12.1 Pakistani Market Edge Cases", HeadingLevel.HEADING_2));

  content.push(makeTable(
    ["Edge Case", "Impact", "Mitigation"],
    [
      ["COD fake orders (15-30% RTO)", "Revenue loss from returned shipments", "WhatsApp confirmation within seconds of order; partial advance payment option (PKR 200 to confirm)"],
      ["Slow mobile internet (20-25 Mbps avg)", "Poor UX, high bounce rate", "Aggressive image compression (<100KB), ISR caching, target LCP < 2.0s on 4G, service worker for offline browsing"],
      ["Undersea cable outages", "Site becomes unreachable", "Cloudflare CDN with Pakistan PoPs provides resilience; service worker caches key pages for offline access"],
      ["Multiple currencies confusion", "Users unsure if prices are PKR or USD", "Always display PKR with Rs. prefix; store currency in environment config; never show $ or other currencies"],
      ["PTA approval confusion", "Users unsure if phones will work on local networks", "Add 'PTA Approved' tag and badge; create dedicated PTA Approved category page; mention in product descriptions"],
      ["Warranty disputes", "Customer expects brand warranty but receives shop warranty", "Clearly distinguish warranty type on every product page; use icons and color coding; explain difference in FAQ"],
      ["WhatsApp number change", "All buy links break if admin changes number", "Store WhatsApp number in environment variable; use dynamic URL generation; single point of update"],
      ["Product out of stock after WhatsApp inquiry", "User frustration, trust erosion", "Real-time stock sync; if stock = 0, change CTA to 'Notify Me' instead of 'Order via WhatsApp'"],
      ["High-traffic events (Eid, 11.11 sales)", "Site crashes or slows down", "Pre-cache popular product pages using ISR; CDN edge caching; consider Cloudflare auto-scaling"],
      ["Urdu-speaking users", "Product descriptions in English only may limit reach", "Phase 2: Add Urdu language toggle with hreflang tags; initially use simple English accessible to Urdu speakers"],
    ],
    [26, 28, 46]
  ));
  content.push(tableCaption("Table 12: Edge Cases and Mitigations"));

  content.push(heading("12.2 Technical Edge Cases", HeadingLevel.HEADING_2));
  content.push(body("Faceted navigation SEO bloat: When users combine multiple filters, URLs can generate thousands of indexed pages with thin or duplicate content. Mitigation: canonical tags on all filtered pages pointing to the unfiltered category, noindex on pages with 3+ filter combinations, robots.txt blocking of low-value parameters, and Google Search Console URL parameter handling configuration."));
  content.push(body("Image optimization for slow connections: Pakistani users on 3G/4G connections may experience slow image loading. Mitigation: generate LQIP (Low Quality Image Placeholder) blur data URLs for instant visual feedback, serve images in WebP format with JPEG fallback using the Next.js Image component, implement progressive image loading with skeleton placeholders, and lazy-load all images below the fold."));
  content.push(body("Admin media upload size limits: Large video uploads may fail on slow connections. Mitigation: implement chunked upload for files over 10MB, show upload progress with retry capability, auto-compress videos to 1080p on upload, and enforce maximum file size (100MB for videos, 5MB for images)."));
  content.push(body("Search performance with growing catalog: As the product catalog grows beyond 10,000 items, PostgreSQL full-text search may become slow. Mitigation: Phase 1 uses PostgreSQL JSONB filtering with GIN indexes (sufficient up to 100K products), Phase 2 adds Meilisearch (self-hosted) for typo-tolerant instant search with built-in faceted filtering."));
  content.push(body("Data backup and recovery: Free-tier databases may not include automatic backups. Mitigation: implement daily automated PostgreSQL dumps to Cloudflare R2 using a cron job, test backup restoration monthly, and use Neon's point-in-time recovery feature (available on paid plans)."));

  // 13. IMPLEMENTATION ROADMAP
  content.push(heading("13. Implementation Roadmap"));
  content.push(makeTable(
    ["Phase", "Timeline", "Milestones", "Key Deliverables"],
    [
      ["Phase 1: MVP", "Weeks 1-6", "Core storefront, admin panel, WhatsApp integration", "Product catalog with search/filter, admin CRUD, WhatsApp buy button, deployed on free hosting"],
      ["Phase 2: Growth", "Weeks 7-12", "Enhanced search, analytics, marketing setup", "Meilisearch integration, GA4 + Meta Pixel, WhatsApp Business API, social media launch"],
      ["Phase 3: Scale", "Months 4-6", "Payment integration, user accounts, performance", "JazzCash/EasyPaisa gateways, user authentication, product reviews, performance optimization"],
      ["Phase 4: Mature", "Months 7-12", "Advanced features, mobile optimization", "Blog/SEO content hub, email marketing, advanced analytics, A/B testing, PWA support"],
    ],
    [14, 16, 34, 36]
  ));
  content.push(tableCaption("Table 13: Implementation Roadmap"));

  content.push(heading("13.1 Phase 1 Detailed Breakdown (MVP)", HeadingLevel.HEADING_2));
  content.push(makeTable(
    ["Week", "Focus Area", "Deliverables"],
    [
      ["1", "Project setup & design system", "Next.js 15 + Payload CMS setup, Tailwind config with custom palette, font loading, base components"],
      ["2", "Database & admin panel", "Prisma schema, PostgreSQL on Neon, Payload CMS collections (Products, Categories, Tags, Media), admin UI customization"],
      ["3", "Product catalog frontend", "Homepage, category pages, product grid, product detail page with image gallery and video player"],
      ["4", "Search & filtering", "Search bar with suggestions, faceted filter sidebar, URL parameter sync, pagination, SEO canonical tags"],
      ["5", "WhatsApp integration & trust signals", "WhatsApp buy button with pre-filled messages, floating WhatsApp icon, trust badges, COD/free delivery indicators"],
      ["6", "SEO, performance & deployment", "JSON-LD schema, meta tags, sitemap, robots.txt, Cloudinary integration, Vercel deployment, Core Web Vitals optimization"],
    ],
    [8, 32, 60]
  ));
  content.push(tableCaption("Table 14: Phase 1 Weekly Breakdown"));

  // 14. RISK ANALYSIS & MITIGATION
  content.push(heading("14. Risk Analysis & Mitigation"));
  content.push(makeTable(
    ["Risk", "Probability", "Impact", "Mitigation Strategy"],
    [
      ["Vercel free tier bandwidth exceeded", "Medium", "High", "Monitor usage in Vercel dashboard; migrate to Cloudflare Pages (unlimited bandwidth) if approaching 100GB limit"],
      ["Cloudinary free tier exceeded", "Medium", "Medium", "Implement image optimization to reduce transformation count; upgrade to paid plan only when revenue justifies it"],
      ["WhatsApp policy changes restrict business messaging", "Low", "High", "Maintain wa.me links as fallback (always functional); diversify with phone call option; build email list as backup channel"],
      ["Neon free tier database limits reached", "Low", "High", "Monitor storage and compute hours; optimize queries; upgrade to Pro plan ($19/month) when needed"],
      ["Competitor copies the design", "Medium", "Low", "Focus on brand differentiation through content, service quality, and community; design is easily replicable but brand trust is not"],
      ["Low organic traffic initially", "High", "Medium", "Invest in social media marketing and WhatsApp community building; SEO takes 3-6 months for meaningful results; create 'Price in Pakistan' landing pages for quick wins"],
      ["COD return rate exceeds 30%", "Medium", "High", "Implement WhatsApp confirmation calls, partial advance payment option, open-box delivery, and proactive delivery tracking"],
    ],
    [26, 14, 12, 48]
  ));
  content.push(tableCaption("Table 15: Risk Analysis and Mitigation Strategies"));

  content.push(body("The overall risk profile is favorable for this project. The use of free-tier services for the MVP phase means the financial downside is minimal (essentially zero recurring cost). The primary risks are operational (COD return rates) and growth-related (exceeding free tier limits), both of which have clear mitigation strategies. The WhatsApp-native buying model, while unconventional, aligns perfectly with Pakistani consumer behavior and actually reduces friction compared to traditional checkout flows."));

  return content;
}

// ─── Build Document ───
async function main() {
  const pgSize = { width: 11906, height: 16838 };
  const pgMargin = { top: 1440, bottom: 1440, left: 1701, right: 1417 };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" },
            size: 24,
            color: c(bodyPalette.body),
          },
          paragraph: {
            spacing: { line: 312 },
          },
        },
        heading1: {
          run: {
            font: { ascii: "Times New Roman", eastAsia: "SimHei" },
            size: 32,
            bold: true,
            color: c(bodyPalette.primary),
          },
          paragraph: { spacing: { before: 360, after: 160, line: 312 } },
        },
        heading2: {
          run: {
            font: { ascii: "Times New Roman", eastAsia: "SimHei" },
            size: 28,
            bold: true,
            color: c(bodyPalette.primary),
          },
          paragraph: { spacing: { before: 280, after: 120, line: 312 } },
        },
        heading3: {
          run: {
            font: { ascii: "Times New Roman", eastAsia: "SimHei" },
            size: 24,
            bold: true,
            color: c(bodyPalette.primary),
          },
          paragraph: { spacing: { before: 200, after: 100, line: 312 } },
        },
      },
    },
    sections: [
      // Section 1: Cover
      {
        properties: {
          page: {
            size: pgSize,
            margin: { top: 0, bottom: 0, left: 0, right: 0 },
          },
        },
        children: buildCover(),
      },
      // Section 2: Front matter (TOC)
      {
        properties: {
          type: SectionType.NEXT_PAGE,
          page: {
            size: pgSize,
            margin: pgMargin,
            pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" })],
              }),
            ],
          }),
        },
        children: buildTOCSection(),
      },
      // Section 3: Body
      {
        properties: {
          type: SectionType.NEXT_PAGE,
          page: {
            size: pgSize,
            margin: pgMargin,
            pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: "E-Commerce Website PRD", size: 18, color: "888888", italics: true })],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" })],
              }),
            ],
          }),
        },
        children: buildBody(),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = "/home/z/my-project/download/E-Commerce-Website-PRD.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated at:", outputPath);
}

main().catch(console.error);
