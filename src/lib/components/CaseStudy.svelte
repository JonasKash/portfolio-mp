<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { projects } from '$lib/projects.js';

  export let project;

  const dispatch = createEventDispatcher();
  let container;

  $: idx = projects.findIndex(p => p.id === project.id);
  $: next = projects[(idx + 1) % projects.length];

  onMount(() => {
    window.scrollTo(0, 0);
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.timeline({ delay: 0.15 })
      .from('.cs-cat', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' })
      .from('.cs-h1', { yPercent: 110, duration: 0.85, ease: 'power3.out' }, '-=0.2')
      .from('.cs-meta-col', { opacity: 0, y: 16, stagger: 0.12, duration: 0.5 }, '-=0.45')
      .from('.cs-back', { opacity: 0, x: -12, duration: 0.4 }, 0.1);

    // Scroll reveals
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 44, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' }
      });
    });

    // Stagger grids
    gsap.utils.toArray('.stagger').forEach(group => {
      gsap.from(group.children, {
        opacity: 0, y: 32, stagger: 0.1, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 82%', toggleActions: 'play none none none' }
      });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  });

  function close() {
    gsap.to(container, {
      opacity: 0, y: -16, duration: 0.3, ease: 'power2.in',
      onComplete: () => dispatch('close')
    });
  }

  function goNext() { dispatch('openProject', next); }
</script>

<div bind:this={container} class="cs">

  <!-- NAV -->
  <nav class="cs-nav">
    <button class="cs-back" on:click={close} aria-label="Voltar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
      VOLTAR
    </button>
    <span class="cs-nav-logo">Agência MP</span>
  </nav>

  <!-- ══ HERO ══ -->
  <section class="cs-hero" style="--a: {project.accent}">
    <div class="cs-hero-bg" style="background: linear-gradient(150deg, {project.accent}44 0%, #080a0e 55%)">
      {#if project.image}
        <img src={project.image} alt="" class="cs-hero-img" />
      {/if}
    </div>

    <div class="cs-hero-body">
      <p class="cs-cat">{project.category} — {project.year}</p>
      <div class="cs-h1-wrap">
        <h1 class="cs-h1">{project.title}</h1>
      </div>
    </div>

    <div class="cs-meta-row">
      <div class="cs-meta-col">
        <span class="cs-meta-l">CLIENTE</span>
        <span class="cs-meta-v">{project.client}</span>
      </div>
      <div class="cs-meta-sep" aria-hidden="true"></div>
      <div class="cs-meta-col">
        <span class="cs-meta-l">SETOR</span>
        <span class="cs-meta-v">{project.sector}</span>
      </div>
      <div class="cs-meta-sep" aria-hidden="true"></div>
      <div class="cs-meta-col">
        <span class="cs-meta-l">FUNÇÃO</span>
        <span class="cs-meta-v">{project.role}</span>
      </div>
    </div>
  </section>

  <!-- ══ HEADLINE / OVERVIEW ══ -->
  <section class="cs-section cs-quote-section">
    <div class="wrap">
      <p class="cs-label reveal">VISÃO GERAL</p>
      <h2 class="cs-headline reveal">"{project.headline}"</h2>
      <p class="cs-overview reveal">{project.overview}</p>
    </div>
  </section>

  <!-- ══ 3 SCREENSHOTS ══ -->
  <div class="cs-shots stagger">
    {#each [1, 2, 3] as n}
      <div class="cs-shot" style="--a: {project.accent}">
        {#if project.shots && project.shots[n - 1]}
          {#if project.shots[n - 1].match(/\.(mp4|webm|ogg)$/i)}
            <video src={project.shots[n - 1]} autoplay muted loop playsinline class="cs-shot-vid"></video>
          {:else}
            <img src={project.shots[n - 1]} alt="Preview {n}" />
          {/if}
        {:else if project.image && n === 1}
          <img src={project.image} alt="Preview {project.title}" />
        {:else}
          <div class="cs-shot-placeholder">
            <span>{project.title.split(' ')[0]}</span>
            <small>0{n}</small>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- ══ 01 — ASSUMPTIONS ══ -->
  <section class="cs-section">
    <div class="wrap">
      <p class="cs-label reveal">01 — MAPEAMENTO DE PREMISSAS</p>
      <h3 class="cs-sh reveal">Desejável, Viável & Realizável</h3>
      <div class="cs-assumptions stagger">
        {#each project.assumptions as col}
          <div class="cs-assum-col">
            <p class="cs-assum-title" style="color: {project.accent}">{col.label}</p>
            <ul class="cs-assum-list">
              {#each col.items as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ══ 02 — DESIGN PRINCIPLES ══ -->
  <section class="cs-section cs-dark-section">
    <div class="wrap">
      <p class="cs-label reveal">02 — PRINCÍPIOS DE DESIGN</p>
      <div class="cs-principles">
        {#each project.principles as name, i}
          <div class="cs-principle" style="--a: {project.accent}">
            <span class="cs-p-num">0{i + 1}</span>
            <div class="cs-p-line"></div>
            <h3 class="cs-p-name">{name}</h3>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ══ 03 — USER FLOW ══ -->
  <section class="cs-section">
    <div class="wrap">
      <p class="cs-label reveal">03 — FLUXO DO USUÁRIO</p>
      <h3 class="cs-sh reveal">Jornada & Integração</h3>
      <div class="cs-flow reveal" style="--a: {project.accent}">
        <div class="cs-flow-nodes stagger">
          {#each ['Descoberta', 'Análise', 'Decisão', 'Conversão', 'Retenção'] as step, i}
            <div class="cs-flow-node">
              <div class="cs-flow-dot" style="background: {project.accent}"></div>
              <span>{step}</span>
              {#if i < 4}<div class="cs-flow-line"></div>{/if}
            </div>
          {/each}
        </div>
        <p class="cs-flow-text">{project.flowText}</p>
      </div>
    </div>
  </section>

  <!-- ══ 04 — WIREFRAMES ══ -->
  <section class="cs-section">
    <div class="wrap">
      <p class="cs-label reveal">04 — TELAS & WIREFRAMES</p>
      <h3 class="cs-sh reveal">Estrutura Visual</h3>
      <div class="cs-wireframes stagger">
        {#each ['Tela Principal', 'Detalhe', 'Conversão'] as label, i}
          <div class="cs-wf" style="--a: {project.accent}">
            <div class="cs-wf-inner">
              <span class="cs-wf-num">0{i + 1}</span>
              <span class="cs-wf-label">{label}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ══ NEXT PROJECT ══ -->
  <section class="cs-next-section">
    <div class="wrap">
      <p class="cs-label reveal">PRÓXIMO PROJETO</p>
      <button class="cs-next-btn reveal" on:click={goNext} style="--na: {next.accent}">
        <div class="cs-next-info">
          <span class="cs-next-cat">{next.category}</span>
          <h2 class="cs-next-title">{next.title}</h2>
        </div>
        <div class="cs-next-arrow">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </button>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="cs-footer">
    <div class="wrap">
      <button class="cs-footer-back" on:click={close}>← Voltar ao Portfólio</button>
      <p class="cs-footer-copy">© 2025 Agência MP</p>
    </div>
  </footer>

</div>

<style>
  /* ── Base ── */
  .cs { background: var(--bg); min-height: 100vh; }

  .wrap {
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 var(--container-pad);
  }

  /* ── Nav ── */
  .cs-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px var(--container-pad);
    background: rgba(8, 10, 14, 0.7);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }

  .cs-back {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.2em;
    color: var(--text-secondary);
    background: none;
    border: 1px solid var(--border);
    padding: 8px 16px;
    cursor: none;
    transition: color 0.3s, border-color 0.3s;
  }
  .cs-back:hover { color: var(--text-primary); border-color: rgba(255,255,255,0.2); }

  .cs-nav-logo {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.15em;
    color: var(--text-muted);
  }

  /* ── HERO ── */
  .cs-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;
  }

  .cs-hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .cs-hero-img {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.25;
    filter: blur(1px);
  }

  .cs-hero-body {
    position: relative;
    z-index: 2;
    padding: 0 var(--container-pad) 40px;
  }

  .cs-cat {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.25em;
    color: var(--a, var(--accent));
    margin-bottom: 20px;
    opacity: 0.9;
  }

  .cs-h1-wrap { overflow: hidden; }

  .cs-h1 {
    font-family: var(--font-display);
    font-size: clamp(72px, 12vw, 180px);
    line-height: 0.88;
    letter-spacing: 0.02em;
    color: var(--text-primary);
    display: block;
  }

  /* Meta row */
  .cs-meta-row {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: stretch;
    border-top: 1px solid var(--border);
    padding: 28px var(--container-pad);
  }

  .cs-meta-sep {
    width: 1px;
    background: var(--border);
    margin: 0 40px;
    flex-shrink: 0;
  }

  .cs-meta-col {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .cs-meta-l {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.3em;
    color: var(--text-muted);
  }

  .cs-meta-v {
    font-size: 16px;
    color: var(--text-primary);
    font-weight: 300;
  }

  /* ── Sections ── */
  .cs-section { padding: clamp(80px, 10vw, 130px) 0; }

  .cs-dark-section { background: var(--bg-2); }

  .cs-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.25em;
    color: var(--accent);
    margin-bottom: 28px;
  }

  .cs-sh {
    font-family: var(--font-display);
    font-size: clamp(36px, 4vw, 60px);
    letter-spacing: 0.02em;
    line-height: 1;
    margin-bottom: 48px;
    color: var(--text-primary);
  }

  /* ── Quote / Headline ── */
  .cs-quote-section { padding: clamp(80px, 10vw, 130px) 0; }

  .cs-headline {
    font-family: var(--font-display);
    font-size: clamp(44px, 6vw, 88px);
    line-height: 0.95;
    letter-spacing: 0.02em;
    color: var(--text-primary);
    margin-bottom: 40px;
  }

  .cs-overview {
    font-size: 17px;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 680px;
  }

  /* ── Screenshots ── */
  .cs-shots {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    background: var(--border);
  }

  .cs-shot {
    height: auto;
    aspect-ratio: 9 / 14;
    overflow: hidden;
    background: var(--bg-2);
    position: relative;
  }

  .cs-shot-vid,
  .cs-shot img {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center top;
    opacity: 0.9;
    transition: transform 0.6s ease;
  }
  .cs-shot:hover .cs-shot-vid,
  .cs-shot:hover img { transform: scale(1.04); }

  .cs-shot-placeholder {
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(135deg, var(--a, #4fc3f7)18 0%, transparent 70%);
  }

  .cs-shot-placeholder span {
    font-family: var(--font-display);
    font-size: clamp(32px, 5vw, 72px);
    color: rgba(255,255,255,0.06);
    letter-spacing: 0.1em;
  }

  .cs-shot-placeholder small {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.3em;
    color: var(--text-muted);
  }

  /* ── Assumptions ── */
  .cs-assumptions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
  }

  .cs-assum-col {
    background: var(--bg-2);
    padding: 40px 32px;
  }

  .cs-assum-title {
    font-family: var(--font-display);
    font-size: 24px;
    letter-spacing: 0.03em;
    margin-bottom: 24px;
  }

  .cs-assum-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cs-assum-list li {
    font-size: 14px;
    line-height: 1.55;
    color: var(--text-secondary);
    padding-left: 16px;
    position: relative;
  }

  .cs-assum-list li::before {
    content: '—';
    position: absolute;
    left: 0;
    color: var(--text-muted);
    font-size: 11px;
  }

  /* ── Principles ── */
  .cs-principles {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
  }

  .cs-principle {
    background: var(--bg-2);
    padding: 52px 28px 44px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    overflow: hidden;
    transition: background 0.35s ease;
  }

  /* Accent bar slides in from left on hover */
  .cs-principle::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--a);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .cs-principle:hover::before { transform: scaleX(1); }
  .cs-principle:hover { background: rgba(255, 255, 255, 0.025); }

  .cs-p-num {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.22em;
    color: var(--text-muted);
    display: block;
    margin-bottom: 40px;
  }

  /* Short line expands to full width on hover */
  .cs-p-line {
    width: 20px;
    height: 1px;
    background: var(--a);
    margin-bottom: 18px;
    transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .cs-principle:hover .cs-p-line { width: 100%; }

  .cs-p-name {
    font-family: var(--font-display);
    font-size: clamp(18px, 1.9vw, 26px);
    letter-spacing: 0.05em;
    color: var(--text-primary);
    line-height: 1.1;
    font-weight: normal;
  }

  /* ── Flow ── */
  .cs-flow {
    border: 1px solid var(--border);
    padding: 48px;
    background: var(--bg-2);
  }

  .cs-flow-nodes {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 0;
  }

  .cs-flow-node {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .cs-flow-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .cs-flow-node span {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .cs-flow-line {
    flex: 1;
    height: 1px;
    background: var(--border);
    margin: 0 8px;
  }

  .cs-flow-text {
    font-size: 15px;
    line-height: 1.75;
    color: var(--text-secondary);
  }

  /* ── Wireframes ── */
  .cs-wireframes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .cs-wf {
    height: 340px;
    border: 1px solid var(--border);
    background: var(--bg-2);
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .cs-wf:hover { border-color: var(--a, var(--accent)); }

  .cs-wf-inner {
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: linear-gradient(135deg, var(--a, #4fc3f7)0a 0%, transparent 60%);
  }

  .cs-wf-num {
    font-family: var(--font-display);
    font-size: 80px;
    color: rgba(255,255,255,0.04);
    line-height: 1;
  }

  .cs-wf-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.25em;
    color: var(--text-muted);
  }

  /* ── Next project ── */
  .cs-next-section {
    padding: clamp(80px, 10vw, 130px) 0;
    border-top: 1px solid var(--border);
  }

  .cs-next-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 52px 48px;
    border: 1px solid var(--border);
    background: var(--bg-2);
    cursor: none;
    text-align: left;
    transition: border-color 0.4s, background 0.4s;
    margin-top: 8px;
  }
  .cs-next-btn:hover { border-color: var(--na, var(--accent)); background: var(--surface); }
  .cs-next-btn:hover .cs-next-arrow { transform: translateX(12px); }

  .cs-next-info { display: flex; flex-direction: column; gap: 8px; }

  .cs-next-cat {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--na, var(--accent));
  }

  .cs-next-title {
    font-family: var(--font-display);
    font-size: clamp(44px, 6vw, 88px);
    line-height: 0.9;
    letter-spacing: 0.02em;
    color: var(--text-primary);
  }

  .cs-next-arrow {
    color: var(--na, var(--accent));
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  /* ── Footer ── */
  .cs-footer {
    border-top: 1px solid var(--border);
    padding: 32px 0;
  }

  .cs-footer .wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cs-footer-back {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.15em;
    color: var(--text-secondary);
    background: none;
    border: none;
    cursor: none;
    transition: color 0.3s;
  }
  .cs-footer-back:hover { color: var(--accent); }

  .cs-footer-copy {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--text-muted);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .cs-principles { grid-template-columns: repeat(3, 1fr); }
    .cs-principle { padding: 40px 20px 36px; }
    .cs-assumptions { grid-template-columns: 1fr; }
    .cs-wireframes { grid-template-columns: repeat(2, 1fr); }
    .cs-meta-row { flex-direction: column; gap: 20px; }
    .cs-meta-sep { display: none; }
    .cs-flow-nodes { gap: 16px; flex-direction: column; align-items: flex-start; }
    .cs-flow-line { display: none; }
    .cs-next-btn { padding: 36px 28px; }
  }

  @media (max-width: 600px) {
    .cs-shots { grid-template-columns: 1fr; }
    .cs-principles { grid-template-columns: repeat(2, 1fr); }
    .cs-principle { padding: 36px 20px 32px; }
    .cs-p-num { margin-bottom: 28px; }
    .cs-wireframes { grid-template-columns: 1fr; }
    .cs-h1 { font-size: clamp(56px, 16vw, 80px); }
    .cs-next-title { font-size: clamp(36px, 10vw, 56px); }
    .cs-flow { padding: 28px 20px; }
  }
</style>
