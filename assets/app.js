(() => {
  "use strict";

  const select = (selector) => document.querySelector(selector);
  const selectAll = (selector) => [...document.querySelectorAll(selector)];
  const escapeHTML = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
    );
  const email = "rezamousavi354@gmail.com";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  function renderProjects() {
    const orderedProjects = [...projects].sort(
      (a, b) => Number(Boolean(b.personal)) - Number(Boolean(a.personal)),
    );
    select("#projectsGrid").innerHTML = orderedProjects
      .map((project) => {
        const { title, category, role, desc, tech, personal, repo } = project;
        return `<article class="project-card${personal ? " featured" : ""}">
        ${
          personal
            ? `<div class="project-visual">
          <div class="visual-caption"><span>ALGORITHM LAB</span><span>TRY A LITTLE EXPERIMENT</span></div>
          <div class="algorithm-window">
            <div class="window-top" aria-hidden="true"><i></i><i></i><i></i><span>Bubble sort / 10 values</span></div>
            <div class="bars" id="sortBars" aria-hidden="true"></div>
            <div class="preview-controls">
              <div class="preview-actions">
                <button class="preview-play" id="sortPlay" type="button" aria-label="Play sorting preview">Play</button>
                <button id="sortStep" type="button" aria-label="Advance sorting preview by one comparison">Step</button>
                <button id="sortReset" type="button" aria-label="Reset sorting preview">Reset</button>
              </div>
              <span class="preview-caption" id="sortProgress">Ready to sort</span>
            </div>
          </div>
          <p class="preview-hint">Small steps. A clearer picture.</p>
          <span class="sr-only" id="sortStatus" role="status"></span>
        </div>`
            : ""
        }
        <div class="project-content">
          <div class="project-meta"><span>${escapeHTML(category)}</span>${personal ? '<span class="badge">Personal Project</span>' : ""}</div>
          <h3>${repo ? `<a href="${escapeHTML(repo)}" target="_blank" rel="noopener noreferrer">${escapeHTML(title)}</a>` : escapeHTML(title)}</h3>
          <p>${escapeHTML(desc)}</p>
          <div class="tags">${tech.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}</div>
          <div class="project-bottom"><span class="project-role">${escapeHTML(role)}</span>${repo ? `<a href="${escapeHTML(repo)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHTML(title)} repository on GitHub">View repository <span aria-hidden="true">↗</span></a>` : ""}</div>
        </div>
      </article>`;
      })
      .join("");
  }

  function setupTheme() {
    const toggle = select("#themeToggle");
    const applyTheme = () => {
      const light = document.documentElement.dataset.theme === "light";
      toggle.setAttribute(
        "aria-label",
        `Switch to ${light ? "dark" : "light"} theme`,
      );
      toggle.setAttribute("aria-pressed", String(light));
      toggle.title = toggle.getAttribute("aria-label");
      select('meta[name="theme-color"]').content = getComputedStyle(
        document.documentElement,
      )
        .getPropertyValue("--bg")
        .trim();
    };
    applyTheme();
    toggle.addEventListener("click", () => {
      const theme =
        document.documentElement.dataset.theme === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      try {
        localStorage.setItem("portfolio-theme", theme);
      } catch {}
      applyTheme();
    });
    addEventListener("storage", (event) => {
      if (event.key !== "portfolio-theme") return;
      document.documentElement.dataset.theme =
        event.newValue === "light" ? "light" : "dark";
      applyTheme();
    });
  }

  function setupNavigation() {
    const menu = select("#menuButton");
    const links = select("#navLinks");
    const header = select(".site-header");
    const sections = selectAll("main > section[id]");
    const setMenu = (open) => {
      links.classList.toggle("open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", `${open ? "Close" : "Open"} navigation`);
    };
    menu.addEventListener("click", () =>
      setMenu(menu.getAttribute("aria-expanded") !== "true"),
    );
    links
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("click", (event) => {
      if (!links.contains(event.target) && !menu.contains(event.target))
        setMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        menu.getAttribute("aria-expanded") === "true"
      ) {
        setMenu(false);
        menu.focus();
      }
    });
    header.addEventListener("focusout", (event) => {
      if (!header.contains(event.relatedTarget)) setMenu(false);
    });
    matchMedia("(min-width: 721px)").addEventListener("change", (event) => {
      if (event.matches) setMenu(false);
    });
    let pending = false;
    function updateScroll() {
      header.classList.toggle("scrolled", scrollY > 16);
      let current = "home";
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 160) current = section.id;
      });
      if (
        scrollY > 0 &&
        innerHeight + scrollY >= document.documentElement.scrollHeight - 4
      )
        current = "contact";
      links.querySelectorAll("a").forEach((link) => {
        if (link.hash === `#${current}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      pending = false;
    }
    const scheduleScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(updateScroll);
    };
    addEventListener("scroll", scheduleScroll, { passive: true });
    addEventListener("resize", scheduleScroll, { passive: true });
    addEventListener("load", updateScroll);
    document.fonts?.ready.then(updateScroll);
    updateScroll();
  }

  function setupCopyActions() {
    const toast = select("#toast");
    let timeout;
    const announce = (message) => {
      toast.textContent = message;
      toast.classList.add("show");
      clearTimeout(timeout);
      timeout = setTimeout(() => toast.classList.remove("show"), 4500);
    };
    select("#copyEmail").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        announce("Email address copied.");
      } catch {
        announce(`Copy email: ${email}`);
      }
    });
    select("#copyCode").addEventListener("click", async () => {
      const lines = selectAll(".editor-line").map(
        (line) => line.lastElementChild.textContent,
      );
      try {
        await navigator.clipboard.writeText(lines.join("\n"));
        announce("TypeScript profile copied.");
      } catch {
        const code = select(".editor-code");
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        code.focus();
        announce("Code selected. Use your device’s copy command.");
      }
    });
  }

  function setupSortingPreview() {
    const initial = [28, 48, 35, 72, 55, 100, 66, 90, 78, 86];
    const bars = select("#sortBars");
    const play = select("#sortPlay");
    const step = select("#sortStep");
    const progress = select("#sortProgress");
    const status = select("#sortStatus");
    let values,
      index,
      pass,
      comparisons,
      timer = null,
      complete;

    function render(active = []) {
      bars.innerHTML = values
        .map(
          (value, position) =>
            `<i class="${complete || position >= values.length - pass ? "is-sorted" : active.includes(position) ? "is-active" : ""}" style="--bar-height:${value}%"></i>`,
        )
        .join("");
      progress.textContent = complete
        ? "Sorted ✓"
        : comparisons
          ? `${comparisons} comparisons`
          : "Ready to sort";
      play.textContent =
        timer === null ? (complete ? "Replay" : "Play") : "Pause";
      play.setAttribute(
        "aria-label",
        `${timer === null ? (complete ? "Replay" : "Play") : "Pause"} sorting preview`,
      );
      step.disabled = complete;
    }
    function pause() {
      clearInterval(timer);
      timer = null;
      render();
    }
    function reset() {
      clearInterval(timer);
      timer = null;
      values = [...initial];
      index = 0;
      pass = 0;
      comparisons = 0;
      complete = false;
      status.textContent =
        "Sorting preview ready. Play automatically or step through each comparison.";
      render();
    }
    function advance() {
      if (complete) return;
      const active = [index, index + 1];
      if (values[index] > values[index + 1])
        [values[index], values[index + 1]] = [values[index + 1], values[index]];
      comparisons++;
      index++;
      if (index >= values.length - pass - 1) {
        pass++;
        index = 0;
      }
      if (pass >= values.length - 1) {
        complete = true;
        clearInterval(timer);
        timer = null;
        status.textContent = `Sorted in ${comparisons} comparisons. Values: ${values.join(", ")}.`;
      } else if (timer === null) {
        status.textContent = `Comparison ${comparisons}. Values: ${values.join(", ")}.`;
      }
      render(active);
    }
    play.addEventListener("click", () => {
      if (timer !== null) {
        pause();
        status.textContent = "Sorting paused.";
        return;
      }
      if (complete) reset();
      timer = setInterval(advance, reducedMotion.matches ? 700 : 350);
      status.textContent = "Sorting started.";
      render();
    });
    step.addEventListener("click", () => {
      pause();
      advance();
    });
    select("#sortReset").addEventListener("click", reset);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pause();
    });
    reducedMotion.addEventListener("change", pause);
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting && timer !== null) pause();
      });
      observer.observe(bars);
    }
    reset();
  }

  renderProjects();
  setupTheme();
  setupNavigation();
  setupCopyActions();
  setupSortingPreview();
})();
