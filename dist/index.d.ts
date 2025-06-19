import { Editor, Plugin } from 'grapesjs';

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
declare const plugin: Plugin<PluginOptions>;

export {
	plugin as default,
};

export {};
