import React from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatedThemeToggler, THEMES } from '@/components/ui/animated-theme-toggler';
import './styles/main.css';
import { UI_ICONS } from './engine/icons';
import { IsoStage } from './engine/isoStage';
import {
  SYLLABUS,
  findModuleForLesson,
  loadLesson,
  totalLessonsCount,
} from './curriculum/syllabus';
import type { Lesson, MetricValue } from './types';
import {
  renderCheatsheetsView,
  renderNetLabView,
  renderPracticeView,
} from './views/secondaryViews';

type TabMode = 'learn' | 'practice' | 'lab' | 'cheatsheets';

const STORAGE_DONE = 'nettrace:done';
const STORAGE_THEME = 'nettrace:theme';
const STORAGE_GOALS_MINIMIZED = 'nettrace:goals-minimized';

class NetTraceApp {
  private root: HTMLElement;
  private tab: TabMode = 'learn';
  private currentLessonId = 'ip-address-structure';
  private currentLesson: Lesson | null = null;
  private stepIdx = 0;
  private openModules = new Set<string>(['ch1-ip-fundamentals', 'foundations']);
  private progressOpen = false;
  private completed = new Set<string>();
  private stage: IsoStage | null = null;
  private lastMetrics: Record<string, string | number> = {};
  private speaking = false;
  private wasPausedBeforeTabSwitch = false;
  private goalsMinimized = false;

  constructor(root: HTMLElement) {
    this.root = root;
    this.loadProgress();
    this.loadGoalsState();
    this.readHash();
    const targetTab = this.tab;
    this.renderShell();
    this.bindGlobalEvents();
    this.openLesson(this.currentLessonId, this.stepIdx, true);
    if (targetTab !== 'learn') {
      this.switchTab(targetTab);
    }
  }

  private loadGoalsState() {
    try {
      this.goalsMinimized = localStorage.getItem(STORAGE_GOALS_MINIMIZED) === 'true';
    } catch {}
  }

  private toggleGoalsMinimized() {
    this.goalsMinimized = !this.goalsMinimized;
    try {
      localStorage.setItem(STORAGE_GOALS_MINIMIZED, String(this.goalsMinimized));
    } catch {}
    if (this.currentLesson) {
      this.renderGoalsCard(this.currentLesson);
    }
  }

  private loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_DONE);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) arr.forEach((id) => this.completed.add(String(id)));
      }
    } catch {}
  }

  private saveProgress() {
    try {
      localStorage.setItem(STORAGE_DONE, JSON.stringify([...this.completed]));
    } catch {}
  }

  private readHash() {
    const h = location.hash.replace(/^#\/?/, '');
    if (!h) return;
    if (h === 'practice' || h === 'lab' || h === 'cheatsheets') {
      this.tab = h;
      return;
    }
    const [lessonId, stepStr] = h.split('/');
    if (lessonId) {
      this.tab = 'learn';
      this.currentLessonId = lessonId;
      const s = Number(stepStr);
      if (Number.isFinite(s) && s >= 1) this.stepIdx = s - 1;
    }
  }

  private updateHash() {
    if (this.tab !== 'learn') {
      history.replaceState(null, '', `#/${this.tab}`);
    } else {
      history.replaceState(null, '', `#/${this.currentLessonId}/${this.stepIdx + 1}`);
    }
  }

  private renderShell() {
    const isDark = document.documentElement.dataset.theme === 'dark';
    this.root.innerHTML = `
      <div class="window">
        <header class="topbar">
          <button class="menu-btn" id="menu-btn" aria-label="Menu">${UI_ICONS.menu}</button>
          <a href="#/ip-address-structure/1" class="brand" id="brand-link">
            ${UI_ICONS.logo}
            <span class="brand__name">Net<span>Trace</span></span>
          </a>
          <nav class="nav" aria-label="Primary">
            ${this.navButtonsHtml()}
          </nav>
          <div class="topbar__end">
            <button class="search" id="search-btn" type="button">
              ${UI_ICONS.search}
              <span class="search__hint">Search lessons &amp; concepts…</span>
              <kbd>Ctrl K</kbd>
            </button>
            <div id="theme-toggler-mount"></div>
            <div class="credit">
              <span class="credit__badge">NT</span>
              <span class="credit__text">
                <small>Computer Networks</small>
                <b><span>Interactive</span></b>
              </span>
            </div>
          </div>
        </header>

        <div class="drawer-backdrop" id="drawer-backdrop"></div>

        <main class="body" id="main-learn">
          <aside class="sidebar" id="sidebar">
            <div class="drawer-nav">${this.navButtonsHtml()}</div>
            <div class="tree-root">
              ${UI_ICONS.folderSolid}
              <span>Course</span>
              <span class="tree-root__meta">${totalLessonsCount()} lessons</span>
              <button class="drawer-close" id="drawer-close" aria-label="Close">${UI_ICONS.close}</button>
            </div>
            <div class="course" id="course-tree"></div>
            <div class="card progress" id="progress-box"></div>
          </aside>

          <section class="sheet">
            <div class="lesson-head" id="lesson-head"></div>
            <div class="card stage" id="stage-box">
              <div class="stage__hud" id="stage-hud"></div>
              <div class="stage__tools">
                <button class="tool tool--icon" id="btn-zoom-in" title="Zoom in (+)" aria-label="Zoom in">${UI_ICONS.zoomIn}</button>
                <button class="tool tool--icon" id="btn-zoom-out" title="Zoom out (-)" aria-label="Zoom out">${UI_ICONS.zoomOut}</button>
                <button class="tool" id="btn-fit" title="Reset zoom & pan (0)" hidden>Fit</button>
                <button class="tool" id="btn-replay" title="Replay step animation (R)">${UI_ICONS.replay} <span>Replay</span></button>
                <button class="tool" id="btn-pause" title="Pause / Resume packets (Space)">${UI_ICONS.pause} <span>Pause</span></button>
              </div>
              <div class="stage__canvas" id="stage-canvas"></div>
              <div class="stage__legend" id="stage-legend"></div>
            </div>
            <div class="card timeline" id="timeline-box"></div>
          </section>

          <aside class="rail">
            <div class="card guide" id="guide-card"></div>
            <div class="card goals" id="goals-card"></div>
          </aside>
        </main>

        <section class="subview" id="main-subview" hidden></section>
      </div>

      <!-- Search Command Palette -->
      <div class="sx" id="search-modal" hidden>
        <div class="sx__backdrop" id="sx-backdrop"></div>
        <div class="sx__dialog" role="dialog" aria-label="Search course">
          <div class="sx__bar">
            ${UI_ICONS.search}
            <input class="sx__input" id="sx-input" placeholder="Search OSI layers, TCP, HTTP, routers, switches…" autocomplete="off" />
            <button class="sx__esc" id="sx-close">ESC</button>
          </div>
          <div class="sx__list" id="sx-list"></div>
          <div class="sx__foot">
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> open</span>
            <span><kbd>Esc</kbd> close</span>
          </div>
        </div>
      </div>

      <div class="toast" id="toast">
        <span class="toast__icon">${UI_ICONS.check}</span>
        <span class="toast__text" id="toast-text">Lesson complete!</span>
      </div>
    `;

    this.stage = new IsoStage(document.getElementById('stage-canvas')!);
    this.renderSidebar();
    this.renderProgress();
    this.bindShellEvents();
  }

  private navButtonsHtml() {
    const items: { id: TabMode; label: string; icon: string }[] = [
      { id: 'learn', label: 'Learn', icon: UI_ICONS.book },
      { id: 'practice', label: 'Practice', icon: UI_ICONS.practice },
      { id: 'lab', label: 'Net Lab', icon: UI_ICONS.lab },
      { id: 'cheatsheets', label: 'Cheatsheets', icon: UI_ICONS.cheatsheet },
    ];
    return items
      .map(
        (it) => `
      <button class="nav__item ${this.tab === it.id ? 'is-active btn-pop' : ''}" data-tab="${it.id}">
        ${it.icon} <span>${it.label}</span>
      </button>`
      )
      .join('');
  }

  private switchTab(tab: TabMode) {
    const prevTab = this.tab;
    this.tab = tab;
    this.closeDrawer();
    document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((btn) => {
      const on = btn.dataset.tab === tab;
      btn.classList.toggle('is-active', on);
      btn.classList.toggle('btn-pop', on);
    });
    const learnEl = document.getElementById('main-learn')!;
    const subEl = document.getElementById('main-subview')!;
    if (tab === 'learn') {
      learnEl.hidden = false;
      learnEl.style.display = '';
      subEl.hidden = true;
      subEl.style.display = 'none';
      subEl.innerHTML = '';
      if (this.stage && !this.wasPausedBeforeTabSwitch && this.stage.isPaused()) {
        this.stage.setPaused(false);
      }
    } else {
      if (prevTab === 'learn' && this.stage) {
        this.wasPausedBeforeTabSwitch = this.stage.isPaused();
        if (!this.wasPausedBeforeTabSwitch) {
          this.stage.setPaused(true);
        }
      }
      learnEl.hidden = true;
      learnEl.style.display = 'none';
      subEl.hidden = false;
      subEl.style.display = '';
      if (tab === 'practice') renderPracticeView(subEl);
      else if (tab === 'lab') renderNetLabView(subEl);
      else renderCheatsheetsView(subEl);
    }
    this.updateHash();
  }

  private bindShellEvents() {
    // Nav tabs (both topbar & mobile drawer)
    this.root.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab as TabMode));
    });

    document.getElementById('brand-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchTab('learn');
      this.openLesson('ip-address-structure', 0, true);
    });

    // Mount Magic UI Animated Theme Toggler
    const mountEl = document.getElementById('theme-toggler-mount');
    if (mountEl) {
      createRoot(mountEl).render(
        <AnimatedThemeToggler variant="circle" duration={1000} />
      );
    }

    // Mobile drawer
    document.getElementById('menu-btn')?.addEventListener('click', () => {
      document.documentElement.classList.add('is-drawer');
    });
    document.getElementById('drawer-close')?.addEventListener('click', () => this.closeDrawer());
    document.getElementById('drawer-backdrop')?.addEventListener('click', () => this.closeDrawer());

    // Stage tools
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => this.stage?.zoomIn());
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => this.stage?.zoomOut());
    document.getElementById('btn-fit')?.addEventListener('click', () => this.stage?.resetView());
    document.getElementById('btn-replay')?.addEventListener('click', () => this.stage?.replay());
    document.getElementById('btn-pause')?.addEventListener('click', () => this.togglePause());

    // Search modal
    document.getElementById('search-btn')?.addEventListener('click', () => this.openSearch());
    document.getElementById('sx-backdrop')?.addEventListener('click', () => this.closeSearch());
    document.getElementById('sx-close')?.addEventListener('click', () => this.closeSearch());
    document.getElementById('sx-input')?.addEventListener('input', (e) => {
      this.renderSearchResults((e.target as HTMLInputElement).value);
    });
  }

  private bindGlobalEvents() {
    window.addEventListener('hashchange', () => {
      const oldTab = this.tab;
      this.readHash();
      if (this.tab !== oldTab) {
        this.switchTab(this.tab);
      } else if (this.tab === 'learn') {
        const h = location.hash.replace(/^#\/?/, '');
        const [lessonId, stepStr] = h.split('/');
        const s = Number(stepStr);
        const targetStep = Number.isFinite(s) && s >= 1 ? s - 1 : 0;
        if (lessonId && (lessonId !== this.currentLessonId || targetStep !== this.stepIdx)) {
          this.openLesson(lessonId, targetStep, false);
        }
      }
    });

    window.addEventListener('resize', () => {
      const w = innerWidth, h = innerHeight;
      document.documentElement.dataset.layout =
        w >= 1200 && h >= 560 ? 'desktop' : w >= 960 && h >= 600 ? 'tablet' : 'stack';
    });

    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('search-modal')!;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.hidden) this.openSearch();
        else this.closeSearch();
        return;
      }
      if (!modal.hidden) {
        if (e.key === 'Escape') this.closeSearch();
        return;
      }
      if (this.tab !== 'learn' || !this.currentLesson) return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.goToStep(this.stepIdx + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.goToStep(this.stepIdx - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        this.togglePause();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        this.stage?.replay();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        this.stage?.zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        this.stage?.zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        this.stage?.resetView();
      }
    });
  }

  private closeDrawer() {
    document.documentElement.classList.remove('is-drawer');
  }

  private togglePause() {
    if (!this.stage) return;
    const next = !this.stage.isPaused();
    this.stage.setPaused(next);
    const btn = document.getElementById('btn-pause')!;
    btn.classList.toggle('is-on', next);
    btn.innerHTML = next ? `${UI_ICONS.play} <span>Play</span>` : `${UI_ICONS.pause} <span>Pause</span>`;
  }

  private renderSidebar() {
    const tree = document.getElementById('course-tree')!;
    tree.innerHTML = SYLLABUS.map((mod) => {
      const isOpen = this.openModules.has(mod.id);
      const doneCount = mod.lessons.filter((l) => this.completed.has(l.id)).length;
      return `
        <div class="mod ${isOpen ? 'is-open' : ''}" data-mod="${mod.id}">
          <button class="mod__head" type="button">
            ${UI_ICONS.chev}
            ${UI_ICONS.folder(mod.tone)}
            <span class="mod__title">${mod.num}. ${mod.title}</span>
            <span class="mod__count">${doneCount}/${mod.lessons.length}</span>
          </button>
          <div class="mod__body">
            <div class="mod__clip">
              <ul class="mod__lessons">
                ${mod.lessons
                  .map((les) => {
                    const isCur = les.id === this.currentLessonId;
                    const isDone = this.completed.has(les.id);
                    if (!les.ready) {
                      return `<li class="lesson is-soon">
                        <span title="Coming soon">${UI_ICONS.doc}<span class="lesson__title">${les.title}</span></span>
                      </li>`;
                    }
                    return `<li class="lesson ${isCur ? 'is-current' : ''}">
                      <a href="#/${les.id}/1" class="${isCur ? 'btn-pop' : ''}" data-lesson="${les.id}">
                        ${isDone ? UI_ICONS.doneCircle : UI_ICONS.doc}
                        <span class="lesson__title">${les.title}</span>
                      </a>
                    </li>`;
                  })
                  .join('')}
              </ul>
            </div>
          </div>
        </div>`;
    }).join('');

    tree.querySelectorAll<HTMLButtonElement>('.mod__head').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modEl = btn.closest<HTMLElement>('.mod')!;
        const id = modEl.dataset.mod!;
        if (this.openModules.has(id)) this.openModules.delete(id);
        else this.openModules.add(id);
        modEl.classList.toggle('is-open');
      });
    });

    tree.querySelectorAll<HTMLAnchorElement>('[data-lesson]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeDrawer();
        this.openLesson(a.dataset.lesson!, 0, true);
      });
    });
  }

  private renderProgress() {
    const box = document.getElementById('progress-box')!;
    const total = totalLessonsCount();
    const done = this.completed.size;
    const pct = Math.round((done / total) * 100);

    box.className = `card progress ${this.progressOpen ? 'is-open' : ''}`;
    box.innerHTML = `
      <button class="progress__head" id="progress-toggle" type="button">
        <span class="eyebrow">PROGRESS</span>
        <span class="progress__pct">${done} / ${total}</span>
        ${UI_ICONS.chevRight}
      </button>
      <div class="progress__body">
        <div class="progress__clip">
          <div class="bar"><span style="width:${pct}%"></span></div>
          <ul class="progress__list">
            ${SYLLABUS.map((m) => {
              const d = m.lessons.filter((l) => this.completed.has(l.id)).length;
              const cls = d === m.lessons.length ? 'is-on' : d > 0 ? 'is-part' : '';
              return `<li>
                <span class="check ${cls}">${UI_ICONS.check}</span>
                <span>${m.num}. ${m.title}</span>
                <span class="progress__count">${d}/${m.lessons.length}</span>
              </li>`;
            }).join('')}
          </ul>
        </div>
      </div>`;

    box.querySelector('#progress-toggle')?.addEventListener('click', () => {
      this.progressOpen = !this.progressOpen;
      box.classList.toggle('is-open', this.progressOpen);
    });
  }

  private async openLesson(id: string, stepIndex = 0, stagger = false) {
    const lesson = await loadLesson(id);
    if (!lesson) return;
    this.currentLessonId = id;
    this.currentLesson = lesson;
    this.stepIdx = Math.max(0, Math.min(lesson.steps.length - 1, stepIndex));
    this.lastMetrics = {};
    this.openModules.add(lesson.moduleId);
    this.renderSidebar();
    this.renderLessonHeader();
    this.renderLegend();
    this.renderStep(stagger);
    if (this.tab !== 'learn') this.switchTab('learn');
    else this.updateHash();
  }

  private renderLessonHeader() {
    const lesson = this.currentLesson!;
    const info = findModuleForLesson(lesson.id);
    const head = document.getElementById('lesson-head')!;
    head.innerHTML = `
      <div class="crumb">${info ? `${info.mod.num}. ${info.mod.title} <span>/</span> Lesson ${info.index} of ${info.total}` : ''}</div>
      <div class="lesson-head__row">
        <h1 class="title">${lesson.title}</h1>
        <div class="tags">
          <span class="tag tag--sand">${UI_ICONS.clock} ${lesson.minutes} min</span>
          <span class="tag tag--mint">${UI_ICONS.signal} ${lesson.level}</span>
          <span class="tag tag--violet">${UI_ICONS.steps} ${lesson.steps.length} steps</span>
        </div>
      </div>
      <p class="subtitle">${lesson.summary}</p>`;
  }

  private renderLegend() {
    const lesson = this.currentLesson!;
    const leg = document.getElementById('stage-legend')!;
    leg.innerHTML = lesson.legend
      .map((it) => `<span><i class="lg lg--${it.kind}"></i>${it.label}</span>`)
      .join('');
  }

  private goToStep(next: number) {
    if (!this.currentLesson) return;
    if (next < 0 || next >= this.currentLesson.steps.length) return;
    this.stopSpeech();
    this.stepIdx = next;
    this.renderStep(true);
    this.updateHash();
  }

  private renderStep(stagger: boolean) {
    const lesson = this.currentLesson!;
    const step = lesson.steps[this.stepIdx];

    // Check lesson completion on final step
    if (this.stepIdx === lesson.steps.length - 1 && !this.completed.has(lesson.id)) {
      this.completed.add(lesson.id);
      this.saveProgress();
      this.renderSidebar();
      this.renderProgress();
      this.showToast(`Completed: ${lesson.title}`);
    }

    // 1. Render Stage
    this.stage?.render(step.scene, stagger);

    // 2. Render HUD chips with smooth numeric count-up
    const hud = document.getElementById('stage-hud')!;
    hud.innerHTML = lesson.metrics
      .map((m) => {
        const mv: MetricValue = step.metrics[m.id] || { value: '—', level: 'neutral' };
        const changed = this.lastMetrics[m.id] !== undefined && this.lastMetrics[m.id] !== mv.value;
        return `
          <div class="chip ${changed ? 'is-changed' : ''}" data-level="${mv.level || 'neutral'}" data-metric="${m.id}">
            <span class="chip__label">${m.label}</span>
            <span class="chip__value" data-val>${mv.value}${mv.suffix || ''}</span>
          </div>`;
      })
      .join('');

    // Animate numeric transitions
    for (const m of lesson.metrics) {
      const mv = step.metrics[m.id];
      const prev = this.lastMetrics[m.id];
      if (mv && typeof mv.value === 'number' && typeof prev === 'number' && prev !== mv.value) {
        const valEl = hud.querySelector(`[data-metric="${m.id}"] [data-val]`) as HTMLElement | null;
        if (valEl) this.animateNumber(valEl, prev, mv.value, mv.suffix || '');
      }
      if (mv) this.lastMetrics[m.id] = mv.value;
    }

    // 3. Render Timeline
    const tl = document.getElementById('timeline-box')!;
    const pct = lesson.steps.length > 1 ? (this.stepIdx / (lesson.steps.length - 1)) * 100 : 100;
    tl.innerHTML = `
      <div class="timeline__head">
        <span class="eyebrow">IN THIS LESSON</span>
        <span class="timeline__count">Step ${this.stepIdx + 1} of ${lesson.steps.length}</span>
      </div>
      <div class="timeline__track" style="--n:${lesson.steps.length}">
        <div class="timeline__rail"><span style="width:${pct}%"></span></div>
        <ol class="timeline__steps">
          ${lesson.steps
            .map(
              (s, i) => `
            <li class="${i < this.stepIdx ? 'is-done' : i === this.stepIdx ? 'is-current' : ''}">
              <button type="button" data-step="${i}">
                <span class="timeline__dot">${i + 1}</span>
                <span class="timeline__label">${s.short}</span>
              </button>
            </li>`
            )
            .join('')}
        </ol>
      </div>`;

    tl.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((btn) => {
      btn.addEventListener('click', () => this.goToStep(Number(btn.dataset.step)));
    });

    // 4. Render Right-Rail Guide Card
    const nextStep = lesson.steps[this.stepIdx + 1];
    const calloutIcon =
      step.callout?.kind === 'warn'
        ? UI_ICONS.warn
        : step.callout?.kind === 'insight'
          ? UI_ICONS.spark
          : UI_ICONS.bulb;

    const guide = document.getElementById('guide-card')!;
    guide.innerHTML = `
      <div class="guide__meta">
        <span class="eyebrow">STEP ${this.stepIdx + 1} / ${lesson.steps.length}</span>
        <div class="guide__meta-end">
          <button class="speak-btn ${this.speaking ? 'is-on' : ''}" id="btn-speak" title="Read step aloud">
            ${UI_ICONS.speaker}
          </button>
          <span class="chapter chapter--${step.chapter}">${step.chapter}</span>
        </div>
      </div>

      <div class="guide__content is-in">
        <h2 class="guide__title">${step.title}</h2>
        <div class="guide__body">
          ${step.body.map((p) => `<p>${p}</p>`).join('')}
        </div>

        ${
          step.callout
            ? `<div class="callout callout--${step.callout.kind}">
                <span class="callout__icon">${calloutIcon}</span>
                <div>
                  <div class="callout__title">${step.callout.title || step.callout.kind}</div>
                  <p>${step.callout.text}</p>
                </div>
              </div>`
            : ''
        }

        ${
          step.changes?.length
            ? `<div class="changes">
                <div class="eyebrow">WHAT CHANGED</div>
                <ul>
                  ${step.changes
                    .map((c) => {
                      const sym = c[0];
                      const cls = sym === '+' ? 'add' : sym === '-' ? 'del' : 'mod';
                      return `<li class="chg chg--${cls}"><b>${sym}</b><span>${c.slice(2)}</span></li>`;
                    })
                    .join('')}
                </ul>
              </div>`
            : ''
        }

        ${
          step.takeaways?.length
            ? `<ul class="takeaways" style="margin-top:12px;">
                ${step.takeaways.map((t) => `<li>${t}</li>`).join('')}
              </ul>`
            : ''
        }
      </div>

      <div class="guide__nav">
        <button class="btn-ghost" id="btn-back" ${this.stepIdx === 0 ? 'disabled' : ''}>
          ${UI_ICONS.arrowLeft} Back
        </button>
        <button class="btn-pop btn-next" id="btn-next">
          <span class="btn-next__label">${
            nextStep
              ? `Next: ${nextStep.short}`
              : this.currentLessonId === 'ip-address-structure'
                ? 'Next Lesson: The OSI Model'
                : this.currentLessonId === 'osi-7-layers'
                  ? 'Next Lesson: TCP Handshake'
                  : 'Take OSI Practice Quiz'
          }</span>
          ${UI_ICONS.arrowRight}
        </button>
      </div>
      <div class="guide__hint">
        <kbd>←</kbd> <kbd>→</kbd> step · <kbd>R</kbd> replay · <kbd>Space</kbd> pause
      </div>`;

    guide.querySelector('#btn-back')?.addEventListener('click', () => this.goToStep(this.stepIdx - 1));
    guide.querySelector('#btn-next')?.addEventListener('click', () => {
      if (nextStep) this.goToStep(this.stepIdx + 1);
      else if (this.currentLessonId === 'ip-address-structure') this.openLesson('osi-7-layers', 0, true);
      else if (this.currentLessonId === 'osi-7-layers') this.openLesson('tcp-handshake', 0, true);
      else this.switchTab('practice');
    });
    guide.querySelector('#btn-speak')?.addEventListener('click', () => this.toggleSpeech());

    // 5. Render Goals Card
    this.renderGoalsCard(lesson);
  }

  private renderGoalsCard(lesson: Lesson) {
    const goals = document.getElementById('goals-card');
    if (!goals) return;
    const hitCount = lesson.goals.filter((g) => this.stepIdx + 1 >= g.step).length;
    goals.className = `card goals ${this.goalsMinimized ? 'is-minimized' : ''}`;
    goals.innerHTML = `
      <div class="goals__head" id="goals-head" title="${this.goalsMinimized ? 'Click to expand YOU’LL LEARN' : 'Click to minimize'}">
        <div class="goals__title-wrap">
          <span class="eyebrow">YOU’LL LEARN</span>
          <span class="goals__badge">${hitCount}/${lesson.goals.length}</span>
        </div>
        <button class="goals__toggle" id="goals-toggle" type="button"
          aria-label="${this.goalsMinimized ? 'Expand YOU’LL LEARN' : 'Minimize YOU’LL LEARN'}"
          title="${this.goalsMinimized ? 'Expand YOU’LL LEARN' : 'Minimize YOU’LL LEARN (expand step downward)'}">
          ${this.goalsMinimized ? '+' : '−'}
        </button>
      </div>
      <ul>
        ${lesson.goals
          .map((g) => {
            const hit = this.stepIdx + 1 >= g.step;
            return `<li class="${hit ? 'is-hit' : ''}">
              <span class="check ${hit ? 'is-on' : ''}">${UI_ICONS.check}</span>
              <span>${g.text}</span>
            </li>`;
          })
          .join('')}
      </ul>`;

    goals.querySelector('#goals-toggle')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleGoalsMinimized();
    });
    goals.querySelector('#goals-head')?.addEventListener('click', () => {
      if (this.goalsMinimized) {
        this.toggleGoalsMinimized();
      }
    });
  }

  private animateNumber(el: HTMLElement, from: number, to: number, suffix: string) {
    const start = performance.now();
    const dur = 420;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = Math.round(from + (to - from) * eased);
      el.textContent = `${cur.toLocaleString()}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  private toggleSpeech() {
    if (!('speechSynthesis' in window) || !this.currentLesson) return;
    if (this.speaking) {
      this.stopSpeech();
      return;
    }
    const step = this.currentLesson.steps[this.stepIdx];
    const clean = [step.title, ...step.body, step.callout?.text || '']
      .join('. ')
      .replace(/<[^>]+>/g, '');
    const utt = new SpeechSynthesisUtterance(clean);
    utt.onend = () => {
      this.speaking = false;
      document.getElementById('btn-speak')?.classList.remove('is-on');
    };
    this.speaking = true;
    document.getElementById('btn-speak')?.classList.add('is-on');
    speechSynthesis.cancel();
    speechSynthesis.speak(utt);
  }

  private stopSpeech() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    this.speaking = false;
    document.getElementById('btn-speak')?.classList.remove('is-on');
  }

  private showToast(text: string) {
    const t = document.getElementById('toast')!;
    const txt = document.getElementById('toast-text')!;
    txt.textContent = text;
    t.classList.add('is-on');
    setTimeout(() => t.classList.remove('is-on'), 2800);
  }

  private openSearch() {
    const modal = document.getElementById('search-modal')!;
    const input = document.getElementById('sx-input') as HTMLInputElement;
    modal.hidden = false;
    input.value = '';
    this.renderSearchResults('');
    setTimeout(() => input.focus(), 10);
  }

  private closeSearch() {
    document.getElementById('search-modal')!.hidden = true;
  }

  private renderSearchResults(query: string) {
    const q = query.trim().toLowerCase();
    const list = document.getElementById('sx-list')!;
    const results: { type: string; title: string; sub: string; action: () => void; badge: string }[] = [];

    // Search lessons in syllabus
    for (const mod of SYLLABUS) {
      for (const les of mod.lessons) {
        if (!q || les.title.toLowerCase().includes(q) || les.summary.toLowerCase().includes(q)) {
          results.push({
            type: 'Lesson',
            title: les.title,
            sub: les.summary,
            badge: les.ready ? `${mod.num}. ${mod.title}` : 'SOON',
            action: () => {
              if (les.ready) {
                this.closeSearch();
                this.openLesson(les.id, 0, true);
              }
            },
          });
        }
      }
    }

    // Search current lesson steps
    if (this.currentLesson) {
      this.currentLesson.steps.forEach((s, i) => {
        const hay = `${s.short} ${s.title} ${s.body.join(' ')}`.toLowerCase();
        if (!q || hay.includes(q)) {
          results.push({
            type: `Step ${i + 1}`,
            title: s.title,
            sub: `${this.currentLesson!.title} — ${s.short}`,
            badge: s.chapter.toUpperCase(),
            action: () => {
              this.closeSearch();
              this.switchTab('learn');
              this.goToStep(i);
            },
          });
        }
      });
    }

    // Search available color themes
    for (const t of THEMES) {
      if (q && (t.name.toLowerCase().includes(q) || t.badge.toLowerCase().includes(q) || 'theme themes color mode'.includes(q))) {
        results.push({
          type: 'Theme',
          title: `Theme: ${t.name}`,
          sub: `Switch color scheme to ${t.name} (${t.badge})`,
          badge: 'THEME',
          action: () => {
            this.closeSearch();
            document.documentElement.dataset.theme = t.id;
            document.documentElement.classList.toggle('dark', t.isDarkVariant);
            localStorage.setItem('theme', t.id);
            try { localStorage.setItem('nettrace:theme', JSON.stringify(t.id)); } catch {}
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', t.themeColor);
          },
        });
      }
    }

    const shown = results.slice(0, 14);
    list.innerHTML = shown.length
      ? `<div class="sx__group">Results (${shown.length})</div>` +
        shown
          .map(
            (r, idx) => `
          <button class="sx__item ${idx === 0 ? 'is-sel' : ''}" data-sx="${idx}" type="button">
            <span class="sx__icon">${r.type === 'Lesson' ? 'L' : r.type.replace('Step ', '')}</span>
            <div>
              <div class="sx__title">${r.title}</div>
              <div class="sx__text">${r.sub}</div>
            </div>
            <span class="sx__badge">${r.badge}</span>
          </button>`
          )
          .join('')
      : `<div style="padding:36px;text-align:center;color:var(--muted);">No matches for "${query}". Try <b>OSI</b>, <b>HTTP</b>, <b>TCP</b>, or <b>Router</b>.</div>`;

    list.querySelectorAll<HTMLButtonElement>('[data-sx]').forEach((btn) => {
      btn.addEventListener('click', () => shown[Number(btn.dataset.sx)].action());
    });
  }
}

new NetTraceApp(document.getElementById('app')!);
