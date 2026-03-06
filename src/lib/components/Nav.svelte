<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let scrolled = false;
  let menuOpen = false;

  onMount(() => {
    // Animação de entrada
    gsap.from('.nav-logo', {
      y: -20,
      opacity: 0,
      duration: 0.8,
      delay: 1.5,
      ease: 'power3.out'
    });

    gsap.from('.nav-link', {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      delay: 1.5,
      ease: 'power3.out'
    });

    gsap.from('.nav-socials', {
      y: -20,
      opacity: 0,
      duration: 0.8,
      delay: 1.8,
      ease: 'power3.out'
    });

    // Scroll listener
    const handleScroll = () => {
      scrolled = window.scrollY > 50;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }
</script>

<nav class:scrolled>
  <!-- Logo -->
  <a href="#about" class="nav-logo" aria-label="Ir para o início" on:click={closeMenu}>
    MP
  </a>

  <!-- Links desktop -->
  <ul class="nav-links" role="list">
    <li>
      <a class="nav-link" href="#about" on:click={closeMenu}>SOBRE</a>
    </li>
    <li>
      <a class="nav-link" href="#work" on:click={closeMenu}>TRABALHOS</a>
    </li>
    <li>
      <a class="nav-link" href="#contact" on:click={closeMenu}>CONTATO</a>
    </li>
  </ul>

  <!-- Socials -->
  <div class="nav-socials">
    <a
      href="https://linkedin.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      class="social-link"
    >
      <!-- LinkedIn icon -->
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    </a>
    <a
      href="https://dribbble.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Dribbble"
      class="social-link"
    >
      <!-- Dribbble icon -->
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
      </svg>
    </a>
    <a
      href="https://behance.net"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Behance"
      class="social-link"
    >
      <!-- Behance icon -->
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.803 5.731c.589 0 1.119.051 1.605.155.483.103.895.273 1.243.508.343.235.611.547.804.939.187.387.28.855.28 1.39 0 .596-.135 1.095-.405 1.495-.27.401-.673.737-1.207 1.005.73.21 1.27.578 1.618 1.09.35.514.522 1.133.522 1.858 0 .572-.117 1.076-.351 1.506a3.098 3.098 0 0 1-.96 1.054 4.296 4.296 0 0 1-1.404.608 6.554 6.554 0 0 1-1.656.201H2V5.731h5.803zm-.265 4.989c.47 0 .855-.111 1.147-.332.293-.222.44-.569.44-1.037 0-.27-.05-.494-.149-.671a1.13 1.13 0 0 0-.404-.43 1.79 1.79 0 0 0-.589-.228 3.234 3.234 0 0 0-.71-.072H4.38v2.77h3.158zm.146 5.174c.269 0 .521-.026.757-.08.235-.054.44-.143.617-.268.177-.124.317-.293.421-.504.103-.213.154-.476.154-.788 0-.618-.175-1.062-.522-1.328-.349-.267-.811-.4-1.388-.4H4.38v3.368h3.304zm8.526-.957c.386.377.942.566 1.667.566.52 0 .968-.131 1.346-.391.377-.261.608-.537.693-.826h2.279c-.365 1.138-.924 1.949-1.68 2.429-.756.48-1.671.721-2.745.721a5.76 5.76 0 0 1-2.101-.369 4.528 4.528 0 0 1-1.594-1.045 4.686 4.686 0 0 1-1.016-1.623 5.894 5.894 0 0 1-.358-2.094c0-.74.12-1.43.363-2.069a4.774 4.774 0 0 1 1.035-1.638 4.805 4.805 0 0 1 1.609-1.077 5.367 5.367 0 0 1 2.085-.392c.851 0 1.598.164 2.24.493a4.525 4.525 0 0 1 1.57 1.332 5.524 5.524 0 0 1 .907 1.916 7.21 7.21 0 0 1 .205 2.301h-6.794c.045.793.28 1.368.666 1.745zm2.921-4.697c-.309-.339-.797-.508-1.462-.508-.419 0-.768.072-1.046.215a2.185 2.185 0 0 0-.68.539 2.03 2.03 0 0 0-.364.703 3.4 3.4 0 0 0-.12.715h4.326c-.102-.755-.346-1.325-.654-1.664zM16.076 7.5h4.672V8.7h-4.672V7.5z"/>
      </svg>
    </a>
  </div>

  <!-- Mobile menu toggle -->
  <button
    class="menu-toggle"
    on:click={toggleMenu}
    aria-label="Abrir menu"
    aria-expanded={menuOpen}
  >
    <span class:open={menuOpen}></span>
    <span class:open={menuOpen}></span>
  </button>
</nav>

<!-- Mobile overlay -->
{#if menuOpen}
  <div class="mobile-overlay">
    <ul>
      <li><a href="#about" on:click={closeMenu}>SOBRE</a></li>
      <li><a href="#work" on:click={closeMenu}>TRABALHOS</a></li>
      <li><a href="#contact" on:click={closeMenu}>CONTATO</a></li>
    </ul>
  </div>
{/if}

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px var(--container-pad);
    z-index: 100;
    transition: background 0.4s ease, backdrop-filter 0.4s ease, padding 0.4s ease;
  }

  nav.scrolled {
    background: rgba(8, 10, 14, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding-top: 16px;
    padding-bottom: 16px;
  }

  /* Logo */
  .nav-logo {
    width: 36px;
    height: 36px;
    border: 1px solid var(--border);
    display: grid;
    place-items: center;
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text-primary);
    flex-shrink: 0;
    transition: border-color 0.3s, color 0.3s;
    text-decoration: none;
  }

  .nav-logo:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  /* Nav links */
  .nav-links {
    display: flex;
    gap: 48px;
    list-style: none;
  }

  .nav-link {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.2em;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.3s;
    position: relative;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--accent);
    transition: width 0.3s ease;
  }

  .nav-link:hover {
    color: var(--text-primary);
  }

  .nav-link:hover::after {
    width: 100%;
  }

  /* Socials */
  .nav-socials {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .social-link {
    color: var(--text-muted);
    display: grid;
    place-items: center;
    transition: color 0.3s;
  }

  .social-link:hover {
    color: var(--accent);
  }

  /* Mobile toggle */
  .menu-toggle {
    display: none;
    flex-direction: column;
    gap: 6px;
    width: 24px;
    cursor: none;
    background: none;
    border: none;
    padding: 4px;
  }

  .menu-toggle span {
    display: block;
    height: 1px;
    background: var(--text-primary);
    transition: transform 0.3s, opacity 0.3s;
  }

  .menu-toggle span.open:first-child {
    transform: translateY(7px) rotate(45deg);
  }

  .menu-toggle span.open:last-child {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* Mobile overlay */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: var(--bg);
    z-index: 99;
    display: grid;
    place-items: center;
  }

  .mobile-overlay ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 32px;
    text-align: center;
  }

  .mobile-overlay a {
    font-family: var(--font-display);
    font-size: clamp(40px, 10vw, 80px);
    color: var(--text-primary);
    text-decoration: none;
    letter-spacing: 0.05em;
    transition: color 0.3s;
    display: block;
  }

  .mobile-overlay a:hover {
    color: var(--accent);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .nav-links,
    .nav-socials {
      display: none;
    }

    .menu-toggle {
      display: flex;
    }
  }
</style>
