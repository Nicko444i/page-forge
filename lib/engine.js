/* ============================================================================
   Page Forge — Motore UPS (lato server)
   Universal Page Schema -> file Shopify OS 2.0. Nessuna dipendenza esterna.
   Sezioni attive: hero, benefits, reviews, faq, rich_text, cta_banner + product_core
   ========================================================================== */

const STYLE_SETTING = `{"type":"select","id":"style","label":"Style","default":"editorial","options":[{"value":"editorial","label":"Editorial"},{"value":"bold","label":"Bold"},{"value":"minimal","label":"Minimal"}]}`;

export const BASE_CSS = `.ppg{--ppg-maxw:1080px;--ppg-pad:clamp(20px,5vw,64px);}
.ppg,.ppg *{box-sizing:border-box;}
.ppg[data-ppg-style="editorial"]{--ppg-bg:#f6f4ef;--ppg-fg:#1c1a17;--ppg-muted:#6c6459;--ppg-accent:#7a2230;--ppg-card:#fffdf8;--ppg-line:#e2dccf;--ppg-head:'Fraunces','Iowan Old Style',Palatino,Georgia,serif;--ppg-body:'Inter',system-ui,sans-serif;--ppg-radius:2px;--ppg-btn-fg:#fff;}
.ppg[data-ppg-style="bold"]{--ppg-bg:#0f0f10;--ppg-fg:#f4f4f5;--ppg-muted:#a1a1aa;--ppg-accent:#e8b23a;--ppg-card:#17171a;--ppg-line:#2a2a2e;--ppg-head:'Inter',Arial,sans-serif;--ppg-body:'Inter',system-ui,sans-serif;--ppg-radius:14px;--ppg-btn-fg:#0f0f10;}
.ppg[data-ppg-style="minimal"]{--ppg-bg:#ffffff;--ppg-fg:#111827;--ppg-muted:#6b7280;--ppg-accent:#111827;--ppg-card:#fafafa;--ppg-line:#ececec;--ppg-head:'Inter',system-ui,sans-serif;--ppg-body:'Inter',system-ui,sans-serif;--ppg-radius:8px;--ppg-btn-fg:#fff;}
.ppg{background:var(--ppg-bg);color:var(--ppg-fg);font-family:var(--ppg-body);}
.ppg__wrap{max-width:var(--ppg-maxw);margin:0 auto;padding:0 var(--ppg-pad);}
.ppg h1,.ppg h2,.ppg h3{font-family:var(--ppg-head);font-weight:600;line-height:1.1;margin:0;}
.ppg p{margin:0 0 1em;line-height:1.6;}.ppg p:last-child{margin-bottom:0;}
.ppg a{color:inherit;}
.ppg__eyebrow{text-transform:uppercase;letter-spacing:.18em;font-size:.72rem;color:var(--ppg-accent);font-weight:600;margin:0 0 14px;}
.ppg__btn{display:inline-block;background:var(--ppg-accent);color:var(--ppg-btn-fg);text-decoration:none;padding:14px 28px;border-radius:var(--ppg-radius);font-weight:600;font-size:.95rem;}`;

const SECTION_CSS = {
  hero: `.ppg-hero{padding:clamp(48px,9vw,110px) 0;}
.ppg-hero__wrap{max-width:760px;}
.ppg-hero__wrap--center{margin-left:auto;margin-right:auto;text-align:center;}
.ppg-hero__title{font-size:clamp(2rem,6vw,4rem);letter-spacing:-.01em;}
.ppg-hero__sub{margin-top:20px;font-size:clamp(1.05rem,2.2vw,1.3rem);color:var(--ppg-muted);}
.ppg-hero__cta{margin-top:28px;}`,
  benefits: `.ppg-benefits{padding:clamp(40px,7vw,88px) 0;border-top:1px solid var(--ppg-line);}
.ppg-benefits__h{font-size:clamp(1.5rem,3.5vw,2.3rem);margin-bottom:34px;}
.ppg-benefits__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:26px;}
.ppg-benefits__icon{font-size:1.6rem;margin-bottom:10px;color:var(--ppg-accent);}
.ppg-benefits__t{font-size:1.12rem;margin-bottom:8px;}
.ppg-benefits__x{color:var(--ppg-muted);font-size:.97rem;}`,
  reviews: `.ppg-reviews{padding:clamp(40px,7vw,88px) 0;border-top:1px solid var(--ppg-line);}
.ppg-reviews__h{font-size:clamp(1.5rem,3.5vw,2.3rem);margin-bottom:34px;}
.ppg-reviews__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;}
.ppg-reviews__card{margin:0;background:var(--ppg-card);border:1px solid var(--ppg-line);border-radius:var(--ppg-radius);padding:24px;}
.ppg-reviews__stars{color:var(--ppg-accent);letter-spacing:2px;margin-bottom:12px;}
.ppg-reviews__q{margin:0 0 14px;font-size:1rem;line-height:1.55;}
.ppg-reviews__a{color:var(--ppg-muted);font-size:.9rem;font-weight:600;}`,
  faq: `.ppg-faq{padding:clamp(40px,7vw,88px) 0;border-top:1px solid var(--ppg-line);}
.ppg-faq__wrap{max-width:760px;}
.ppg-faq__h{font-size:clamp(1.5rem,3.5vw,2.3rem);margin-bottom:28px;}
.ppg-faq__item{border-bottom:1px solid var(--ppg-line);}
.ppg-faq__q{cursor:pointer;font-weight:600;padding:16px 0;list-style:none;font-size:1.05rem;}
.ppg-faq__q::-webkit-details-marker{display:none;}
.ppg-faq__a{padding:0 0 18px;color:var(--ppg-muted);}`,
  rich_text: `.ppg-rich{padding:clamp(40px,7vw,88px) 0;border-top:1px solid var(--ppg-line);}
.ppg-rich__wrap{max-width:720px;}
.ppg-rich__h{font-size:clamp(1.5rem,3.5vw,2.3rem);margin-bottom:20px;}
.ppg-rich__body{color:var(--ppg-muted);font-size:1.05rem;}`,
  cta_banner: `.ppg-cta{padding:clamp(48px,8vw,100px) 0;border-top:1px solid var(--ppg-line);}
.ppg-cta__wrap{max-width:680px;text-align:center;}
.ppg-cta__h{font-size:clamp(1.7rem,4.5vw,2.8rem);margin-bottom:16px;}
.ppg-cta__s{color:var(--ppg-muted);font-size:1.1rem;margin-bottom:26px;}`,
};

export const TYPE_TO_SECTION = {
  hero: "ppg-hero", benefits: "ppg-benefits", reviews: "ppg-reviews",
  faq: "ppg-faq", rich_text: "ppg-rich-text", cta_banner: "ppg-cta",
};
export const ACTIVE_TYPES = Object.keys(TYPE_TO_SECTION);

/* -------------------------------- Liquid per sezione ---------------------- */
function liquidFile(type) {
  const css = SECTION_CSS[type];
  const s = `data-ppg-style="{{ section.settings.style }}"`;
  const base = `{{ 'ppg-base.css' | asset_url | stylesheet_tag }}\n`;
  const wrap = (inner, schema) =>
    base + inner + `\n{% stylesheet %}\n${css}\n{% endstylesheet %}\n{% schema %}\n${schema}\n{% endschema %}\n`;

  if (type === "hero")
    return wrap(
      `<section class="ppg ppg-hero" ${s}>
  <div class="ppg__wrap ppg-hero__wrap ppg-hero__wrap--{{ section.settings.align }}">
    {% if section.settings.eyebrow != blank %}<p class="ppg__eyebrow">{{ section.settings.eyebrow }}</p>{% endif %}
    <h1 class="ppg-hero__title">{{ section.settings.headline | escape }}</h1>
    {% if section.settings.subhead != blank %}<div class="ppg-hero__sub">{{ section.settings.subhead }}</div>{% endif %}
    {% if section.settings.cta_label != blank %}<a class="ppg__btn ppg-hero__cta" href="{{ section.settings.cta_url | default: '#' }}">{{ section.settings.cta_label }}</a>{% endif %}
  </div>
</section>`,
      `{"name":"PPG Hero","tag":"section","settings":[${STYLE_SETTING},{"type":"select","id":"align","label":"Alignment","default":"left","options":[{"value":"left","label":"Left"},{"value":"center","label":"Center"}]},{"type":"text","id":"eyebrow","label":"Eyebrow"},{"type":"text","id":"headline","label":"Headline","default":"Product headline"},{"type":"richtext","id":"subhead","label":"Subheadline"},{"type":"text","id":"cta_label","label":"Button label"},{"type":"url","id":"cta_url","label":"Button link"}],"presets":[{"name":"PPG Hero"}]}`
    );

  if (type === "benefits")
    return wrap(
      `<section class="ppg ppg-benefits" ${s}>
  <div class="ppg__wrap">
    {% if section.settings.heading != blank %}<h2 class="ppg-benefits__h">{{ section.settings.heading | escape }}</h2>{% endif %}
    <div class="ppg-benefits__grid">
      {% for block in section.blocks %}
      <div class="ppg-benefits__item" {{ block.shopify_attributes }}>
        {% if block.settings.icon != blank %}<div class="ppg-benefits__icon">{{ block.settings.icon }}</div>{% endif %}
        {% if block.settings.title != blank %}<h3 class="ppg-benefits__t">{{ block.settings.title | escape }}</h3>{% endif %}
        {% if block.settings.text != blank %}<div class="ppg-benefits__x">{{ block.settings.text }}</div>{% endif %}
      </div>
      {% endfor %}
    </div>
  </div>
</section>`,
      `{"name":"PPG Benefits","tag":"section","settings":[${STYLE_SETTING},{"type":"text","id":"heading","label":"Heading","default":"Why you'll love it"}],"blocks":[{"type":"benefit","name":"Benefit","settings":[{"type":"text","id":"icon","label":"Icon"},{"type":"text","id":"title","label":"Title"},{"type":"richtext","id":"text","label":"Text"}]}],"max_blocks":12,"presets":[{"name":"PPG Benefits","blocks":[{"type":"benefit"},{"type":"benefit"},{"type":"benefit"}]}]}`
    );

  if (type === "reviews")
    return wrap(
      `<section class="ppg ppg-reviews" ${s}>
  <div class="ppg__wrap">
    {% if section.settings.heading != blank %}<h2 class="ppg-reviews__h">{{ section.settings.heading | escape }}</h2>{% endif %}
    <div class="ppg-reviews__grid">
      {% for block in section.blocks %}
      <figure class="ppg-reviews__card" {{ block.shopify_attributes }}>
        <div class="ppg-reviews__stars">{% assign r = block.settings.rating | plus: 0 %}{% for i in (1..5) %}{% if i <= r %}&#9733;{% else %}&#9734;{% endif %}{% endfor %}</div>
        {% if block.settings.text != blank %}<blockquote class="ppg-reviews__q">{{ block.settings.text }}</blockquote>{% endif %}
        {% if block.settings.author != blank %}<figcaption class="ppg-reviews__a">{{ block.settings.author | escape }}</figcaption>{% endif %}
      </figure>
      {% endfor %}
    </div>
  </div>
</section>`,
      `{"name":"PPG Reviews","tag":"section","settings":[${STYLE_SETTING},{"type":"text","id":"heading","label":"Heading","default":"What customers say"}],"blocks":[{"type":"review","name":"Review","settings":[{"type":"text","id":"author","label":"Author"},{"type":"range","id":"rating","min":1,"max":5,"step":1,"default":5,"label":"Rating"},{"type":"richtext","id":"text","label":"Text"}]}],"max_blocks":24,"presets":[{"name":"PPG Reviews","blocks":[{"type":"review"},{"type":"review"}]}]}`
    );

  if (type === "faq")
    return wrap(
      `<section class="ppg ppg-faq" ${s}>
  <div class="ppg__wrap ppg-faq__wrap">
    {% if section.settings.heading != blank %}<h2 class="ppg-faq__h">{{ section.settings.heading | escape }}</h2>{% endif %}
    <div class="ppg-faq__list">
      {% for block in section.blocks %}
      <details class="ppg-faq__item" {{ block.shopify_attributes }}>
        <summary class="ppg-faq__q">{{ block.settings.question | escape }}</summary>
        <div class="ppg-faq__a">{{ block.settings.answer }}</div>
      </details>
      {% endfor %}
    </div>
  </div>
</section>`,
      `{"name":"PPG FAQ","tag":"section","settings":[${STYLE_SETTING},{"type":"text","id":"heading","label":"Heading","default":"Frequently asked questions"}],"blocks":[{"type":"item","name":"Question","settings":[{"type":"text","id":"question","label":"Question"},{"type":"richtext","id":"answer","label":"Answer"}]}],"max_blocks":24,"presets":[{"name":"PPG FAQ","blocks":[{"type":"item"},{"type":"item"}]}]}`
    );

  if (type === "rich_text")
    return wrap(
      `<section class="ppg ppg-rich" ${s}>
  <div class="ppg__wrap ppg-rich__wrap">
    {% if section.settings.heading != blank %}<h2 class="ppg-rich__h">{{ section.settings.heading | escape }}</h2>{% endif %}
    <div class="ppg-rich__body">{{ section.settings.body }}</div>
  </div>
</section>`,
      `{"name":"PPG Rich text","tag":"section","settings":[${STYLE_SETTING},{"type":"text","id":"heading","label":"Heading"},{"type":"richtext","id":"body","label":"Body","default":"<p>Body text.</p>"}],"presets":[{"name":"PPG Rich text"}]}`
    );

  if (type === "cta_banner")
    return wrap(
      `<section class="ppg ppg-cta" ${s}>
  <div class="ppg__wrap ppg-cta__wrap">
    {% if section.settings.headline != blank %}<h2 class="ppg-cta__h">{{ section.settings.headline | escape }}</h2>{% endif %}
    {% if section.settings.subtext != blank %}<div class="ppg-cta__s">{{ section.settings.subtext }}</div>{% endif %}
    {% if section.settings.button_label != blank %}<a class="ppg__btn" href="{{ section.settings.button_url | default: '#' }}">{{ section.settings.button_label }}</a>{% endif %}
  </div>
</section>`,
      `{"name":"PPG CTA","tag":"section","settings":[${STYLE_SETTING},{"type":"text","id":"headline","label":"Headline","default":"Ready to try it?"},{"type":"richtext","id":"subtext","label":"Subtext"},{"type":"text","id":"button_label","label":"Button label","default":"Buy now"},{"type":"url","id":"button_url","label":"Button link"}],"presets":[{"name":"PPG CTA"}]}`
    );

  return "";
}

/* -------------------------------- Helpers --------------------------------- */
export function slugify(x) {
  return (x || "product").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "product";
}
function esc(x) { return String(x == null ? "" : x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function uid(p) { return p + "_" + Math.random().toString(36).slice(2, 7); }
function stars(n) { const r = Math.max(0, Math.min(5, parseInt(n) || 0)); return "\u2605".repeat(r) + "\u2606".repeat(5 - r); }
function stripBullet(l) { return l.replace(/^[\s\-\u2013\u2014\u2022\*\u00b7]+/, "").trim(); }
function para(t) { return String(t || "").split(/\n+/).map((x) => x.trim()).filter(Boolean).map((x) => "<p>" + esc(x) + "</p>").join(""); }

const KW = {
  benefits: ["why you", "why you'll", "why you will", "benefits", "love it", "features", "what you get", "what it does", "highlights", "key features"],
  reviews: ["review", "customers say", "customer", "testimonial", "what people", "loved by", "rating", "5 stars"],
  faq: ["faq", "frequently asked", "questions", "q&a", "q & a", "common questions"],
  cta: ["ready", "try ", "get yours", "order now", "shop now", "buy now", "claim", "don't miss", "start now", "grab yours", "add to cart"],
};
function matchKw(line, arr) { const l = line.toLowerCase(); return arr.some((k) => l.includes(k)); }

/* -------------------------------- Parser deterministico ------------------- */
export function parseScriptToUPS(script, name) {
  const text = (script || "").replace(/\r/g, "").trim();
  if (!text) throw new Error("script vuoto");
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const sections = [];

  blocks.forEach((block, idx) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return;
    const head = lines[0];
    const isLast = idx === blocks.length - 1;

    if (idx === 0) {
      let eyebrow = null, headline = lines[0], subLines = lines.slice(1);
      if (lines.length >= 2 && lines[0].split(/\s+/).length <= 3 && !/[.!?]$/.test(lines[0])) {
        eyebrow = lines[0]; headline = lines[1]; subLines = lines.slice(2);
      }
      const settings = { headline, align: "left", cta_label: "Buy now" };
      if (eyebrow) settings.eyebrow = eyebrow;
      if (subLines.length) settings.subhead = para(subLines.join("\n"));
      sections.push({ id: uid("s"), type: "hero", settings });
      sections.push({ id: uid("s"), type: "product_core", settings: {} });
      return;
    }
    if (matchKw(head, KW.benefits)) {
      const items = lines.slice(1).map(stripBullet).filter(Boolean);
      const blk = items.map((it) => {
        const m = it.split(/\s+[\u2013\u2014-]\s+|:\s+/);
        return m.length >= 2 ? { icon: "", title: m[0].trim(), text: para(m.slice(1).join(" ")) } : { icon: "", title: it, text: "" };
      });
      if (blk.length) { sections.push({ id: uid("s"), type: "benefits", settings: { heading: head }, blocks: blk }); return; }
    }
    if (matchKw(head, KW.reviews)) {
      const blk = [];
      lines.slice(1).forEach((l) => {
        const q = l.match(/[\u201c"](.+?)[\u201d"]/);
        let quote = q ? q[1] : null, rem = q ? l.replace(q[0], "").trim() : l, rating = 5;
        const rate = rem.match(/(\d)\s*(?:stars?|\/\s*5)/i);
        if (rate) { rating = Math.max(1, Math.min(5, parseInt(rate[1]))); rem = rem.replace(rate[0], "").trim(); }
        const sc = (l.match(/[\u2605]/g) || []).length; if (sc) rating = Math.max(1, Math.min(5, sc));
        let author = rem.replace(/^[\s\-\u2013\u2014:]+/, "").replace(/[()]/g, "").trim();
        if (!quote) { quote = stripBullet(l); author = ""; }
        if (quote) blk.push({ author, rating, text: para(quote) });
      });
      if (blk.length) { sections.push({ id: uid("s"), type: "reviews", settings: { heading: head }, blocks: blk }); return; }
    }
    if (matchKw(head, KW.faq)) {
      const blk = []; let cur = null;
      lines.slice(1).forEach((l) => {
        const inline = l.match(/^(.+?\?)\s+(.+)$/);
        if (l.endsWith("?")) { cur = { question: l, a: [] }; blk.push(cur); }
        else if (inline) { cur = { question: inline[1].trim(), a: [inline[2].trim()] }; blk.push(cur); }
        else if (cur) { cur.a.push(l); }
        else { cur = { question: l, a: [] }; blk.push(cur); }
      });
      const items = blk.map((x) => ({ question: x.question, answer: para((x.a || []).join("\n")) }));
      if (items.length) { sections.push({ id: uid("s"), type: "faq", settings: { heading: head }, blocks: items }); return; }
    }
    if (matchKw(head, KW.cta) || (isLast && lines.length <= 3 && /[?!]/.test(block))) {
      const sub = lines.slice(1).join("\n");
      sections.push({ id: uid("s"), type: "cta_banner", settings: { headline: lines[0], subtext: sub ? para(sub) : "", button_label: "Buy now" } });
      return;
    }
    let heading = null, body = lines;
    if (lines.length >= 2 && lines[0].split(/\s+/).length <= 6 && !/[.!?]$/.test(lines[0])) { heading = lines[0]; body = lines.slice(1); }
    sections.push({ id: uid("s"), type: "rich_text", settings: { ...(heading ? { heading } : {}), body: para(body.join("\n")) } });
  });

  const nm = name || (sections[0] && sections[0].settings && sections[0].settings.headline) || "Product";
  return { ups_version: "1.0", meta: { name: nm, slug: slugify(nm), source_language: "en", sources: ["script"] }, design: { style_preset: "editorial", source: "script" }, sections };
}

/* -------------------------------- Coerce / validazione -------------------- */
export function coerceUPS(raw, fallbackName) {
  const ups = raw && typeof raw === "object" ? raw : {};
  ups.ups_version = "1.0";
  ups.meta = ups.meta || {};
  ups.meta.name = ups.meta.name || fallbackName || "Product";
  ups.meta.slug = slugify(ups.meta.slug || ups.meta.name);
  ups.meta.source_language = ups.meta.source_language || "en";
  ups.design = ups.design || {};
  if (!["editorial", "bold", "minimal"].includes(ups.design.style_preset)) ups.design.style_preset = "editorial";

  // L'AI emette i campi al PRIMO livello (section.body, block.icon…), il parser
  // li mette sotto settings. La preview legge gli scalari di sezione da settings,
  // l'adapter Shrine li legge dal primo livello. Qui li rispecchiamo in ENTRAMBE
  // le forme: nessun consumatore resta a secco. È il fix alla frontiera dello schema.
  const SEC_FIELDS = {
    hero: ["eyebrow", "headline", "subhead", "align", "cta_label", "cta_url"],
    rich_text: ["heading", "body"],
    cta_banner: ["headline", "subtext", "button_label", "button_url"],
    benefits: ["heading"], reviews: ["heading"], faq: ["heading"],
  };
  const BLK_FIELDS = {
    benefits: ["icon", "title", "text"],
    reviews: ["author", "rating", "text"],
    faq: ["question", "answer"],
  };
  const mirror = (obj, fields) => {
    if (!obj || typeof obj !== "object") return;
    obj.settings = obj.settings || {};
    (fields || []).forEach((k) => {
      const top = obj[k], set = obj.settings[k];
      if (set == null && top != null) obj.settings[k] = top;
      else if (top == null && set != null) obj[k] = set;
    });
  };

  let secs = Array.isArray(ups.sections) ? ups.sections : [];
  secs = secs.map((s) => {
    s = s && typeof s === "object" ? s : {};
    s.id = s.id || uid("sec");
    if (s.type !== "product_core" && !ACTIVE_TYPES.includes(s.type)) {
      const set = s.settings || {};
      const body = set.body || set.text || s.body || s.text || "<p></p>";
      s = { id: s.id, type: "rich_text", settings: { heading: set.heading || s.heading, body }, body };
    }
    s.settings = s.settings || {};
    mirror(s, SEC_FIELDS[s.type]);
    if (["benefits", "reviews", "faq"].includes(s.type)) {
      s.blocks = Array.isArray(s.blocks) ? s.blocks.slice(0, 50) : [];
      s.blocks.forEach((b) => mirror(b, BLK_FIELDS[s.type]));
    }
    return s;
  });
  const cores = secs.filter((s) => s.type === "product_core");
  if (cores.length === 0) {
    const at = secs.length && secs[0].type === "hero" ? 1 : 0;
    secs.splice(at, 0, { id: uid("core"), type: "product_core", settings: {} });
  } else if (cores.length > 1) {
    let seen = false; secs = secs.filter((s) => (s.type !== "product_core" ? true : seen ? false : (seen = true)));
  }
  ups.sections = secs.slice(0, 25);
  return ups;
}

/* -------------------------------- Adapter: UPS -> file --------------------- */
function cleanSettings(s) {
  const out = {};
  const keep = {
    hero: ["eyebrow", "headline", "subhead", "align", "cta_label", "cta_url"],
    rich_text: ["heading", "body"], cta_banner: ["headline", "subtext", "button_label", "button_url"],
    benefits: ["heading"], reviews: ["heading"], faq: ["heading"],
  }[s.type] || [];
  keep.forEach((k) => { if (s.settings[k] != null) out[k] = s.settings[k]; });
  if (s.type === "hero" && !["left", "center"].includes(out.align)) out.align = "left";
  return out;
}
function blockSettings(type, b) {
  b = b || {};
  if (type === "benefits") return { icon: b.icon || "", title: b.title || "", text: b.text || "" };
  if (type === "reviews") return { author: b.author || "", rating: Math.max(1, Math.min(5, parseInt(b.rating) || 5)), text: b.text || "" };
  return { question: b.question || "", answer: b.answer || "" };
}
export function buildSectionFiles(ups) {
  const style = ups.design.style_preset;
  const files = {}; const sectionsMap = {}; const orderBefore = []; const orderAfter = [];
  let passedCore = false; const usedTypes = new Set();
  for (const s of ups.sections) {
    if (s.type === "product_core") { passedCore = true; continue; }
    const key = uid("ppg_" + s.type);
    const entry = { type: TYPE_TO_SECTION[s.type], settings: { style, ...cleanSettings(s) } };
    if (["benefits", "reviews", "faq"].includes(s.type)) {
      const blocks = {}; const bo = [];
      const bt = s.type === "benefits" ? "benefit" : s.type === "reviews" ? "review" : "item";
      (s.blocks || []).forEach((b) => { const bk = uid("b"); blocks[bk] = { type: bt, settings: blockSettings(s.type, b) }; bo.push(bk); });
      entry.blocks = blocks; entry.block_order = bo;
    }
    sectionsMap[key] = entry;
    (passedCore ? orderAfter : orderBefore).push(key);
    usedTypes.add(s.type);
  }
  files["assets/ppg-base.css"] = BASE_CSS;
  usedTypes.forEach((t) => { files["sections/" + TYPE_TO_SECTION[t] + ".liquid"] = liquidFile(t); });
  return { files, sectionsMap, orderBefore, orderAfter, usedTypes: [...usedTypes] };
}

/* -------------------------------- Merger: nel product.json ---------------- */
function buyBoxEntry(name) {
  return {
    type: name, settings: {},
    blocks: {
      title: { type: "title", settings: {} }, price: { type: "price", settings: {} },
      variant: { type: "variant_picker", settings: {} }, qty: { type: "quantity_selector", settings: {} },
      buy: { type: "buy_buttons", settings: {} }, desc: { type: "description", settings: {} },
    },
    block_order: ["title", "price", "variant", "qty", "buy", "desc"],
  };
}
export function mergeTemplate(adapter, existingProductJson, buyBoxName) {
  const warnings = [];
  const { sectionsMap, orderBefore, orderAfter } = adapter;
  let template = null; let mode = "standalone";
  const bb = (buyBoxName || "").trim();

  if (existingProductJson && typeof existingProductJson === "object" && existingProductJson.sections && existingProductJson.order) {
    template = { ...existingProductJson };
    template.sections = { ...existingProductJson.sections, ...sectionsMap };
    template.order = [...orderBefore, ...existingProductJson.order, ...orderAfter];
    mode = "merged";
  } else if (bb) {
    template = { sections: { ...sectionsMap, buybox: buyBoxEntry(bb) }, order: [...orderBefore, "buybox", ...orderAfter] };
    mode = "wired";
    warnings.push("Buy box referenziata come sezione \u201c" + bb + "\u201d con blocchi standard.");
  } else {
    template = { sections: sectionsMap, order: [...orderBefore, ...orderAfter] };
    warnings.push("Template senza buy box: aggiungilo dall'editor del tema.");
  }
  return { template, mode, warnings };
}

/* -------------------------------- Anteprima HTML -------------------------- */
export function previewHTML(ups) {
  const style = ups.design.style_preset;
  const parts = ups.sections.map((s) => {
    const open = `<section class="ppg ppg-${s.type === "rich_text" ? "rich" : s.type === "cta_banner" ? "cta" : s.type}" data-ppg-style="${style}">`;
    const set = s.settings || {};
    if (s.type === "product_core")
      return `<div style="border:1px dashed #cbb;margin:0;padding:34px 24px;text-align:center;color:#8a8378;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase">Buy box del tema &mdash; inserito qui dal merger</div>`;
    if (s.type === "hero")
      return `${open}<div class="ppg__wrap ppg-hero__wrap ppg-hero__wrap--${set.align === "center" ? "center" : "left"}">${set.eyebrow ? `<p class="ppg__eyebrow">${esc(set.eyebrow)}</p>` : ""}<h1 class="ppg-hero__title">${esc(set.headline)}</h1>${set.subhead ? `<div class="ppg-hero__sub">${set.subhead}</div>` : ""}${set.cta_label ? `<a class="ppg__btn ppg-hero__cta" href="#">${esc(set.cta_label)}</a>` : ""}</div></section>`;
    if (s.type === "benefits")
      return `${open}<div class="ppg__wrap">${set.heading ? `<h2 class="ppg-benefits__h">${esc(set.heading)}</h2>` : ""}<div class="ppg-benefits__grid">${(s.blocks || []).map((b) => `<div class="ppg-benefits__item">${b.icon ? `<div class="ppg-benefits__icon">${esc(b.icon)}</div>` : ""}${b.title ? `<h3 class="ppg-benefits__t">${esc(b.title)}</h3>` : ""}${b.text ? `<div class="ppg-benefits__x">${b.text}</div>` : ""}</div>`).join("")}</div></div></section>`;
    if (s.type === "reviews")
      return `${open}<div class="ppg__wrap">${set.heading ? `<h2 class="ppg-reviews__h">${esc(set.heading)}</h2>` : ""}<div class="ppg-reviews__grid">${(s.blocks || []).map((b) => `<figure class="ppg-reviews__card"><div class="ppg-reviews__stars">${stars(b.rating)}</div>${b.text ? `<blockquote class="ppg-reviews__q">${b.text}</blockquote>` : ""}${b.author ? `<figcaption class="ppg-reviews__a">${esc(b.author)}</figcaption>` : ""}</figure>`).join("")}</div></div></section>`;
    if (s.type === "faq")
      return `${open}<div class="ppg__wrap ppg-faq__wrap">${set.heading ? `<h2 class="ppg-faq__h">${esc(set.heading)}</h2>` : ""}<div class="ppg-faq__list">${(s.blocks || []).map((b) => `<details class="ppg-faq__item" open><summary class="ppg-faq__q">${esc(b.question)}</summary><div class="ppg-faq__a">${b.answer || ""}</div></details>`).join("")}</div></div></section>`;
    if (s.type === "rich_text")
      return `${open}<div class="ppg__wrap ppg-rich__wrap">${set.heading ? `<h2 class="ppg-rich__h">${esc(set.heading)}</h2>` : ""}<div class="ppg-rich__body">${set.body || ""}</div></div></section>`;
    if (s.type === "cta_banner")
      return `${open}<div class="ppg__wrap ppg-cta__wrap">${set.headline ? `<h2 class="ppg-cta__h">${esc(set.headline)}</h2>` : ""}${set.subtext ? `<div class="ppg-cta__s">${set.subtext}</div>` : ""}${set.button_label ? `<a class="ppg__btn" href="#">${esc(set.button_label)}</a>` : ""}</div></section>`;
    return "";
  });
  const css = BASE_CSS + "\n" + ACTIVE_TYPES.map((t) => SECTION_CSS[t]).join("\n");
  return { css, html: parts.join("\n") };
}
