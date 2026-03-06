<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let cursorDot;
  let cursorFollower;
  let isVisible = false;

  onMount(() => {
    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    // Mostrar cursor apenas quando o mouse entra na janela
    document.addEventListener('mouseenter', () => {
      isVisible = true;
      gsap.to([cursorDot, cursorFollower], { opacity: 1, duration: 0.3 });
    });

    document.addEventListener('mouseleave', () => {
      gsap.to([cursorDot, cursorFollower], { opacity: 0, duration: 0.3 });
    });

    // Movimento do dot (imediato)
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(cursorDot, {
        x: mouseX - 3,
        y: mouseY - 3,
        duration: 0.05,
        ease: 'none'
      });
    });

    // Follower com inércia via ticker
    gsap.ticker.add(() => {
      posX += (mouseX - posX) * 0.08;
      posY += (mouseY - posY) * 0.08;
      gsap.set(cursorFollower, {
        x: posX - 20,
        y: posY - 20
      });
    });

    // Hover em elementos interativos → expande follower
    const handleEnter = () => {
      gsap.to(cursorFollower, {
        scale: 2.5,
        opacity: 0.4,
        duration: 0.35,
        ease: 'power2.out'
      });
      gsap.to(cursorDot, { opacity: 0, duration: 0.2 });
    };

    const handleLeave = () => {
      gsap.to(cursorFollower, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out'
      });
      gsap.to(cursorDot, { opacity: 1, duration: 0.2 });
    };

    // Observar elementos interativos dinamicamente
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, [data-cursor], label, input, textarea').forEach(el => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Adicionar aos elementos já existentes
    document.querySelectorAll('a, button, [data-cursor], label, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    });

    // Click effect
    document.addEventListener('mousedown', () => {
      gsap.to(cursorFollower, { scale: 0.8, duration: 0.1 });
    });
    document.addEventListener('mouseup', () => {
      gsap.to(cursorFollower, { scale: 1, duration: 0.2 });
    });

    return () => observer.disconnect();
  });
</script>

<div bind:this={cursorDot} class="cursor-dot" aria-hidden="true"></div>
<div bind:this={cursorFollower} class="cursor-follower" aria-hidden="true"></div>

<style>
  .cursor-dot {
    position: fixed;
    top: 0;
    left: 0;
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    mix-blend-mode: difference;
    opacity: 0;
    will-change: transform;
  }

  .cursor-follower {
    position: fixed;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(79, 195, 247, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    opacity: 0;
    will-change: transform;
    transition: border-color 0.3s;
  }
</style>
