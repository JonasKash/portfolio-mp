<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const skills = [
    'SAAS',
    'EDIÇÃO DE VÍDEO',
    'DESIGN',
    'WEBDESIGN'
  ];

  // Duplicar para loop contínuo sem gap
  const repeated = [...skills, ...skills, ...skills];

  let section;
  let prefersReduced = false;

  onMount(() => {
    prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Revelar ao entrar na viewport
    gsap.from(section, {
      opacity: 0,
      scrollTrigger: {
        trigger: section,
        start: 'top 90%',
        end: 'top 60%',
        scrub: true
      }
    });
  });
</script>

<div bind:this={section} class="marquee-section" aria-label="Habilidades: {skills.join(', ')}">
  <!-- Linha superior (direita → esquerda) -->
  <div class="marquee-row">
    <div class="marquee-track track-rtl" class:paused={prefersReduced}>
      {#each repeated as skill, i}
        <span class="marquee-item" class:dim={i % 3 !== 0}>{skill}</span>
        <span class="sep" aria-hidden="true">✦</span>
      {/each}
    </div>
  </div>

  <!-- Linha inferior (esquerda → direita) -->
  <div class="marquee-row row-reverse">
    <div class="marquee-track track-ltr" class:paused={prefersReduced}>
      {#each repeated.slice().reverse() as skill, i}
        <span class="marquee-item" class:dim={i % 3 === 0}>{skill}</span>
        <span class="sep" aria-hidden="true">✦</span>
      {/each}
    </div>
  </div>
</div>

<style>
  .marquee-section {
    overflow: hidden;
    padding: 48px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--bg-2);
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .marquee-row {
    overflow: hidden;
    padding: 16px 0;
  }

  .marquee-track {
    display: flex;
    gap: 0;
    align-items: baseline;
    white-space: nowrap;
    will-change: transform;
  }

  /* Direita → esquerda */
  .track-rtl {
    animation: marqueeRTL 30s linear infinite;
  }

  /* Esquerda → direita */
  .track-ltr {
    animation: marqueeLTR 35s linear infinite;
  }

  .marquee-track.paused {
    animation-play-state: paused;
  }

  .marquee-row:hover .marquee-track {
    animation-play-state: paused;
  }

  .marquee-item {
    display: inline-block;
    font-family: var(--font-display);
    font-size: clamp(28px, 4vw, 60px);
    letter-spacing: 0.04em;
    padding: 0 32px;
    color: var(--text-primary);
    transition: color 0.3s;
  }

  .marquee-item.dim {
    color: var(--text-muted);
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.08);
    color: transparent;
  }

  .marquee-item:hover {
    color: var(--accent) !important;
    -webkit-text-stroke: 0;
  }

  .sep {
    color: rgba(79, 195, 247, 0.25);
    font-size: clamp(16px, 2vw, 24px);
    display: inline-block;
    align-self: center;
  }

  @keyframes marqueeRTL {
    from { transform: translateX(0); }
    to   { transform: translateX(-33.333%); }
  }

  @keyframes marqueeLTR {
    from { transform: translateX(-33.333%); }
    to   { transform: translateX(0); }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .marquee-track {
      animation: none !important;
    }
  }
</style>
