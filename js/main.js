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
  craftMenu.querySelectorAll("a").forEach(a => {
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
  mobileNav.querySelectorAll("a").forEach(a => {
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
  mobileCraftMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileCraftToggle.setAttribute("aria-expanded", "false");
      mobileCraftMenu.hidden = true;
      closeMobileNav();
    });
  });
}
