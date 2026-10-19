(() => {
  "use strict";
  const byId = (id) => document.getElementById(id);
  const sidebar = byId("site-navigation");
  const menuButton = byId("navigation-toggle");
  const scrim = byId("navigation-scrim");
  const homeButton = byId("home-toggle");
  const pageLinks = byId("page-links");
  const compact = window.matchMedia("(max-width: 1279px)");
  let drawerOpen = false;
  document.documentElement.classList.add("enhanced");
  const syncNavigation = () => {
    sidebar.hidden = compact.matches && !drawerOpen;
    menuButton.hidden = !compact.matches;
    menuButton.setAttribute("aria-expanded", String(compact.matches && drawerOpen));
    menuButton.setAttribute("aria-label", drawerOpen ? "关闭导航菜单" : "打开导航菜单");
    scrim.hidden = !(compact.matches && drawerOpen);
    document.body.classList.toggle("drawer-open", compact.matches && drawerOpen);
  };
  const closeNavigation = () => { drawerOpen = false; syncNavigation(); menuButton.focus(); };
  menuButton.addEventListener("click", () => {
    drawerOpen = !drawerOpen; syncNavigation();
    if (drawerOpen) sidebar.querySelector("a").focus();
  });
  scrim.addEventListener("click", closeNavigation);
  compact.addEventListener("change", () => { drawerOpen = false; syncNavigation(); });
  syncNavigation();
  homeButton.hidden = false;
  homeButton.addEventListener("click", () => {
    const expanded = homeButton.getAttribute("aria-expanded") === "true";
    pageLinks.hidden = expanded;
    homeButton.setAttribute("aria-expanded", String(!expanded));
    homeButton.setAttribute("aria-label", expanded ? "展开首页目录" : "收起首页目录");
  });
  document.addEventListener("keydown", (event) => {
    if (!compact.matches || !drawerOpen) return;
    if (event.key === "Escape") { closeNavigation(); return; }
    if (event.key !== "Tab") return;
    const focusable = [...sidebar.querySelectorAll("a,button")].filter((node) => node.getClientRects().length && !node.disabled);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  const searchButton = byId("search-toggle");
  const searchDialog = byId("search-dialog");
  const searchInput = byId("search-input");
  const results = byId("search-results");
  const searchIndex = JSON.parse(byId("search-data").textContent);
  const renderSearch = () => {
    const query = searchInput.value.trim().toLocaleLowerCase();
    results.replaceChildren();
    const matches = query ? searchIndex.filter((item) => `${item.title} ${item.text}`.toLocaleLowerCase().includes(query)) : [];
    if (!matches.length) {
      const message = document.createElement("p");
      message.textContent = query ? "没有找到相关内容。" : "输入关键词搜索本站。";
      results.append(message); return;
    }
    for (const item of matches) {
      const article = document.createElement("article"); article.className = "search-result";
      const link = document.createElement("a"); link.href = item.url; link.textContent = item.title;
      article.append(link); results.append(article);
    }
  };
  searchButton.hidden = false;
  searchButton.addEventListener("click", () => { renderSearch(); searchDialog.showModal(); searchInput.focus(); });
  byId("search-close").addEventListener("click", () => searchDialog.close());
  searchDialog.addEventListener("close", () => searchButton.focus());
  searchDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); searchDialog.close(); }
  });
  searchInput.addEventListener("input", renderSearch);
  byId("search-form").addEventListener("submit", (event) => { event.preventDefault(); renderSearch(); });
})();
