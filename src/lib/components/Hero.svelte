<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { SplitText } from 'gsap/SplitText';

  gsap.registerPlugin(ScrollTrigger);

  let canvas;
  let container;
  let isMobile = false;
  let renderer;
  let rafId;
  let resizeObserver;

  // Contadores de anos e projetos (animados)
  let yearsCount = 0;
  let projectsCount = 0;

  onMount(() => {
    isMobile = window.innerWidth < 768;

    initThreeJS();
    animateEntrance();
    initCounters();

    return () => cleanup();
  });

  function initThreeJS() {
    if (!canvas) return;

    const scene = new THREE.Scene();

    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = isMobile ? 4 : 3;

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);

    // ── Grupo principal ──
    const group = new THREE.Group();
    scene.add(group);

    // Geometria principal: Icosaedro Wireframe
    const geoMain = new THREE.IcosahedronGeometry(1.1, 4);
    const matMain = new THREE.MeshStandardMaterial({
      color: 0x4fc3f7,
      wireframe: true,
      transparent: true,
      opacity: isMobile ? 0.08 : 0.12
    });
    const meshMain = new THREE.Mesh(geoMain, matMain);
    group.add(meshMain);

    // Geometria interna menor (rotação oposta)
    const geoInner = new THREE.IcosahedronGeometry(0.65, 2);
    const matInner = new THREE.MeshStandardMaterial({
      color: 0x4fc3f7,
      wireframe: true,
      transparent: true,
      opacity: 0.06
    });
    const meshInner = new THREE.Mesh(geoInner, matInner);
    group.add(meshInner);

    // Partículas ao redor
    const particleCount = isMobile ? 40 : 120;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4fc3f7,
      size: 0.025,
      transparent: true,
      opacity: 0.4
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Anel externo
    const ringGeo = new THREE.TorusGeometry(1.6, 0.003, 8, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4fc3f7,
      transparent: true,
      opacity: 0.1
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    group.add(ring);

    // ── Luzes ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x4fc3f7, 6, 12);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x9c6cff, 2, 10);
    pointLight2.position.set(-2, -1, 1);
    scene.add(pointLight2);

    // ── ScrollTrigger parallax ──
    ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        group.position.y = -self.progress * 2.5;
        meshMain.material.opacity = 0.12 * (1 - self.progress * 0.7);
      }
    });

    // ── Mouse parallax ──
    let targetRotX = 0;
    let targetRotY = 0;

    document.addEventListener('mousemove', (e) => {
      if (isMobile) return;
      targetRotX = -(e.clientY / window.innerHeight - 0.5) * 0.6;
      targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.6;
    });

    // ── Loop de animação ──
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotação contínua
      meshMain.rotation.y += 0.004;
      meshMain.rotation.x += 0.001;
      meshInner.rotation.y -= 0.006;
      meshInner.rotation.z += 0.003;
      particles.rotation.y += 0.001;
      ring.rotation.z += 0.002;

      // Suavizar rotação do grupo (mouse)
      group.rotation.x += (targetRotX - group.rotation.x) * 0.05;
      group.rotation.y += (targetRotY - group.rotation.y) * 0.05;

      // Pulso de escala
      const pulse = 1 + Math.sin(elapsed * 0.8) * 0.02;
      group.scale.setScalar(pulse);

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ──
    const handleResize = () => {
      isMobile = window.innerWidth < 768;
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);
  }

  function animateEntrance() {
    const tl = gsap.timeline({ delay: 1.4 });

    // Título linha por linha (letras em máscara de overflow)
    tl.from('.hero-tag', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from('.hero-title-line', {
      y: '110%',
      duration: 1,
      stagger: 0.12,
      ease: 'expo.out'
    }, '-=0.3')
    .from('.hero-subtitle', {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-desc', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-cta', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.stat-item', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.scroll-indicator', {
      opacity: 0,
      duration: 0.6
    }, '-=0.3');
  }

  function initCounters() {
    // Animar contadores de estatísticas
    setTimeout(() => {
      gsap.to({ val: 0 }, {
        val: 5,
        duration: 2,
        delay: 2,
        ease: 'power2.out',
        onUpdate: function() {
          yearsCount = Math.round(this.targets()[0].val);
        }
      });
      gsap.to({ val: 0 }, {
        val: 40,
        duration: 2,
        delay: 2.2,
        ease: 'power2.out',
        onUpdate: function() {
          projectsCount = Math.round(this.targets()[0].val);
        }
      });
    }, 0);
  }

  function cleanup() {
    if (rafId) cancelAnimationFrame(rafId);
    if (renderer) renderer.dispose();
    if (resizeObserver) resizeObserver.disconnect();
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === container) st.kill();
    });
  }
</script>

<section bind:this={container} class="hero" id="about">
  <!-- Título decorativo de fundo -->
  <div class="bg-text" aria-hidden="true">DESIGN<br />THINKING</div>

  <!-- Imagem de fundo com overlay -->
  <div class="hero-bg-media" aria-hidden="true">
    <img src="/images/640466724_18027597308619181_6553818123569417007_n.jpg" alt="" class="hero-bg-main" />
    <div class="hero-overlay"></div>
  </div>

  <!-- Canvas Three.js -->
  {#if true}
    <canvas bind:this={canvas} class="three-canvas" aria-hidden="true"></canvas>
  {/if}

  <!-- Conteúdo esquerdo -->
  <div class="hero-content">
    <p class="hero-tag">Produção Profissional Focada em Gerar Lucros</p>

    <h1 class="hero-title" aria-label="Design centrado no usuário">
      <span class="title-mask">
        <span class="hero-title-line">DESIGN</span>
      </span>
      <span class="title-mask accent-line">
        <span class="hero-title-line">CENTRADO</span>
      </span>
      <span class="title-mask">
        <span class="hero-title-line">NO USUÁRIO</span>
      </span>
    </h1>

    <p class="hero-subtitle">COMO ATUO NO SEU PROJETO</p>

    <p class="hero-desc">
      Utilizo uma abordagem de design thinking fundamentada em pesquisa de usuário,
      prototipagem rápida e testes de usabilidade — descobrindo insights cedo e
      criando soluções intuitivas e impactantes.
    </p>

    <div class="hero-cta">
      <a href="#work" class="btn-primary" data-cursor>Ver Projetos</a>
      <a href="#contact" class="btn-ghost" data-cursor>Entrar em contato</a>
    </div>
  </div>

  <!-- Stats (direita inferior) -->
  <div class="hero-stats">
    <div class="stat-item">
      <span class="stat-num">{yearsCount}+</span>
      <span class="stat-label">Anos de<br />Experiência</span>
    </div>
    <div class="stat-divider" aria-hidden="true"></div>
    <div class="stat-item">
      <span class="stat-num">{projectsCount}+</span>
      <span class="stat-label">Projetos<br />Entregues</span>
    </div>
    <div class="stat-divider" aria-hidden="true"></div>
    <div class="stat-item">
      <span class="stat-num">100%</span>
      <span class="stat-label">Satisfação<br />do Cliente</span>
    </div>
  </div>

  <!-- Indicador de scroll -->
  <div class="scroll-indicator" aria-hidden="true">
    <div class="scroll-line"></div>
    <span class="scroll-label">SCROLL</span>
  </div>
</section>

<style>
  /* ── Hero Layout ── */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 120px var(--container-pad) 80px;
    overflow: hidden;
  }

  /* ── Background decorativo ── */
  .bg-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--font-display);
    font-size: clamp(100px, 18vw, 280px);
    line-height: 0.85;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.04);
    pointer-events: none;
    letter-spacing: -0.02em;
    text-align: center;
    white-space: nowrap;
    user-select: none;
    z-index: 0;
  }

  /* ── Background Media ── */
  .hero-bg-media {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: #000;
  }

  .hero-bg-main {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%; /* Levemente para o topo para mostrar mais composição */
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: #000;
    opacity: 0.8;
    z-index: 1;
  }

  /* ── Three.js Canvas ── */
  .three-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  /* ── Conteúdo hero ── */
  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 780px;
  }

  .hero-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.25em;
    color: var(--accent);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hero-tag::before {
    content: '';
    display: block;
    width: 32px;
    height: 1px;
    background: var(--accent);
  }

  /* Máscara para animação de entrada */
  .title-mask {
    display: block;
    overflow: hidden;
    line-height: 0.92;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(64px, 11vw, 180px);
    letter-spacing: -0.02em;
    line-height: 0.92;
    margin-bottom: 32px;
  }

  .accent-line .hero-title-line {
    -webkit-text-stroke: 1px var(--accent);
    color: transparent;
  }

  .hero-subtitle {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.3em;
    color: var(--text-muted);
    margin-bottom: 16px;
  }

  .hero-desc {
    font-size: clamp(14px, 1.2vw, 18px);
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 480px;
    margin-bottom: 40px;
  }

  /* ── Botões ── */
  .hero-cta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    background: var(--accent);
    color: #000;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-decoration: none;
    transition: background 0.3s, transform 0.3s;
  }

  .btn-primary:hover {
    background: #81d4fa;
    transform: translateY(-2px);
  }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    padding: 14px 32px;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.15em;
    text-decoration: none;
    transition: border-color 0.3s, color 0.3s, transform 0.3s;
  }

  .btn-ghost:hover {
    border-color: var(--accent);
    color: var(--accent);
    transform: translateY(-2px);
  }

  /* ── Stats ── */
  .hero-stats {
    position: absolute;
    right: var(--container-pad);
    bottom: 80px;
    display: flex;
    align-items: center;
    gap: 32px;
    z-index: 2;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }

  .stat-num {
    font-family: var(--font-display);
    font-size: clamp(28px, 3vw, 48px);
    color: var(--accent);
    line-height: 1;
  }

  .stat-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    line-height: 1.4;
    text-transform: uppercase;
  }

  .stat-divider {
    width: 1px;
    height: 40px;
    background: var(--border);
  }

  /* ── Scroll indicator ── */
  .scroll-indicator {
    position: absolute;
    right: var(--container-pad);
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 2;
  }

  .scroll-line {
    width: 1px;
    height: 80px;
    background: linear-gradient(to bottom, var(--accent), transparent);
    animation: scrollLine 2s ease-in-out infinite;
  }

  @keyframes scrollLine {
    0% { transform: scaleY(0); transform-origin: top; }
    50% { transform: scaleY(1); transform-origin: top; }
    51% { transform: scaleY(1); transform-origin: bottom; }
    100% { transform: scaleY(0); transform-origin: bottom; }
  }

  .scroll-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.2em;
    color: var(--text-muted);
    writing-mode: vertical-rl;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .hero {
      padding-bottom: 120px;
    }

    .hero-stats {
      position: relative;
      right: auto;
      bottom: auto;
      margin-top: 48px;
      flex-wrap: wrap;
      gap: 24px;
    }

    .scroll-indicator {
      display: none;
    }

    .bg-text {
      font-size: clamp(60px, 20vw, 100px);
      opacity: 0.5;
    }
  }
</style>
