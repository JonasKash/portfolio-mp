<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  let section;
  let formEl;

  // Estado do formulário
  let formData = { name: '', email: '', message: '', service: '' };
  let formState = 'idle'; // idle | sending | success | error
  let focusedField = '';

  const services = ['UX Design', 'UI Design', 'Design System', 'Consultoria', 'Outro'];

  onMount(() => {
    animateEntrance();
    animateMarquee();
  });

  function animateEntrance() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.from('.contact-label', { opacity: 0, y: 20, duration: 0.6 })
      .from('.contact-title span', {
        y: '110%',
        duration: 1,
        stagger: 0.08,
        ease: 'expo.out'
      }, '-=0.3')
      .from('.contact-desc', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
      .from('.contact-info-item', {
        opacity: 0,
        x: -20,
        stagger: 0.1,
        duration: 0.6
      }, '-=0.4')
      .from('.form-group', {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4')
      .from('.form-submit', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');
  }

  function animateMarquee() {
    // Animação do email gigante no hover
    const emailEl = document.querySelector('.contact-email-big');
    if (!emailEl) return;

    emailEl.addEventListener('mouseenter', () => {
      gsap.to(emailEl, { letterSpacing: '0.05em', duration: 0.4, ease: 'power2.out' });
    });
    emailEl.addEventListener('mouseleave', () => {
      gsap.to(emailEl, { letterSpacing: '0em', duration: 0.4 });
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (formState === 'sending') return;

    formState = 'sending';

    try {
      // 🔗 COLOQUE A URL DO SEU WEBHOOK AQUI
      const webhookUrl = '';

      if (webhookUrl) {
        // Envio real para o webhook
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Simulação enquanto não tem webhook para teste visual
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      formState = 'success';

      gsap.from('.success-message', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      });

      // Reset após alguns segundos
      setTimeout(() => {
        formState = 'idle';
        formData = { name: '', email: '', message: '', service: '' };
      }, 5000);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      formState = 'idle'; // Pode mostrar uma mensagem de erro se preferir
      alert('Houve um erro ao enviar a mensagem. Tente novamente.');
    }
  }
</script>

<section bind:this={section} id="contact" class="contact-section">
  <!-- Fundo decorativo -->
  <div class="contact-bg" aria-hidden="true">
    <div class="bg-gradient"></div>
    <div class="grid-lines"></div>
  </div>

  <div class="contact-inner">
    <!-- Coluna esquerda -->
    <div class="contact-left">
      <p class="contact-label">03 — CONTATO</p>

      <h2 class="contact-title">
        <span class="title-mask"><span>Vamos</span></span>
        <span class="title-mask outline-text"><span>criar</span></span>
        <span class="title-mask"><span>juntos?</span></span>
      </h2>

      <p class="contact-desc">
        Estou disponível para projetos freelance, colaborações e oportunidades full-time.
        Se você tem uma ideia interessante, adoro conversar.
      </p>

      <!-- Informações de contato -->
      <div class="contact-info">
        <a href="mailto:contato@mateusmp.com.br" class="contact-info-item" data-cursor>
          <span class="info-label">Email</span>
          <span class="info-value">contato@mateusmp.com.br</span>
          <span class="info-arrow">→</span>
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="contact-info-item" data-cursor>
          <span class="info-label">LinkedIn</span>
          <span class="info-value">/in/agenciamp</span>
          <span class="info-arrow">→</span>
        </a>
        <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" class="contact-info-item" data-cursor>
          <span class="info-label">Dribbble</span>
          <span class="info-value">/agenciamp</span>
          <span class="info-arrow">→</span>
        </a>
        <div class="contact-info-item static">
          <span class="info-label">Localização</span>
          <span class="info-value">São Paulo, Brasil — GMT-3</span>
        </div>
        <div class="contact-info-item static available">
          <span class="avail-dot"></span>
          <span class="info-value">Disponível para novos projetos</span>
        </div>
      </div>
    </div>

    <!-- Coluna direita — Formulário -->
    <div class="contact-right">
      {#if formState === 'success'}
        <div class="success-message">
          <div class="success-icon">✓</div>
          <h3>Mensagem enviada!</h3>
          <p>Obrigado pelo contato. Retornarei em até 48 horas.</p>
        </div>
      {:else}
        <form bind:this={formEl} on:submit={handleSubmit} class="contact-form">
          <!-- Nome + Email -->
          <div class="form-row">
            <div class="form-group" class:focused={focusedField === 'name'}>
              <label for="name" class="form-label">NOME</label>
              <input
                id="name"
                type="text"
                bind:value={formData.name}
                on:focus={() => focusedField = 'name'}
                on:blur={() => focusedField = ''}
                placeholder="Seu nome completo"
                required
                autocomplete="name"
                class="form-input"
              />
            </div>
            <div class="form-group" class:focused={focusedField === 'email'}>
              <label for="email" class="form-label">EMAIL</label>
              <input
                id="email"
                type="email"
                bind:value={formData.email}
                on:focus={() => focusedField = 'email'}
                on:blur={() => focusedField = ''}
                placeholder="seu@email.com"
                required
                autocomplete="email"
                class="form-input"
              />
            </div>
          </div>

          <!-- Serviço -->
          <div class="form-group" class:focused={focusedField === 'service'}>
            <span class="form-label" id="service-group-label">SERVIÇO</span>
            <div class="service-pills" role="group" aria-labelledby="service-group-label">
              {#each services as service}
                <button
                  type="button"
                  class="service-pill"
                  class:active={formData.service === service}
                  on:click={() => formData.service = formData.service === service ? '' : service}
                  data-cursor
                >
                  {service}
                </button>
              {/each}
            </div>
          </div>

          <!-- Mensagem -->
          <div class="form-group" class:focused={focusedField === 'message'}>
            <label for="message" class="form-label">MENSAGEM</label>
            <textarea
              id="message"
              bind:value={formData.message}
              on:focus={() => focusedField = 'message'}
              on:blur={() => focusedField = ''}
              placeholder="Conte sobre o seu projeto..."
              required
              rows="5"
              class="form-input form-textarea"
            ></textarea>
            <span class="char-count">{formData.message.length} / 500</span>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="form-submit"
            class:sending={formState === 'sending'}
            disabled={formState === 'sending'}
            data-cursor
          >
            {#if formState === 'sending'}
              <span class="loading-dots">
                <span></span><span></span><span></span>
              </span>
              Enviando...
            {:else}
              Enviar mensagem
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            {/if}
          </button>
        </form>
      {/if}
    </div>
  </div>

  <!-- Email gigante decorativo -->
  <div class="contact-email-section" aria-hidden="true">
    <a href="mailto:contato@mateusmp.com.br" class="contact-email-big" tabindex="-1">
      contato@mateusmp.com.br
    </a>
  </div>

  <!-- Footer -->
  <footer class="contact-footer">
    <p class="footer-copy">© 2025 Agência MP. Todos os direitos reservados.</p>
    <p class="footer-credit">Desenvolvido por Jonas</p>
  </footer>
</section>

<style>
  /* ── Layout ── */
  .contact-section {
    position: relative;
    background: var(--bg-2);
    overflow: hidden;
    border-top: 1px solid var(--border);
  }

  /* Fundo decorativo */
  .contact-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .bg-gradient {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 400px;
    background: radial-gradient(ellipse at center, rgba(79, 195, 247, 0.04) 0%, transparent 70%);
  }

  /* Inner */
  .contact-inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    padding: var(--section-pad) var(--container-pad);
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ── Coluna esquerda ── */
  .contact-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.25em;
    color: var(--accent);
    margin-bottom: 24px;
    display: block;
  }

  .contact-title {
    font-family: var(--font-display);
    font-size: clamp(48px, 7vw, 100px);
    letter-spacing: -0.01em;
    line-height: 0.92;
    margin-bottom: 32px;
  }

  .title-mask {
    display: block;
    overflow: hidden;
    line-height: 1.05;
  }

  .outline-text {
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.25);
    color: transparent;
  }

  .contact-desc {
    font-size: 15px;
    line-height: 1.75;
    color: var(--text-secondary);
    margin-bottom: 48px;
    max-width: 400px;
  }

  /* Informações de contato */
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .contact-info-item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.3s, padding-left 0.3s;
    cursor: none;
  }

  .contact-info-item:not(.static):hover {
    color: var(--text-primary);
    padding-left: 8px;
  }

  .contact-info-item.available {
    border-bottom: none;
    padding-top: 20px;
    gap: 12px;
  }

  .info-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.2em;
    color: var(--text-muted);
    width: 80px;
    flex-shrink: 0;
  }

  .info-value {
    font-size: 13px;
    flex: 1;
  }

  .info-arrow {
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    color: var(--accent);
  }

  .contact-info-item:not(.static):hover .info-arrow {
    opacity: 1;
    transform: translateX(4px);
  }

  /* Indicador disponível */
  .avail-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4caf50;
    flex-shrink: 0;
    box-shadow: 0 0 8px #4caf50;
    animation: dotPulse 2s ease-in-out infinite;
  }

  @keyframes dotPulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px #4caf50; }
    50% { opacity: 0.6; box-shadow: 0 0 16px #4caf50; }
  }

  /* ── Formulário ── */
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
  }

  .form-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.25em;
    color: var(--text-muted);
    transition: color 0.3s;
  }

  .form-group.focused .form-label {
    color: var(--accent);
  }

  .form-input {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 14px;
    padding: 14px 16px;
    outline: none;
    transition: border-color 0.3s, background 0.3s;
    width: 100%;
  }

  .form-input::placeholder {
    color: var(--text-muted);
  }

  .form-input:focus {
    border-color: rgba(79, 195, 247, 0.4);
    background: rgba(79, 195, 247, 0.03);
  }

  .form-textarea {
    resize: vertical;
    min-height: 120px;
  }

  .char-count {
    position: absolute;
    bottom: 10px;
    right: 14px;
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text-muted);
    pointer-events: none;
  }

  /* Pills de serviço */
  .service-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .service-pill {
    padding: 8px 16px;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    background: transparent;
    cursor: none;
    transition: border-color 0.3s, color 0.3s, background 0.3s;
  }

  .service-pill:hover {
    border-color: rgba(79, 195, 247, 0.3);
    color: var(--text-primary);
  }

  .service-pill.active {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-glow);
  }

  /* Submit */
  .form-submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 18px 40px;
    background: var(--accent);
    color: #000;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.15em;
    border: none;
    cursor: none;
    transition: background 0.3s, transform 0.3s, opacity 0.3s;
    width: fit-content;
  }

  .form-submit:hover:not(:disabled) {
    background: #81d4fa;
    transform: translateY(-2px);
  }

  .form-submit:disabled {
    opacity: 0.6;
  }

  /* Loading dots */
  .loading-dots {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .loading-dots span {
    width: 4px;
    height: 4px;
    background: #000;
    border-radius: 50%;
    animation: dotBounce 0.6s ease-in-out infinite;
  }

  .loading-dots span:nth-child(2) { animation-delay: 0.15s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.3s; }

  @keyframes dotBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  /* Mensagem de sucesso */
  .success-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 80px 40px;
    border: 1px solid rgba(79, 195, 247, 0.2);
    background: rgba(79, 195, 247, 0.03);
    text-align: center;
  }

  .success-icon {
    width: 64px;
    height: 64px;
    border: 1px solid var(--accent);
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 24px;
    color: var(--accent);
  }

  .success-message h3 {
    font-family: var(--font-display);
    font-size: 32px;
    letter-spacing: 0.04em;
  }

  .success-message p {
    color: var(--text-secondary);
    font-size: 14px;
  }

  /* ── Email decorativo ── */
  .contact-email-section {
    overflow: hidden;
    padding: 40px 0;
    border-top: 1px solid var(--border);
    white-space: nowrap;
  }

  .contact-email-big {
    display: block;
    font-family: var(--font-display);
    font-size: clamp(40px, 6vw, 96px);
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
    letter-spacing: 0em;
    text-decoration: none;
    text-align: center;
    transition: color 0.4s, -webkit-text-stroke 0.4s;
    cursor: none;
  }

  .contact-email-big:hover {
    color: var(--accent);
    -webkit-text-stroke: 0;
  }

  /* ── Footer ── */
  .contact-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px var(--container-pad);
    border-top: 1px solid var(--border);
  }

  .footer-copy,
  .footer-credit {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--text-muted);
  }



  /* ── Responsive ── */
  @media (max-width: 900px) {
    .contact-inner {
      grid-template-columns: 1fr;
      gap: 48px;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .contact-footer {
      flex-direction: column;
      gap: 8px;
      text-align: center;
    }
  }
</style>
