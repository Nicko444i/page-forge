/* ============================================================================
   Page Forge — Adapter Shrine-native
   Dal UPS costruisce un template che usa le sezioni NATIVE del tema.
   Il buy box (main-product) viene preservato dal product.json reale.
   Ogni testo è normalizzato in HTML valido per Shrine (<p> a livello top).
   ========================================================================== */

function uid(p) { return p + "_" + Math.random().toString(36).slice(2, 8); }
function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

/* Normalizza QUALSIASI html in richtext valido per Shrine:
   solo <p> a livello superiore, con inline <strong><em><b><i><a><br>. */
function sanitizeRichtext(html) {
  let s = String(html == null ? "" : html);
  // chiusure block-level -> separatore di paragrafo
  s = s.replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, "\u0001");
  s = s.replace(/<(ul|ol)[^>]*>/gi, "").replace(/<\/(ul|ol)>/gi, "\u0001");
  // doppio <br> -> nuovo paragrafo; singolo <br> -> marker
  s = s.replace(/(<br\s*\/?>\s*){2,}/gi, "\u0001");
  s = s.replace(/<br\s*\/?>/gi, "\u0002");
  // rimuovi ogni tag tranne gli inline consentiti
  s = s.replace(/<(?!\/?(strong|em|b|i|a)\b)[^>]*>/gi, "");
  const paras = s.split("\u0001")
    .map((p) => p.replace(/\u0002/g, "<br>").replace(/[ \t\u00a0]+/g, " ").trim())
    .filter(Boolean);
  if (!paras.length) return "<p></p>";
  return paras.map((p) => "<p>" + p + "</p>").join("");
}

function cleanInline(s) {
  // testo per titolo benefit: rimuovi tag block, tieni eventuali inline
  return String(s || "").replace(/<\/?(p|div|br|h[1-6])[^>]*>/gi, "").trim();
}

function benefitsHtml(blocks) {
  const html = (blocks || []).map((b) => {
    const icon = b.icon ? esc(b.icon) + " " : "";
    const title = b.title ? "<strong>" + esc(b.title) + "</strong>" : "";
    const text = cleanInline(b.text);
    const dash = title && text ? " \u2013 " : "";
    return "<p>" + icon + title + dash + text + "</p>";
  }).join("");
  return sanitizeRichtext(html);
}

// Versione CORTA per il buy box: solo emoji + titolo, niente descrizione.
function benefitsShortHtml(blocks) {
  const html = (blocks || []).map((b) => {
    const icon = b.icon ? esc(b.icon) + " " : "";
    const title = b.title ? "<strong>" + esc(b.title) + "</strong>" : "";
    return "<p>" + icon + title + "</p>";
  }).join("");
  return sanitizeRichtext(html || "<p></p>");
}

function checklistHtml(items) {
  const html = (items || []).filter(Boolean)
    .map((t) => "<p><strong>\u2705 " + esc(t) + "</strong></p>").join("");
  return sanitizeRichtext(html || "<p></p>");
}

function imageWithText(heading, html, accent) {
  const h = "heading_" + uid("h"), t = "text_" + uid("t");
  return {
    type: "image-with-text",
    blocks: {
      [h]: { type: "heading", settings: { heading: heading || "", heading_size: "h2" } },
      [t]: { type: "text", settings: { text: sanitizeRichtext(html), text_style: "body" } },
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
    settings: { speed: 3, text_spacing: 3, text_size: "1.75", color_scheme: "inverse", padding_top: 16, padding_bottom: 16 },
  };
}

function testimonialsSec(reviews) {
  const blocks = {}, order = [];
  (reviews || []).slice(0, 6).forEach((r) => {
    const k = uid("col");
    blocks[k] = {
      type: "column",
      settings: {
        title: esc(r.title || "Great product"),
        text: sanitizeRichtext(r.text || ""),
        author: esc(r.author || "Verified customer"),
      },
    };
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
    blocks[k] = {
      type: "collapsible_row",
      settings: {
        heading: esc(f.question || ""),
        icon: "question_mark",
        row_content: sanitizeRichtext(f.answer || ""),
        page: "",
      },
    };
    order.push(k);
  });
  return {
    type: "collapsible-content", blocks, block_order: order,
    settings: { caption: "", heading: "FAQ'S", heading_size: "h1", heading_alignment: "center", layout: "none", color_scheme: "background-1", container_color_scheme: "background-2", open_first_collapsible_row: false, padding_top: 36, padding_bottom: 36 },
  };
}

export function buildShrineTemplate(ups, mainSection) {
  const sections = {};
  const order = [];
  const name = (ups.meta && ups.meta.name) || "It";
  const S = (t) => (ups.sections || []).find((x) => x.type === t);
  const benefitsAll = (ups.sections || []).filter((x) => x.type === "benefits");
  const benefits = benefitsAll[0];
  const shortBenefits = benefitsAll[1] || benefitsAll[0];
  const desc = S("rich_text");
  const hero = S("hero");
  const reviews = S("reviews");
  const faq = S("faq");

  // 1) BUY BOX preservato
  const main = mainSection || { type: "main-product", settings: {} };
  if (main.blocks && benefits) {
    const embKey = Object.keys(main.blocks).find((k) => main.blocks[k].type === "emoji_benefits");
    if (embKey) main.blocks[embKey].settings.benefits = benefitsShortHtml((shortBenefits || benefits).blocks);
  }
  sections.main = main;
  order.push("main");

  // 2) DESCRIZIONE — tutte le rich_text; se assenti, il subhead dell'hero
  const richTexts = (ups.sections || []).filter((x) => x.type === "rich_text" && x.settings && x.settings.body);
  if (richTexts.length) {
    richTexts.forEach((rt) => { const k = uid("iwt"); sections[k] = imageWithText(rt.settings.heading || name, rt.settings.body, false); order.push(k); });
  } else if (hero && hero.settings && hero.settings.subhead) {
    const k = uid("iwt"); sections[k] = imageWithText(name, hero.settings.subhead, false); order.push(k);
  }

  // 3) TICKER
  const tk = uid("tick"); sections[tk] = ticker("LIMITED OFFER!"); order.push(tk);

  // 4) WHY YOU'LL LOVE
  if (benefits) { const k = uid("iwt"); sections[k] = imageWithText("Why You'll Love " + name, benefitsHtml(benefits.blocks), false); order.push(k); }

  // 5) WHY CUSTOMERS LOVE IT (checklist)
  if (benefits && benefits.blocks && benefits.blocks.length) {
    const items = benefits.blocks.map((b) => cleanInline(b.title)).filter(Boolean);
    const k = uid("iwt"); sections[k] = imageWithText("Why Customers Love It", checklistHtml(items), true); order.push(k);
  }

  // 6) TESTIMONIALS
  if (reviews) {
    const k = uid("test");
    sections[k] = testimonialsSec((reviews.blocks || []).map((b) => ({ title: b.title, text: b.text, author: b.author })));
    order.push(k);
  }

  // 7) FAQ
  if (faq) { const k = uid("faq"); sections[k] = faqSec(faq.blocks); order.push(k); }

  return { sections, order };
}
