import './App.scss';
import { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TypeIt from 'typeit';

function App() {

  const [collapsed, setCollapsed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const bashWindow = document.querySelector<HTMLElement>('.bash-window');

  const updateDims = () => {
    const dimsEl = document.querySelector('.window-dims');
    const bashWindow = document.querySelector<HTMLElement>('.bash-window');
    if(!bashWindow) return;
    if (dimsEl) {
      dimsEl.textContent = `${bashWindow.offsetWidth}x${bashWindow.offsetHeight}`;
    }
  };

  useEffect(() => {
    // Fade out scroll guide after 3s
    const mouse = document.querySelector('.mouse');
    if (mouse) {
      setTimeout(() => mouse.classList.add('fade-out'), 3000);
    }

    // Track whether TypeIt has already been initialized so it doesn't re-run
    let typeItInstance: TypeIt | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');

            if (entry.target.classList.contains('slide-2') && !typeItInstance) {
              typeItInstance = new TypeIt('.type-area', {
                speed: 80,
                waitUntilVisible: true,
                cursorChar: '&#x2588',
              })
                .type('echo $skills')
                .pause(400)
                .exec(() => {
                  // Remove the TypeIt cursor from the prompt line
                  document.querySelector('.ti-cursor')?.remove();

                  const skillItems = document.querySelectorAll<HTMLElement>('.skills > li');
                  let lastTimeout = 0;

                  skillItems.forEach((col, i) => {
                    const header = col.querySelector<HTMLElement>('h4');
                    const items = col.querySelectorAll<HTMLElement>('li');

                    setTimeout(() => {
                      if (header) header.classList.add('line-reveal');
                    }, i * 400);

                    items.forEach((item, j) => {
                      const delay = i * 400 + (j + 1) * 80;
                      if (delay > lastTimeout) lastTimeout = delay;
                      setTimeout(() => {
                        item.classList.add('line-reveal');
                      }, delay);
                    });
                  });

                  // Append blinking cursor after the last item reveals
                  setTimeout(() => {
                    const lastCol = skillItems[skillItems.length - 1];
                    const lastItem = lastCol?.querySelector<HTMLElement>('ul li:last-child');
                    if (lastItem) {
                      const cursor = document.createElement('span');
                      cursor.className = 'terminal-cursor';
                      cursor.textContent = '█';
                      lastItem.appendChild(cursor);
                    }
                  }, lastTimeout + 150);
                })
                .go();
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    document.querySelectorAll('.observe').forEach((el) => observer.observe(el));

    // Scroll opacity effect for slide-1
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const slide1 = document.querySelector('.slide-1') as HTMLElement;
      if (slide1) {
        slide1.style.opacity = String(
          Math.max(0, 1 - scrollTop / (window.innerHeight / 5))
        );
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Bash window controls

    bashWindow?.addEventListener('click', (e) => {
      const control = (e.target as HTMLElement).closest('.window-control') as HTMLElement | null;
      if (!control) return;

    });

    // Bash window title
    updateDims(); // set on load
    window.addEventListener('resize', updateDims);


    // Populate modal with the clicked carousel image
    const screenshotModal = document.getElementById('screenshotModal');
    const onModalShow = (e: Event) => {
      const trigger = (e as any).relatedTarget as HTMLElement;
      const img = screenshotModal?.querySelector('.modal-screenshot') as HTMLImageElement;
      const title = screenshotModal?.querySelector('.modal-title');
      if (img) img.src = trigger.dataset.bsImg ?? '';
      if (img) img.alt = trigger.dataset.bsTitle ?? '';
      if (title) title.textContent = trigger.dataset.bsTitle ?? '';
    };
    screenshotModal?.addEventListener('show.bs.modal', onModalShow);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateDims);
      typeItInstance?.destroy();
      screenshotModal?.removeEventListener('show.bs.modal', onModalShow);
    };
  }, []);

  return (
    <>
      {/* Slide 1 — Hero */}
      <div className="slide slide-1 d-flex align-items-center justify-content-center observe">
        <div className="text-center">
          <h1 className="reveal-from-left">Alex Watson</h1>
          <h2 className="slide-down mt-3">Software &amp; AI Engineer</h2>
        </div>
        <div className="mouse fade-in">
          <span className="scroll-wheel"></span>
          <div className="text">Scroll Down</div>
        </div>
      </div>

      {/* Slide 2 — Skills */}
      <div className="slide slide-2 observe">
        <div className="container py-5">
          <h1 className="text-center what-do-i-do mb-2">What Do I Do?</h1>
          <p className="text-center mb-4">I turn coffee into AI software, using tools like:</p>

          <div className={`bash-window ${collapsed ? 'collapsed' : ''} ${isFullScreen ? 'full-screen' : ''}`}>
            <div className="window-controls d-flex align-items-center">
              <span className="window-control red" onClick={() => {
                const el = document.querySelector('.bash-window') as HTMLElement;
                if (el) el.style.display = 'none';
              }} />

              <span
                className="window-control yellow"
                onClick={() => setCollapsed(prev => !prev)}
              />

              <span
                className="window-control green"
                onClick={() => { setIsFullScreen(prev => !prev); setTimeout(updateDims, 150)}}
              />
              <span className="window-title">
                <span className="ms-2">
                  <i className="fa-solid fa-folder me-2"></i>alexwatson — zsh — <span className="window-dims"></span>
                </span>
              </span>
            </div>

            <div className="bash-body">
              <h2 className="bash-prompt text-orange px-3 pt-2">
                alex@portfolio:<span className="text-white">~$</span>
                <span className="ms-2 type-area"></span>
              </h2>
              <ul className="skills row px-3 pb-3">
                <li className="col-12 col-md-4">
                  <h4>Front-end</h4>
                  <ul>
                    <li>JavaScript/ES2025</li>
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>Bootstrap 5</li>
                    <li>MaterialUI</li>
                    <li>D3.js</li>
                    <li>Svelte</li>
                    <li>SolidJS</li>
                    <li>React/Redux</li>
                    <li>Hooks/Context</li>
                  </ul>
                </li>
                <li className="col-12 col-md-4">
                  <h4>AI</h4>
                  <ul>
                    <li>Pandas</li>
                    <li>Polars</li>
                    <li>NumPy</li>
                    <li>Sklearn</li>
                    <li>PySpark</li>
                    <li>PyTorch</li>
                    <li>Matplotlib</li>
                    <li>LangChain</li>
                    <li>LangGraph</li>
                    <li>Tensorflow</li>
                    <li>llama.cpp</li>
                    <li>OpenCV</li>
                    <li>Airflow</li>
                    <li>SQLAlchemy</li>
                    <li>PostgreSQL</li>
                    <li>PostGIS</li>
                    <li>PGVector</li>
                    <li>Milvus</li>
                    <li>NoSQL</li>
                    <li>Oracle</li>
                    <li>MLFlow</li>
                  </ul>
                </li>
                <li className="col-12 col-md-4">
                  <h4>Back-end</h4>
                  <ul>
                    <li>Linux</li>
                    <li>POSIX</li>
                    <li>CPython 3.14</li>
                    <li>Rust 2025</li>
                    <li>Docker/Podman</li>
                    <li>Kubernetes</li>
                    <li>Terraform</li>
                    <li>FastAPI</li>
                    <li>Flask</li>
                    <li>Blacksheep</li>
                    <li>C/C++</li>
                    <li>Java</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 3 — Projects */}
      <div className="slide slide-3-projects d-flex align-items-center justify-content-center observe">
        <div className="container py-5">
          <h1 className="text-center projects-heading mb-5">Projects I've Been Working On</h1>

          <div id="projectsCarousel" className="carousel slide" data-bs-ride="carousel">

            {/* LM Explain */}
            <div className="carousel-inner">
              <div className="carousel-item active">

                <img
                  src="/assets/lm-explain-screenshot.png"
                  className="d-block w-100 carousel-img"
                  alt="LM Explain"
                  data-bs-toggle="modal"
                  data-bs-target="#screenshotModal"
                  data-bs-img="/assets/lm-explain-screenshot.png"
                  data-bs-title="LM Explain"
                />

                <div className="carousel-text text-center mt-3">
                  <h5>LM Explain</h5>
                  <p>An Explainable AI Python CLI tool that visualizes how language models attend to tokens across layers using llama_cpp.</p>
                </div>
              </div>

              {/* Pre-training LLM */}
              <div className="carousel-item">
                <img
                  src="/assets/alex-alpaca-screenshot.png"
                  className="d-block w-100 carousel-img"
                  alt="Pretraining"
                  data-bs-toggle="modal"
                  data-bs-target="#screenshotModal"
                  data-bs-img="/assets/alex-alpaca-screenshot.png"
                  data-bs-title="Pretraining"
                />
                <div className="carousel-text text-center mt-3">
                  <h5>Pre-training an LLM from scratch</h5>
                  <p>Using PyTorch with MPS on my Apple M3 Max with 128GB RAM, I have trained a causal text-generation LLM using the Tatsu Alpaca dataset from HuggingFace with TikToken o200k_base byte-pair encoding. The model architecture consists of RMSNorm, SwiGLU, RoPE, and Group Query Attention. The model converged and produces decent semi-nonsensical output after 400 training steps.</p>
                </div>
              </div>

              {/* Metrics in MLFlow */}
              <div className="carousel-item">
                <img
                  src="/assets/mlflow-metrics-screenshot.png"
                  className="d-block w-100 carousel-img"
                  alt="Tracking MLFlow Metrics"
                  data-bs-toggle="modal"
                  data-bs-target="#screenshotModal"
                  data-bs-img="/assets/mlflow-metrics-screenshot.png"
                  data-bs-title="Tracking MLFlow Metrics"
                />
                <div className="carousel-text text-center mt-3">
                  <h5>Tracking MLFlow Metrics</h5>
                  <p>While training the Alpaca dataset model, I capture metrics in MLFlow 3.10.1 for the experiment training run.</p>
                </div>
              </div>

              {/* NC Build Code RAG */}
              <div className="carousel-item">
                <img
                  src="/assets/building-code-rag-screenshot.png"
                  className="d-block w-100 carousel-img"
                  alt="NC Building Code RAG"
                  data-bs-toggle="modal"
                  data-bs-target="#screenshotModal"
                  data-bs-img="/assets/building-code-rag-screenshot.png"
                  data-bs-title="NC Building Code RAG"
                />
                <div className="carousel-text text-center mt-3">
                  <h5>North Carolina Building Code RAG</h5>
                  <p>Built a RAG pipeline with Python, LangChain, and Milvus Standalone to search a North Carolina building code dataset.</p>
                </div>
              </div>

              {/* Open WebUI Image Search */}
              <div className="carousel-item">
                <img
                  src="/assets/openwebui-image-search-screenshot.png"
                  className="d-block w-100 carousel-img"
                  alt="Open Web UI Image Search Tool"
                  data-bs-toggle="modal"
                  data-bs-target="#screenshotModal"
                  data-bs-img="/assets/openwebui-image-search-screenshot.png"
                  data-bs-title="Open Web UI Image Search Tool"
                />
                <div className="carousel-text text-center mt-3">
                  <h5>Open Web UI Image Search Tool</h5>
                  <p>I created a Python tool in Open Web UI v0.8.10 which searches the web for images with a SearchXNG back-end Docker container and then passes the images to the model (Gemma3 4B parameters, in this case) as context for custom analysis, based on the user's prompt.</p>
                </div>
              </div>

            </div>

            <div className="carousel-indicators">
              <button type="button" data-bs-target="#projectsCarousel" data-bs-slide-to="0" className="active" aria-current="true" />
              <button type="button" data-bs-target="#projectsCarousel" data-bs-slide-to="1" />
              <button type="button" data-bs-target="#projectsCarousel" data-bs-slide-to="2" />
              <button type="button" data-bs-target="#projectsCarousel" data-bs-slide-to="3" />
              <button type="button" data-bs-target="#projectsCarousel" data-bs-slide-to="4" />
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#projectsCarousel" data-bs-slide="prev">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#projectsCarousel" data-bs-slide="next">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

          </div>
        </div>
      </div>

      {/* Screenshot Modal */}
      <div className="modal fade" id="screenshotModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content bg-dark">
            <div className="modal-header border-0">
              <h5 className="modal-title text-white"></h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body p-0">
              <img src="" className="modal-screenshot w-100" alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* Slide 4 — Contact */}
      <div className="slide slide-4 d-flex align-items-center justify-content-center observe">
        <div className="contact text-center">
          <h1 className="mb-4">Contact</h1>
          <div className="d-flex justify-content-center gap-4">
            <a className="fa fa-envelope email" href="mailto:alexfromapex@gmail.com" title="E-mail"></a>
            <a className="fa-brands fa-linkedin linked-in" href="https://www.linkedin.com/in/alexwats0n/" title="LinkedIn" target="_blank" rel="noreferrer"></a>
            <a className="fa-brands fa-stack-overflow stack-overflow" href="https://stackoverflow.com/users/1399491/alex-w?tab=profile" title="StackOverflow" target="_blank" rel="noreferrer"></a>
          </div>
        </div>
      </div>

      <footer className="text-center py-4">
        <div>&copy; Copyright 2017-2026 Alex Watson. All rights reserved.</div>
        <div>Made with <span className="fa fa-coffee coffee" title="coffee"></span></div>
      </footer>
    </>
  );
}

export default App;