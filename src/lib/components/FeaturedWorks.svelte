<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { projects } from '$lib/projects.js';

  gsap.registerPlugin(ScrollTrigger);

  const dispatch = createEventDispatcher();

  let section;
  let track;

  onMount(() => {
    animateHeader();
    animateDecorativeText();
  });

  function animateHeader() {
    gsap.from('.works-label', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    gsap.from('.works-title', {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  function animateDecorativeText() {
    gsap.from('.work-bg-text span', {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%'
      }
    });
  }
</script>

<section bind:this={section} id="work" class="works-section">
  <!-- Texto decorativo lateral -->
  <div class="work-bg-text" aria-hidden="true">
    <span>W</span>
    <span>R</span>
    <span>K</span>
  </div>

  <!-- Header da seção -->
  <div class="works-header">
    <p class="works-label">02 - TRABALHOS PRONTOS</p>
    <h2 class="works-title">
      Projetos<br />
      <span class="works-title-outline">Selecionados</span>
    </h2>
  </div>

  <!-- Track de cards (scroll horizontal) -->
  <div bind:this={track} class="projects-track">
    {#each projects as project, i}
      <article
        class="project-card"
        style="--card-accent: {project.accent}; --card-index: {i}"
        data-cursor
      >
        <!-- Imagem -->
        <div class="card-image">
          {#if project.video}
            <div class="card-video">
              <video 
                src={project.video} 
                autoplay 
                muted 
                loop 
                playsinline
                class="card-vid-el"
              ></video>
            </div>
          {:else if project.image}
            <div class="card-img" style="background-image: url('{project.image}')"></div>
          {:else}
            <div class="card-img-placeholder" style="background: linear-gradient(135deg, {project.accent}22 0%, #080a0e 100%)">
              <span class="placeholder-num">{String(i + 1).padStart(2, '0')}</span>
            </div>
          {/if}
        </div>

        <!-- Informações sempre visíveis -->
        <div class="card-info">
          <div class="card-meta">
            <span class="card-year">{project.year}</span>
            <span class="card-category">{project.category}</span>
          </div>
          <h3 class="card-title">{project.title}</h3>
          <div class="card-tags">
            {#each project.tags as tag}
              <span class="card-tag">{tag}</span>
            {/each}
          </div>
        </div>

        <!-- Hover overlay -->
        <div class="card-overlay">
          <p class="overlay-desc">{project.description}</p>
          <button class="view-btn" on:click={() => dispatch('openCaseStudy', project)}>
            Ver Case Study
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Número de índice decorativo -->
        <span class="card-index-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      </article>
    {/each}

    <!-- Card de CTA final -->
    <div class="cta-card">
      <p class="cta-label">MAIS PROJETOS</p>
      <a href="#contact" class="cta-link" data-cursor>
        <span>Ver todos →</span>
      </a>
    </div>
  </div>
</section>

<style>
  /* ── Layout da seção ── */
  .works-section {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background: var(--bg);
    padding-top: 120px;
  }

  /* ── Texto decorativo lateral ── */
  .work-bg-text {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    font-family: var(--font-display);
    font-size: clamp(60px, 12vw, 200px);
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.04);
    line-height: 0.88;
    padding-left: 12px;
    pointer-events: none;
    user-select: none;
    z-index: 0;
  }

  /* ── Header ── */
  .works-header {
    padding: 0 var(--container-pad) 40px;
    position: relative;
    z-index: 2;
  }

  .works-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.25em;
    color: var(--accent);
    margin-bottom: 16px;
  }

  .works-title {
    font-family: var(--font-display);
    font-size: clamp(40px, 6vw, 80px);
    letter-spacing: 0.02em;
    line-height: 0.92;
  }

  .works-title-outline {
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
    color: transparent;
  }

  /* ── Track horizontal ── */
  .projects-track {
    display: flex;
    gap: 20px;
    padding: 0 var(--container-pad) 80px;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    align-items: flex-start;
    position: relative;
    z-index: 2;
    scrollbar-width: none; /* Firefox */
  }

  .projects-track::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  /* ── Cards de projeto ── */
  .project-card {
    position: relative;
    width: clamp(300px, 85vw, 580px);
    flex-shrink: 0;
    scroll-snap-align: start;
    border: 1px solid var(--border);
    overflow: hidden;
    cursor: none;
    background: var(--bg-2);
    transition: border-color 0.4s ease;
  }

  .project-card:hover {
    border-color: var(--card-accent);
  }

  /* Imagem / placeholder */
  .card-image {
    width: 100%;
    height: 300px;
    overflow: hidden;
  }

  .card-img-placeholder,
  .card-img {
    width: 100%;
    height: 100%;
    transition: transform 0.6s ease;
  }

  .card-img-placeholder {
    display: grid;
    place-items: center;
  }

  .card-img {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .card-video {
    width: 100%;
    height: 100%;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-vid-el {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .project-card:hover .card-img-placeholder,
  .project-card:hover .card-img {
    transform: scale(1.04);
  }

  .placeholder-num {
    font-family: var(--font-display);
    font-size: 120px;
    color: rgba(255, 255, 255, 0.04);
    line-height: 1;
  }

  /* Informações */
  .card-info {
    padding: 24px 28px;
  }

  .card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .card-year {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.1em;
  }

  .card-category {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.15em;
    color: var(--card-accent);
  }

  .card-title {
    font-family: var(--font-display);
    font-size: clamp(28px, 3.5vw, 48px);
    letter-spacing: 0.03em;
    line-height: 1;
    margin-bottom: 16px;
    transition: color 0.3s;
  }

  .project-card:hover .card-title {
    color: var(--card-accent);
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .card-tag {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.15em;
    color: var(--text-muted);
    padding: 4px 10px;
    border: 1px solid var(--border);
  }

  /* Número de índice decorativo */
  .card-index-num {
    position: absolute;
    top: 16px;
    right: 20px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.1em;
    z-index: 3;
  }

  /* Hover overlay */
  .card-overlay {
    position: absolute;
    inset: 0;
    background: rgba(8, 10, 14, 0.88);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 32px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease;
  }

  .project-card:hover .card-overlay {
    opacity: 1;
    pointer-events: all;
  }

  .overlay-desc {
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-secondary);
    text-align: center;
    max-width: 320px;
  }

  .view-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 28px;
    border: 1px solid var(--card-accent);
    color: var(--card-accent);
    background: transparent;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.15em;
    cursor: none;
    transition: background 0.3s, color 0.3s;
  }

  .view-btn:hover {
    background: var(--card-accent);
    color: #000;
  }

  /* CTA final */
  .cta-card {
    width: 280px;
    height: 400px;
    flex-shrink: 0;
    scroll-snap-align: start;
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 32px;
    background: var(--surface);
    align-self: center;
  }

  .cta-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.25em;
    color: var(--text-muted);
  }

  .cta-link {
    font-family: var(--font-display);
    font-size: clamp(28px, 3vw, 48px);
    color: var(--accent);
    text-decoration: none;
    transition: opacity 0.3s;
  }

  .cta-link:hover {
    opacity: 0.7;
  }
</style>
