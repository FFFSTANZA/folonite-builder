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

// FOLONITE-BRANDED GRAPESJS PLUGIN
const plugin: Plugin<PluginOptions> = (editor, opts: Partial<PluginOptions> = {}) => {
  const config: RequiredPluginOptions = {
    blocks: [
      'link-block',
      'quote',
      'text-basic',
      'image',
      'button',
      'divider',
      'grid-items',
      'text',
      'video',
      'map',
      'social-share',
      'navbar',
      'countdown',
      'form',
      'form-input',
      'form-textarea',
      'form-select',
      'form-checkbox',
      'form-radio',
      'form-button',
      'video',
      'audio',
      'newsletter',
      'faq',
      'stats-counter',
      'pop-up-modal',
      'alert-box',
      'faq-accordion',
      'count-up',
      'rating-stars',
      'testimonial-slider',
      'scroll-to-top',
      'newsletter-modal',
      'image-hover-overlay',
      'accordion',
      'tabs',
      'hero',
      'card',
      'testimonial',
      'pricing-table',
      'feature-box',
      'progress-bar',
      'carousel',
    ],
    block: () => ({}),
    modalImportTitle: 'Import',
    modalImportButton: 'Import',
    modalImportLabel: '',
    modalImportContent: '',
    importViewerOptions: {},
    textCleanCanvas: 'Are you sure you want to clear the canvas?',
    showStylesOnChange: true,
    useCustomTheme: true,
    ...opts,
  };

  // FOLONITE BRANDING COLORS
  if (config.useCustomTheme && typeof window !== 'undefined') {
    const folonitePrimary = '#3a0ca3';       // deep purple
    const foloniteSecondary = '#7209b7';     // vibrant violet
    const foloniteAccent = '#f72585';        // hot pink
    const foloniteBackground = '#f1f1f1';    // light background

    const prefix = 'gjs-';
    let cssString = '';

    [
      ['primary', folonitePrimary],
      ['secondary', foloniteSecondary],
      ['accent', foloniteAccent],
      ['bg', foloniteBackground],
    ].forEach(([name, color]) => {
      cssString += `
        .${prefix}${name}-bg { background-color: ${color}; }
        .${prefix}${name}-color { color: ${color}; }
        .${prefix}${name}-color-h:hover { color: ${color}; }
        .${prefix}${name}-border { border-color: ${color}; }
      `;
    });

    const style = document.createElement('style');
    style.setAttribute('data-brand', 'folonite');
    style.innerText = cssString;
    document.head.appendChild(style);
  }

  // Register core features
  blocks(editor, config);
  commands(editor, config);
  panels(editor, config);
};

export default plugin;
