/* ============================================================================
   Page Forge — Adapter Shrine-native
   Dal UPS costruisce un template che usa le sezioni NATIVE del tema:
   - main-product (buy box) preservato dal product.json reale
   - image-with-text (descrizione / why-love / checklist)
   - horizontal-ticker
   - testimonials
   - collapsible-content (FAQ)
   Vantaggio: pagine identiche al tema (GLEMS-style), buy box sempre vero,
   font ereditato, e il tool scrive solo UN file JSON.
   ========================================================================== */

function uid(p) { return p + "_" + Math.random().toString(36).slice(2, 8); }
function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function clean(s) { return String(s || "").replace(/<\/?p>/g, "").replace(/<br\s*\/?>/g, "").trim(); }

function benefitsHtml(blocks) {
  return (blocks || []).map((b, i) => {
    const icon = b.icon ? b.icon + " " : "";
    const title = b.title ? `<strong>${esc(b.title)}</strong>` : "";
    const text = clean(b.text);
    const dash = title && text ? " \u2013 " : "";
    const lead = i > 0 ? "<br/>" : "";
    return `<p>${lead}${icon}${title}${dash}${text}<br/></p>`;
  }).join("");
}

function checklistHtml(items) {
  const lines = (items || []).filter(Boolean).map((t) => `\u2705 ${esc(t)}`).join("<br/><br/>");
  return `<p><strong>${lines}</strong></p>`;
}

function imageWithText(heading, html, accent) {
  const h = "heading_" + uid("h"), t = "text_" + uid("t");
  return {
    type: "image-with-text",
    blocks: {
      [h]: { type: "heading", settings: { heading: heading || "", heading_size: "h2" } },
      [t]: { type: "text", settings: { text: html || "", text_style: "body" } },
    },
    block_order: [h, t],
    settings: {
      height: "adapt", desktop_image_width: "medium", layout: "image_first",
      desktop_content_position: "top", desktop_content_alignment: "left",
      content_layout: "no-overlap",
      color_scheme: accent ? "accent-1" : "background-1",
      section_color_scheme: accent ? "accent-1" : "background-1",
      mobile_content_alignment: "left", padding_top: 36, padding_bottom: 36,
    },
  };
}

function ticker(text) {
  const b = uid("t");
  return {
    type: "horizontal-ticker",
    blocks: { [b]: { type: "text", settings: { title: text || "LIMITED OFFER!" } } },
    block_order: [b],
    settings: { speed: 3, text_spacing: 3, text_size: "1.75", italic_text: false, uppercase_text: false, bold_text: false, color_scheme: "inverse", padding_top: 16, padding_bottom: 16 },
  };
}

function testimonialsSec(reviews) {
  const blocks = {}, order = [];
  (reviews || []).slice(0, 6).forEach((r) => {
    const k = uid("col");
    blocks[k] = { type: "column", settings: { title: r.title || "Great product", text: r.text || `<p>${esc(r.quote || "")}</p>`, author: r.author || "Verified customer" } };
    order.push(k);
  });
  return {
    type: "testimonials", blocks, block_order: order,
    settings: { title: "Testimonials", heading_size: "h1", text: "", image_width: "full", image_ratio: "square", columns_desktop: 3, column_alignment: "center", show_stars: true, show_quotes: true, background_style: "primary", color_scheme: "background-1", padding_top: 36, padding_bottom: 36 },
  };
}

function faqSec(items) {
  const blocks = {}, order = [];
  (items || []).slice(0, 10).forEach((f) => {
    const k = uid("row");
    blocks[k] = { type: "collapsible_row", settings: { heading: f.question || "", icon: "question_mark", row_content: f.answer || "", page: "" } };
    order.push(k);
  });
  return {
    type: "collapsible-content", blocks, block_order: order,
    settings: { caption: "", heading: "FAQ'S", heading_size: "h1", heading_alignment: "center", layout: "none", color_scheme: "background-1", container_color_scheme: "background-2", open_first_collapsible_row: false, image_ratio: "adapt", desktop_layout: "image_second", padding_top: 36, padding_bottom: 36 },
  };
}

/* Costruisce il template Shrine-native. mainSection = il buy box reale letto dal tema. */
export function buildShrineTemplate(ups, mainSection) {
  const sections = {};
  const order = [];
  const name = (ups.meta && ups.meta.name) || "It";

  const S = (t) => (ups.sections || []).find((x) => x.type === t);
  const benefits = S("benefits");
  const desc = S("rich_text");
  const hero = S("hero");
  const reviews = S("reviews");
  const faq = S("faq");

  // 1) BUY BOX preservato (main-product reale del tema)
  const main = mainSection || { type: "main-product", settings: {} };
  // aggiorna il blocco emoji_benefits col contenuto generato, se presente
  if (main.blocks && benefits) {
    const embKey = Object.keys(main.blocks).find((k) => main.blocks[k].type === "emoji_benefits");
    if (embKey) main.blocks[embKey].settings.benefits = benefitsHtml(benefits.blocks);
  }
  sections.main = main;
  order.push("main");

  // 2) DESCRIZIONE (image-with-text)
  const descHtml = (desc && desc.settings && desc.settings.body) || (hero && hero.settings && hero.settings.subhead) || "";
  if (descHtml) { const k = uid("iwt"); sections[k] = imageWithText(name, descHtml, false); order.push(k); }

  // 3) TICKER
  const tk = uid("tick"); sections[tk] = ticker("LIMITED OFFER!"); order.push(tk);

  // 4) WHY YOU'LL LOVE (image-with-text, benefits formattati)
  if (benefits) { const k = uid("iwt"); sections[k] = imageWithText("\uD83D\uDCA1 Why You'll Love " + name, benefitsHtml(benefits.blocks), false); order.push(k); }

  // 5) WHY CUSTOMERS LOVE IT (image-with-text accent, checklist ✅)
  if (benefits && benefits.blocks && benefits.blocks.length) {
    const items = benefits.blocks.map((b) => clean(b.title)).filter(Boolean);
    const k = uid("iwt"); sections[k] = imageWithText("\uD83C\uDF1F Why Customers Love It", checklistHtml(items), true); order.push(k);
  }

  // 6) TESTIMONIALS
  if (reviews) {
    const k = uid("test");
    sections[k] = testimonialsSec((reviews.blocks || []).map((b) => ({ title: b.title, text: b.text, author: b.author })));
    order.push(k);
  }

  // 7) FAQ (collapsible-content)
  if (faq) { const k = uid("faq"); sections[k] = faqSec(faq.blocks); order.push(k); }

  return { sections, order };
}
