import type { Editor, Plugin } from 'grapesjs';
import blocks from './blocks';
import commands from './commands';
import panels from './panels';

export type PluginOptions = {
  blocks?: string[];
  block?: (blockId: string) => ({});
  modalImportTitle?: string;
  modalImportButton?: string;
  modalImportLabel?: string;
  modalImportContent?: string | ((editor: Editor) => string);
  importViewerOptions?: Record<string, any>;
  textCleanCanvas?: string;
  showStylesOnChange?: boolean;
  useCustomTheme?: boolean;
};

export type RequiredPluginOptions = Required<PluginOptions>;

const plugin: Plugin<PluginOptions> = (editor, opts = {}) => {
  const config: RequiredPluginOptions = {
    blocks: [],
    block: () => ({}),
    modalImportTitle: 'Import',
    modalImportButton: 'Import',
    modalImportLabel: 'Paste your code here',
    modalImportContent: '',
    importViewerOptions: {},
    textCleanCanvas: 'Are you sure you want to clear the canvas?',
    showStylesOnChange: true,
    useCustomTheme: false,
    ...opts,
  };

  const { BlockManager } = editor;

  const customBlocks = [
    {
      id: 'link-block',
      label: 'Link Block',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"/></svg>`,
      content: {
        type: 'link',
        editable: false,
        droppable: true,
        style: {
          display: 'inline-block',
          padding: '5px',
          'min-height': '50px',
          'min-width': '50px',
        },
      },
    },
    {
      id: 'quote',
      label: 'Quote',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" /></svg>`,
      content: `<blockquote class="quote">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</blockquote>`,
    },
    {
      id: 'text-basic',
      label: 'Text Section',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,6V8H3V6H21M3,18H12V16H3V18M3,13H21V11H3V13Z" /></svg>`,
      content: `<section class="bdg-sect"><h1 class="heading">Insert title here</h1><p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></section>`,
    },
    {
      id: 'image',
      label: 'Image',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM5 5h14v8l-4-4-6 6-4-4v8z"/></svg>`,
      content: { type: 'image', activeOnRender: 1 },
    },
    {
      id: 'button',
      label: 'Button',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5,9H19V15H5V9Z" /></svg>`,
      content: `<button class="btn">Click me</button>`,
    },
    {
      id: 'divider',
      label: 'Divider',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h18v-2H3v2z" /></svg>`,
      content: `<hr style="margin: 10px 0;" />`,
    },
    {
      id: 'section',
      label: 'Section',
      media: `<svg viewBox="0 0 24 24"><rect width="24" height="24" fill="currentColor"/></svg>`,
      content: `<section style="padding:40px 0;background:#f5f5f5;"><div class="container">Section content …</div></section>`,
    },
    {
      id: 'container',
      label: 'Container',
      media: `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" fill="currentColor"/></svg>`,
      content: `<div class="container" style="max-width:1200px;margin:auto;padding:0 15px;">Content …</div>`,
    },
    {
      id: 'grid',
      label: 'Grid',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h6v6H3V3m6 6h6V3h-6v6m6 6h6v-6h-6v6m-6 0H3v6h6v-6m6 0v6h6v-6h-6z"/></svg>`,
      content: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;"><div>Item 1</div><div>Item 2</div><div>Item 3</div></div>`,
    },
    {
      id: 'accordion',
      label: 'Accordion',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/></svg>`,
      content: `<div class="accordion"><div><h3>Title 1</h3><div>Content 1</div></div><div><h3>Title 2</h3><div>Content 2</div></div></div>`,
    },
    {
      id: 'tabs',
      label: 'Tabs',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 6h16v2H4V6m0 5h10v2H4v-2m0 5h7v2H4v-2z" /></svg>`,
      content: `<div class="tabs"><ul class="tab-list"><li>Tab1</li><li>Tab2</li></ul><div class="tab-content">Content here</div></div>`,
    },
    {
      id: 'card',
      label: 'Card',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v16H4z"/></svg>`,
      content: `<div class="card" style="border:1px solid #ccc;padding:15px;"><img src="" alt="Image" style="width:100%;"/><h3>Card Title</h3><p>Description</p><button class="btn">Learn More</button></div>`,
    },
    {
      id: 'hero',
      label: 'Hero',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l4 20H8l4-20z"/></svg>`,
      content: `<section class="hero" style="padding:60px;text-align:center;background:#eee;"><h1>Main Heading</h1><p>Subtext …</p><button class="btn">Call to Action</button></section>`,
    },
    {
      id: 'testimonial',
      label: 'Testimonial',
      media: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>`,
      content: `<div class="testimonial" style="text-align:center;"><img src="" alt="Avatar" style="width:80px;border-radius:50%;" /><blockquote>“Great service!”</blockquote><p>- Customer</p></div>`,
    },
    {
      id: 'pricing-table',
      label: 'Pricing Table',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18v2H3V5m0 4h18v2H3V9m0 4h18v6H3v-6z"/></svg>`,
      content: `<div class="pricing" style="display:flex;gap:20px;"><div class="plan"><h3>Basic</h3><p>$10/mo</p></div><div class="plan"><h3>Pro</h3><p>$20/mo</p></div></div>`,
    },
    {
      id: 'feature-box',
      label: 'Feature Box',
      media: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>`,
      content: `<div class="feature" style="text-align:center;"><svg>…icon…</svg><h4>Feature</h4><p>Description</p></div>`,
    },
    {
      id: 'countdown',
      label: 'Countdown',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 20c4.42 0 8-3.58 8-8s-3.58-8-8-8v8l-5 5z"/></svg>`,
      content: `<div class="countdown" data-count="2025-12-31T00:00:00">Countdown here</div>`,
    },
    {
      id: 'progress-bar',
      label: 'Progress Bar',
      media: `<svg viewBox="0 0 24 24"><rect width="24" height="4" y="10" fill="currentColor"/></svg>`,
      content: `<div style="background:#eee;width:100%;height:20px;"><div style="background:#007bff;width:60%;height:100%;"></div></div>`,
    },
    {
      id: 'carousel',
      label: 'Image Carousel',
      media: `<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>`,
      content: `<div class="carousel">Slide 1 <img src="" /><br/>Slide 2 <img src="" /></div>`,
    },
    {
      id: 'badge',
      label: 'Badge',
      media: `<svg viewBox="0 0 24 24"><rect width="10" height="4" x="7" y="10" fill="currentColor"/></svg>`,
      content: `<span class="badge" style="background:#28a745;color:#fff;padding:2px 6px;border-radius:3px;">New</span>`,
    },
    {
      id: 'map',
      label: 'Map',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/></svg>`,
      content: `<iframe src="https://maps.google.com/..." style="width:100%;height:300px;" frameborder="0"></iframe>`,
    },
    {
      id: 'social-share',
      label: 'Social Share',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77l-7.1-4.13c.05-.25.06-.5.06-.77s-.02-.52-.06-.77l7.1-4.13A2.99 2.99 0 0 0 18 7.92c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .27.04.53.1.78L7.91 9.53A3 3 0 0 0 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.65 0 1.24-.21 1.72-.56l7.12 4.15c-.06.23-.09.47-.09.72 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>`,
      content: `<div class="social-share"><a href="#" title="Share on Twitter">Tw</a><a href="#" title="Share on Facebook">Fb</a></div>`,
    },
    {
      id: 'chat-widget',
      label: 'Chat Widget',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c-5 0-9 3.58-9 8 0 2.39 1.19 4.53 3.1 6.03L5 21l3.71-1.84C9.78 19.69 10.87 20 12 20c5 0 9-3.58 9-8s-4-8-9-8z"/></svg>`,
      content: `<div class="chat-widget" data-chat="init"></div>`,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 10h5v5H7z"/><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.11-.9-2-2-2zm0 16H5V9h14v11z"/></svg>`,
      content: `<iframe src="https://calendar.google.com/..."></iframe>`,
    },
    {
      id: 'login-form',
      label: 'Login Form',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 17v-1H3v-2h7v-1l4 2-4 2zM20 3H4a1 1 0 0 0-1 1v6h2V5h14v14H5v-5H3v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"/></svg>`,
      content: `<form><label>Email<input type="email"/></label><label>Password<input type="password"/></label><button type="submit">Login</button></form>`,
    }, {
      id: 'video',
      label: 'Video Embed',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 16.5l6-4.5-6-4.5v9z"/></svg>`,
      content: `<div class="video-container"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe></div>`,
    },
    {
      id: 'audio',
      label: 'Audio Player',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3v18c-4.97 0-9-2.24-9-5V8c0-2.76 4.03-5 9-5z"/></svg>`,
      content: `<audio controls src="https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3"></audio>`,
    },
    {
      id: 'newsletter',
      label: 'Newsletter Signup',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v4H4zM4 10h16v10H4z"/></svg>`,
      content: `
        <form class="newsletter">
          <h3>Subscribe</h3>
          <input type="email" placeholder="Email address" required />
          <button type="submit">Subscribe</button>
        </form>`,
    },
    {
      id: 'faq',
      label: 'FAQ Section',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm1.07-7.75l-.9.92a1.49 1.49 0 00-.37.68c-.07.25-.07.5-.07 1h-2v-.5c0-.99.14-1.56.5-2.07l1.2-1.26A1.5 1.5 0 0113 7.5c.83 0 1.5.67 1.5 1.5 0 .83-.67 1.5-1.5 1.5h-.5v2h.5c1.38 0 2.5-1.12 2.5-2.5 0-1.12-.67-1.75-1.43-1.75z"/></svg>`,
      content: `
        <section class="faq">
          <h2>FAQ</h2>
          <div class="item"><h3>Question 1?</h3><p>Answer 1.</p></div>
          <div class="item"><h3>Question 2?</h3><p>Answer 2.</p></div>
        </section>`,
    },
    {
      id: 'stats-counter',
      label: 'Statistics Counter',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 14h4v4H4v-4zm6-6h4v10h-4V8zm6 2h4v8h-4v-8z"/></svg>`,
      content: `
        <div class="stats">
          <div class="stat"><span>1200+</span><p>Users</p></div>
          <div class="stat"><span>85%</span><p>Rate</p></div>
          <div class="stat"><span>50+</span><p>Projects</p></div>
        </div>`,
    },
    {
      id: 'pop-up-modal',
      label: 'Popup Modal',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 3h14v2H5zM5 19h14v2H5zM5 7h14v10H5z"/></svg>`,
      content: `
        <button class="open-modal">Open Modal</button>
        <div class="modal" style="display:none;">
          <div class="modal-content">
            <span class="close">&times;</span>
            <p>Modal body text here.</p>
          </div>
        </div>
        <script>
          const btn = document.querySelector('.open-modal');
          const modal = document.querySelector('.modal');
          const close = document.querySelector('.close');
          btn.onclick = () => modal.style.display = 'block';
          close.onclick = () => modal.style.display = 'none';
        </script>`,
    },
    {
      id: 'alert-box',
      label: 'Alert Box',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l11 19H1L12 2z"/></svg>`,
      content: `<div class="alert alert-warning">⚠️ This is an alert message.</div>`,
    },
    {
      id: 'faq-accordion',
      label: 'FAQ Accordion',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z"/></svg>`,
      content: `
        <div class="faq-acc">
          <div><button>Q1: What is X?</button><div>A: Explanation...</div></div>
          <div><button>Q2: How to Y?</button><div>A: Steps...</div></div>
        </div>
        <script>
          document.querySelectorAll('.faq-acc button').forEach(btn =>
            btn.addEventListener('click', () => {
              const panel = btn.nextElementSibling;
              panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
            })
          );
        </script>`,
    },
    {
      id: 'count-up',
      label: 'Count-Up Number',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 20V4"/></svg>`,
      content: `
        <div class="count-up" data-target="3000">0</div>
        <script>
          const el = document.querySelector('.count-up');
          let start = 0, target = +el.dataset.target;
          const inc = target/200;
          const run = () => {
            start += inc;
            el.textContent = Math.ceil(start);
            start < target && requestAnimationFrame(run);
          };
          run();
        </script>`,
    },
    {
      id: 'rating-stars',
      label: 'Rating Stars',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.45-6.24L22 9.24l-6.42-.56L12 3 8.42 8.68 2 9.24l5.27 5.52L5.82 21z"/></svg>`,
      content: `
        <div class="rating">
          ⭐⭐⭐⭐☆
        </div>`,
    },
    {
      id: 'testimonial-slider',
      label: 'Testimonial Slider',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 20h12v-2H6v2zm0-4h12v-2H6v2zm0-4h12v-2H6v2z"/></svg>`,
      content: `
        <div class="test-slider">
          <div class="slide active">“Great!” – A</div>
          <div class="slide">“Awesome!” – B</div>
          <button class="prev">‹</button><button class="next">›</button>
        </div>
        <script>
          let idx=0;
          const slides = document.querySelectorAll('.test-slider .slide');
          document.querySelector('.next').onclick = () => {
            slides[idx].classList.remove('active');
            idx = (idx+1)%slides.length;
            slides[idx].classList.add('active');
          };
          document.querySelector('.prev').onclick = () => {
            slides[idx].classList.remove('active');
            idx = (idx-1+slides.length)%slides.length;
            slides[idx].classList.add('active');
          };
        </script>`,
    },
    {
      id: 'scroll-to-top',
      label: 'Scroll to Top',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8-8 8z"/></svg>`,
      content: `
        <button id="topBtn" style="display:none;position:fixed;bottom:20px;right:20px;">↑</button>
        <script>
          const btn = document.getElementById('topBtn');
          window.onscroll = () => btn.style.display = window.pageYOffset>200?'block':'none';
          btn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
        </script>`,
    },
    {
      id: 'newsletter-modal',
      label: 'Newsletter Modal',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v4H4zM4 10h16v10H4z"/></svg>`,
      content: `
        <div class="newsletter-modal" style="display:flex;justify-content:center;align-items:center;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);">
          <div style="background:#fff;padding:20px;max-width:400px;width:100%;">
            <h3>Subscribe Now</h3>
            <form><input type="email" placeholder="Email"/>
              <button>Join</button></form>
            <span class="close-modal" style="cursor:pointer;">✖️</span>
          </div>
        </div>
        <script>
          document.querySelector('.close-modal').onclick = e => e.target.closest('.newsletter-modal').style.display='none';
        </script>`,
    },
    {
      id: 'image-hover-overlay',
      label: 'Image Hover Overlay',
      media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 5h14v14H5z"/></svg>`,
      content: `
        <div class="hover-overlay" style="position:relative;display:inline-block;">
          <img src="" alt="hover effect" />
          <div class="overlay" style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);color:#fff;display:flex;justify-content:center;align-items:center;opacity:0;transition:.3s;">
            Overlay Text
          </div>
        </div>
        <style>
          .hover-overlay:hover .overlay{ opacity:1; }
        </style>`,
    },
  ];

  customBlocks.forEach((block) => BlockManager.add(block.id, block));
};

export default plugin;
