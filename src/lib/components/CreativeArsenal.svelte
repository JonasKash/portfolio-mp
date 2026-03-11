<script>
  import { onMount, tick } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  let section;
  
  // Lista de criativos (começando com o Lair Ribeiro e 5 placeholders tipo "Wireframe")
  const creatives = [
    { id: 1, num: '01', label: 'Estratégia · Lair Ribeiro', video: '/images/Lair Ribeiro.mp4', accent: '#4fc3f7' },
    { id: 2, num: '02', label: 'Criatividade', accent: '#9c6cff' },
    { id: 3, num: '03', label: 'Conversão', accent: '#ff6b35' },
    { id: 4, num: '04', label: 'Impacto', accent: '#ff4d6d' },
    { id: 5, num: '05', label: 'Performance', accent: '#ffd54f' },
    { id: 6, num: '06', label: 'Escala', accent: '#81d4fa' }
  ];

  onMount(() => {
    // Animação de entrada da seção
    gsap.from('.ca-label', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    gsap.from('.ca-sh', {
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

    // Stagger cards
    gsap.from('.cs-wf', {
      opacity: 0,
      y: 32,
      stagger: 0.1,
      duration: 0.65,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cs-wireframes',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Função para dar play no hover (performance)
  function handleMouseEnter(e) {
    const video = e.currentTarget.querySelector('video');
    if (video) video.play();
  }

  function handleMouseLeave(e) {
    const video = e.currentTarget.querySelector('video');
    if (video) {
        video.pause();
        // Opcional: video.currentTime = 0;
    }
  }
</script>

<section bind:this={section} id="arsenal" class="cs-section ca-section">
  <div class="wrap">
    <p class="ca-label">03 — ARSENAL DE CRIATIVOS</p>
    <h3 class="ca-sh">Resultados de Performance</h3>
    
    <div class="cs-wireframes stagger">
      {#each creatives as item, i}
        <div 
          class="cs-wf {item.video ? 'has-video' : ''}" 
          style="--a: {item.accent}"
          on:mouseenter={handleMouseEnter}
          on:mouseleave={handleMouseLeave}
        >
          <div class="cs-wf-inner">
            {#if item.video}
              <div class="video-container">
                <video 
                  src={item.video} 
                  muted 
                  loop 
                  playsinline 
                  preload="metadata"
                  class="ca-video"
                ></video>
                <div class="video-overlay">
                   <span class="cs-wf-num">{item.num}</span>
                   <span class="cs-wf-label">{item.label}</span>
                </div>
              </div>
            {:else}
              <span class="cs-wf-num">{item.num}</span>
              <span class="cs-wf-label">{item.label}</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .ca-section { padding: clamp(80px, 10vw, 130px) 0; background: var(--bg); }
  
  .ca-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.25em;
    color: var(--accent);
    margin-bottom: 28px;
  }

  .ca-sh {
    font-family: var(--font-display);
    font-size: clamp(36px, 4vw, 60px);
    letter-spacing: 0.02em;
    line-height: 1;
    margin-bottom: 48px;
    color: var(--text-primary);
  }

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
    transition: border-color 0.3s, transform 0.3s;
    position: relative;
  }
  
  /* Ajuste dinâmico para o vídeo Lair Ribeiro (se for o primeiro e tiver vídeo) */
  .cs-wf.has-video {
    height: auto;
    aspect-ratio: 9 / 16; /* Formato vertical comum em criativos */
  }

  .cs-wf:hover { border-color: var(--a, var(--accent)); transform: translateY(-4px); }

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
    text-align: center;
    padding: 0 10px;
  }

  /* Estilos do Vídeo */
  .video-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ca-video {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ajustado para preencher mantendo proporção */
  }

  .video-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: rgba(8, 10, 14, 0.4);
    transition: opacity 0.3s;
  }

  .cs-wf:hover .video-overlay {
    opacity: 0;
  }

  /* ══ Responsive ══ */
  @media (max-width: 900px) {
    .cs-wireframes { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 600px) {
    .cs-wireframes { grid-template-columns: 1fr; }
    .cs-wf { height: 300px; }
    .cs-wf.has-video { height: auto; }
  }
</style>
