<script>
  import { onMount, tick } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  import Cursor from '$lib/components/Cursor.svelte';
  import Nav from '$lib/components/Nav.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Marquee from '$lib/components/Marquee.svelte';
  import FeaturedWorks from '$lib/components/FeaturedWorks.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import CaseStudy from '$lib/components/CaseStudy.svelte';

  gsap.registerPlugin(ScrollTrigger);

  let loadingScreen;
  let curtain;
  let isLoaded = false;
  let selectedProject = null;
  let isTransitioning = false;

  onMount(() => {
    gsap.set(curtain, { scaleY: 0 });
    ScrollTrigger.refresh();

    const timer = setTimeout(() => {
      gsap.to(loadingScreen, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          isLoaded = true;
          loadingScreen.style.display = 'none';
          ScrollTrigger.refresh();
        }
      });
    }, 1200);

    return () => clearTimeout(timer);
  });

  function openCaseStudy(e) {
    if (isTransitioning) return;
    isTransitioning = true;
    const project = e.detail;

    gsap.to(curtain, {
      scaleY: 1, transformOrigin: 'bottom center', duration: 0.4, ease: 'power3.in',
      onComplete: () => {
        selectedProject = project;
        tick().then(() => {
          window.scrollTo(0, 0);
          gsap.to(curtain, {
            scaleY: 0, transformOrigin: 'top center', duration: 0.5, ease: 'power3.out', delay: 0.05,
            onComplete: () => { isTransitioning = false; }
          });
        });
      }
    });
  }

  function closeCaseStudy() {
    if (isTransitioning) return;
    isTransitioning = true;

    gsap.to(curtain, {
      scaleY: 1, transformOrigin: 'bottom center', duration: 0.4, ease: 'power3.in',
      onComplete: () => {
        selectedProject = null;
        tick().then(() => {
          window.scrollTo(0, 0);
          setTimeout(() => ScrollTrigger.refresh(), 120);
          gsap.to(curtain, {
            scaleY: 0, transformOrigin: 'top center', duration: 0.5, ease: 'power3.out', delay: 0.1,
            onComplete: () => { isTransitioning = false; }
          });
        });
      }
    });
  }

  function navigateProject(e) {
    if (isTransitioning) return;
    isTransitioning = true;
    const project = e.detail;

    gsap.to(curtain, {
      scaleY: 1, transformOrigin: 'bottom center', duration: 0.4, ease: 'power3.in',
      onComplete: () => {
        selectedProject = project;
        tick().then(() => {
          window.scrollTo(0, 0);
          gsap.to(curtain, {
            scaleY: 0, transformOrigin: 'top center', duration: 0.5, ease: 'power3.out', delay: 0.05,
            onComplete: () => { isTransitioning = false; }
          });
        });
      }
    });
  }
</script>

<!-- Loading Screen -->
<div bind:this={loadingScreen} class="loading-screen" aria-hidden="true">
  <div class="loading-inner">
    <div class="loading-logo">MP</div>
    <div class="loading-bar">
      <div class="loading-progress"></div>
    </div>
  </div>
</div>

<!-- Page Curtain (transition) -->
<div bind:this={curtain} class="page-curtain" aria-hidden="true"></div>

<Cursor />

{#if selectedProject}
  <CaseStudy
    project={selectedProject}
    on:close={closeCaseStudy}
    on:openProject={navigateProject}
  />
{:else}
  <Nav />
  <main>
    <Hero />
    <Marquee />
    <FeaturedWorks on:openCaseStudy={openCaseStudy} />
    <Contact />
  </main>
{/if}

<style>
  /* Loading Screen */
  .loading-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: var(--bg);
    display: grid;
    place-items: center;
  }

  .loading-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  .loading-logo {
    width: 64px;
    height: 64px;
    border: 1px solid var(--border);
    display: grid;
    place-items: center;
    font-family: var(--font-mono);
    font-size: 24px;
    color: var(--accent);
    animation: pulse 1.5s ease-in-out infinite;
  }

  .loading-bar {
    width: 200px;
    height: 1px;
    background: var(--border);
    overflow: hidden;
  }

  .loading-progress {
    height: 100%;
    background: var(--accent);
    animation: loadProgress 1.2s ease-out forwards;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @keyframes loadProgress {
    from { width: 0%; }
    to { width: 100%; }
  }

  /* Page Curtain */
  .page-curtain {
    position: fixed;
    inset: 0;
    z-index: 9000;
    background: var(--accent);
    transform: scaleY(0);
    pointer-events: none;
    transform-origin: bottom center;
  }

  main { position: relative; }
</style>
