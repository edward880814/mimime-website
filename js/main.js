document.addEventListener("DOMContentLoaded", () => {
  // footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /**
   * Desktop dropdown (click-to-open)
   */
  const craftBtn = document.getElementById("craftBtn");
  const craftMenu = document.getElementById("craftMenu");
  const craftDropdown = document.getElementById("craftDropdown");

  function closeCraftMenu() {
    if (!craftBtn || !craftMenu) return;
    craftBtn.setAttribute("aria-expanded", "false");
    craftMenu.classList.remove("open");
  }

  function toggleCraftMenu() {
    if (!craftBtn || !craftMenu) return;
    const expanded = craftBtn.getAttribute("aria-expanded") === "true";
    craftBtn.setAttribute("aria-expanded", String(!expanded));
    craftMenu.classList.toggle("open", !expanded);
  }

  if (craftBtn && craftMenu && craftDropdown) {
    craftBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCraftMenu();
    });

    // 點到 dropdown 裡面不要讓 document click 把它關掉（避免點不到）
    craftDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // 點外面關閉
    document.addEventListener("click", () => closeCraftMenu());

    // ESC 關閉
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeCraftMenu();
    });

    // 點選 menu 項目後：自動關閉（但連結會照常跳頁）
    craftMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeCraftMenu());
    });
  }

  /**
   * Mobile hamburger menu
   */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      mobileNav.hidden = expanded;
    });

    // 點選任何 mobile nav 連結後自動收起
    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        closeMobileNav();
        // 同時收起手作體驗子選單（如果有開）
        const craftMenu2 = document.getElementById("mobileCraftMenu");
        const craftToggle2 = document.getElementById("mobileCraftToggle");
        if (craftMenu2 && craftToggle2) {
          craftToggle2.setAttribute("aria-expanded", "false");
          craftMenu2.hidden = true;
        }
      });
    });
  }

  /**
   * Mobile "手作體驗" accordion inside hamburger menu
   */
  const mobileCraftToggle = document.getElementById("mobileCraftToggle");
  const mobileCraftMenu = document.getElementById("mobileCraftMenu");

  if (mobileCraftToggle && mobileCraftMenu) {
    mobileCraftToggle.addEventListener("click", () => {
      const expanded = mobileCraftToggle.getAttribute("aria-expanded") === "true";
      mobileCraftToggle.setAttribute("aria-expanded", String(!expanded));
      mobileCraftMenu.hidden = expanded;
    });

    // 點選子項目後：收起子選單 + 收起整個 mobile nav
    mobileCraftMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mobileCraftToggle.setAttribute("aria-expanded", "false");
        mobileCraftMenu.hidden = true;
        closeMobileNav();
      });
    });
  }

  // ===== 近期活動：點卡片開 Modal =====
  const grid = document.getElementById("activityGrid");
  const modal = document.getElementById("activityModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDate = document.getElementById("modalDate");
  const modalGallery = document.getElementById("modalGallery");

  function openModal() {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (modalGallery) modalGallery.innerHTML = "";
    document.body.style.overflow = "";
  }

  if (grid && modal && modalTitle && modalDate && modalGallery) {
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".activity-card");
      if (!card) return;

      const title = card.dataset.title || "活動";
      const date = card.dataset.date || "";
      const imgs = (card.dataset.images || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      modalTitle.textContent = title;
      modalDate.textContent = date ? `日期：${date.replaceAll("-", "/")}` : "";
      modalGallery.innerHTML = imgs
        .map((src) => `<img src="${src}" alt="${title} 照片" loading="lazy">`)
        .join("");

      openModal();
    });

    // 點背景/關閉鈕關閉
    modal.addEventListener("click", (e) => {
      if (!e.target.closest('[data-close="true"]')) return;
      closeModal();
    });

    // ESC 關閉
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  // ===== chips：點一下展開對應「精選分類 Accordion」 =====
  const filters = document.getElementById("activityFilters");
  const accordion = document.getElementById("featuredAccordion");

  if (filters && accordion) {
    const chips = Array.from(filters.querySelectorAll(".chip"));
    const items = Array.from(accordion.querySelectorAll(".acc-item"));

    const defaultChip = filters.querySelector('.chip.is-active');
    if (defaultChip && defaultChip.dataset.target === 'acc-all') {
      items.forEach(d => d.setAttribute('open', ''));
    }

    function setActiveChip(btn) {
      chips.forEach((b) => b.classList.remove("is-active"));
      if (btn) btn.classList.add("is-active");
    }

    function closeAll() {
      items.forEach((d) => d.removeAttribute("open"));
    }

    function openAndScroll(targetId) {
      const el = document.getElementById(targetId);
      if (!el) return;
    
      closeAll();
      el.setAttribute("open", "");
    
      // ✅ 只做一次 scrollIntoView，配合 scroll-margin-top
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    
    function showAll() {
      items.forEach((d) => d.setAttribute("open", ""));
      // ✅ 捲到整個精選區塊（Accordion 區塊的開頭）
      accordion.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    

    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;

      setActiveChip(btn);

      const target = btn.dataset.target;
      if (!target || target === "acc-all") {
        showAll();
        return;
      }
      openAndScroll(target);
    });

    // 使用者直接點 accordion 展開時：只保留一個展開 + 同步 chip 高亮
    accordion.addEventListener("toggle", (e) => {
      const d = e.target;
      if (!(d instanceof HTMLDetailsElement)) return;
      if (!d.open) return;

      items.forEach((x) => {
        if (x !== d) x.removeAttribute("open");
      });

      const id = d.id;
      const chip = chips.find((c) => c.dataset.target === id);
      if (chip) setActiveChip(chip);
    });
  }
});

// ===== 地點 Tabs + 複製地址 =====
const tabs = document.querySelectorAll(".tab[data-loc]");
const panels = document.querySelectorAll(".loc-panel");
const mapFrame = document.getElementById("mapFrame");

// 你之後把 embed 連結換成正確的
const MAP_EMBEDS = {
  taichung: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3641.0334912505296!2d120.65635716056137!3d24.135461946692804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d69d5588885%3A0xbaf8e94fa0140e44!2z6KaT6KyQbWUuMTY5!5e0!3m2!1szh-TW!2stw!4v1767441305103!5m2!1szh-TW!2stw",
  banqiao: "",
};

function setActiveLocation(key) {
  tabs.forEach(t => {
    const active = t.dataset.loc === key;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", String(active));
  });

  panels.forEach(p => {
    const active = p.id === `loc-${key}`;
    p.classList.toggle("is-active", active);
  });

  if (mapFrame && MAP_EMBEDS[key]) {
    mapFrame.src = MAP_EMBEDS[key];
  }
}

tabs.forEach(t => {
  t.addEventListener("click", () => setActiveLocation(t.dataset.loc));
});

// 複製地址
document.querySelectorAll("[data-copy]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const sel = btn.getAttribute("data-copy");
    const el = sel ? document.querySelector(sel) : null;
    if (!el) return;

    const text = el.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "已複製";
      setTimeout(() => (btn.textContent = "複製"), 900);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      btn.textContent = "已複製";
      setTimeout(() => (btn.textContent = "複製"), 900);
    }
  });
});
