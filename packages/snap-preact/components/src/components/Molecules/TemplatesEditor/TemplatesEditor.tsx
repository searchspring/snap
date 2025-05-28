// import { h } from 'preact';

// import { css, Global } from '@emotion/react';
// import classnames from 'classnames';
// import { useState } from 'preact/hooks';
// import { ComponentProps, RootNodeProperties } from '../../../types';
// import { ChromePicker } from 'react-color';
// import { Icon } from '../../Atoms/Icon/Icon';
// import { Button } from '../../Atoms/Button';
// import { observer } from 'mobx-react-lite';
// import { debounce } from '@searchspring/snap-toolbox';
// import { CacheProvider, StoreProvider } from '../../../providers';
// import { GLOBAL_THEME_NAME, TargetStore } from '../../../../../src/Templates/Stores/TargetStore';
// import { TemplateEditorStore } from '../../../../../src/Templates/Stores/TemplateEditorStore';
// import { RecsTemplateTypes, TargetMap, TemplatesStore, TemplateThemeTypes } from '../../../../../src/Templates/Stores/TemplateStore';
// import { CurrencyCodes, LanguageCodes } from '../../../../../src/Templates/Stores/LibraryStore';

// const CSS = {
// 	ColorDisplay: ({ color, isColorPickerVisible }: any) =>
// 		css({
// 			backgroundColor: color,
// 			border: isColorPickerVisible ? '1px solid black' : '',
// 		}),
// 	TemplatesEditor: ({ }: Partial<TemplatesEditorProps>) =>
// 		css({
// 			display: 'flex',
// 			flexDirection: 'column',
// 			minWidth: '400px',
// 			overflow: 'hidden',
// 			fontSize: '14px',
// 			position: 'fixed',
// 			zIndex: '10003',
// 			cursor: 'auto',
// 			top: '10px',
// 			right: 0,
// 			background: 'white',
// 			padding: '10px',
// 			color: '#333',
// 			border: '1px solid #ccc',
// 			borderRight: 0,
// 			borderTopLeftRadius: '5px',
// 			borderBottomLeftRadius: '5px',
// 			boxShadow: 'rgba(81, 81, 81, 0.5) 1px 1px 3px 0px',
// 			transition: 'right ease 0.5s, height ease 0.5s 0.5s',
// 			boxSizing: 'border-box',
// 			height: 'calc(80vh - 10px - 10px)',

// 			'*': {
// 				boxSizing: 'border-box',
// 			},

// 			'>header': {
// 				height: '50px',
// 				display: 'flex',
// 				alignItems: 'center',
// 				justifyContent: 'space-between',
// 				marginBottom: '10px',
// 				'.athos-logo': {
// 					maxWidth: '100%',
// 					width: '200px',
// 					'.cls-1': {
// 						fill: '#00aeef',
// 					},

// 					'.cls-2': {
// 						fill: '#1d4990'
// 					}
// 				},
// 			},
// 			'>aside': {
// 				flexGrow: 1,
// 				border: '1px solid gray',
// 				'.tab-selection': {
// 					display: 'flex',
// 					justifyContent: 'center',
// 					alignItems: 'center',
// 					gap: '10px',
// 					borderBottom: '2px solid #ccc',
// 					'.tab': {
// 						backgroundColor: '#ccc',
// 						border: '1px solid #ccc',
// 						borderBottom: 'none',
// 						padding: '10px 20px',
// 						height: '100%',
// 						color: '#999',
// 						cursor: 'pointer',
// 						'&.active': {
// 							backgroundColor: '#fff',
// 							color: '#000',
// 						}
// 					},

// 				}
// 			},
// 			'>footer': {
// 				borderTop: '1px solid #ccc',
// 				marginTop: '10px',
// 			},

// 			'&.ss__template-editor--collapsed': {
// 				right: '-353px',
// 				transition: 'right ease 0.5s 0.5s, height ease 0.5s',
// 				height: '50px',
// 				cursor: 'pointer',
// 			},

// 			'& input, select, option, optgroup, button, h1, h2, h3, h4, h5, h6, i': {
// 				all: 'revert',
// 			},

// 			'& h1': { fontSize: '20px' },
// 			'& h2': { fontSize: '18px' },
// 			'& h3': { fontSize: '16px' },
// 			'& h4': { fontSize: '14px' },
// 			'& h5': { fontSize: '12px' },
// 			'& h6': { fontSize: '10px' },

// 		}),
// };

// export const TemplatesEditor = observer((properties: TemplatesEditorProps): JSX.Element => {
// 	const { onRemoveClick, templatesStore, editorStore } = properties;
// 	const searchTargets = Object.keys(templatesStore.targets.search || {}).map((target) => ({
// 		type: 'search',
// 		target,
// 		template: templatesStore.targets.search[target],
// 		selector: templatesStore.targets.search[target].selector,
// 	}));
// 	const autocompleteTargets = Object.keys(templatesStore.targets.autocomplete || {}).map((target) => ({
// 		type: 'autocomplete',
// 		target,
// 		template: templatesStore.targets.autocomplete[target],
// 		selector: templatesStore.targets.autocomplete[target].selector,
// 	}));
// 	const recommendationBundleTargets = Object.keys(templatesStore.targets.recommendation.bundle || {}).map((target) => ({
// 		type: 'recommendation/bundle',
// 		target,
// 		template: templatesStore.targets.recommendation.bundle[target],
// 		selector: templatesStore.targets.recommendation.bundle[target].selector,
// 	}));
// 	const recommendationDefaultTargets = Object.keys(templatesStore.targets.recommendation.default || {}).map((target) => ({
// 		type: 'recommendation/default',
// 		target,
// 		template: templatesStore.targets.recommendation.default[target],
// 		selector: templatesStore.targets.recommendation.default[target].selector,
// 	}));
// 	const recommendationEmailTargets = Object.keys(templatesStore.targets.recommendation.email || {}).map((target) => ({
// 		type: 'recommendation/email',
// 		target,
// 		template: templatesStore.targets.recommendation.email[target],
// 		selector: templatesStore.targets.recommendation.email[target].selector,
// 	}));
// 	const targets = [
// 		...searchTargets,
// 		...autocompleteTargets,
// 		...recommendationBundleTargets,
// 		...recommendationDefaultTargets,
// 		...recommendationEmailTargets,
// 	];

// 	const [collapsed, setCollapsed] = useState(false);
// 	const [selectedTarget, changeTargetSelection] = useState(targets[0]);
// 	const [selectedLanguage, changeLanguage] = useState(templatesStore.language);
// 	const [selectedCurrency, changeCurrency] = useState(templatesStore.currency);

// 	const styling: RootNodeProperties = {
// 		css: [CSS.TemplatesEditor({ ...properties })],
// 	};

// 	const { library } = templatesStore;
// 	const { languages, currencies } = library.locales;
// 	const languageKeys = Object.keys(languages);
// 	const currencyKeys = Object.keys(currencies);
// 	const libraryThemes = Object.keys(templatesStore.themes.library || {});
// 	const lcoalThemes = Object.keys(templatesStore.themes.local || {}).sort((a, b) => {
// 		if (a === GLOBAL_THEME_NAME) return -1;
// 		if (b === GLOBAL_THEME_NAME) return 1;
// 		return 0;
// 	});
// 	// const selectedTargetConfig = templatesStore.getTarget(selectedTarget.type, selectedTarget.target);

// 	const themeRef = templatesStore.themes[selectedTarget.template.theme.location][selectedTarget.template.theme.name];
// 	const theme = themeRef.theme;

// 	const setOverride = debounce((obj: { themeName: string; path: string[]; rootEditingKey: string; value: string }) => {
// 		themeRef.setOverride(obj);
// 	}, 10);

// 	const [isColorPickerVisible, setColorPickerVisible] = useState(false);

// 	return (
// 		<CacheProvider>
// 			<div
// 				className={classnames('ss__template-editor', { 'ss__template-editor--collapsed': collapsed })}
// 				{...styling}
// 				onClick={(e) => {
// 					e.preventDefault();
// 					e.stopPropagation();
// 					setCollapsed(false);

// 					if (isColorPickerVisible && !(e.target as HTMLDivElement).className.includes('color-preview')) {
// 						setColorPickerVisible(false);
// 					}
// 				}}
// 			>
// 				<header>
// 					<div className={'logo'}>
// 						<svg id="Layer_2" className="athos-logo" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 271.84 40">
// 							<g id="Layer_1-2" data-name="Layer 1">
// 								<g>
// 									<g>
// 										<g>
// 											<path className="cls-2" d="M50.86,18.26c.58-1.16,1.37-2.05,2.37-2.67,1-.62,2.11-.94,3.34-.94,1.05,0,1.97.21,2.77.64.79.43,1.4.99,1.83,1.68v-2.11h4.57v14.92h-4.57v-2.11c-.45.69-1.07,1.26-1.86,1.68-.79.43-1.72.64-2.77.64-1.21,0-2.32-.32-3.31-.95-1-.63-1.79-1.53-2.37-2.7s-.87-2.52-.87-4.05.29-2.88.87-4.04ZM60.22,19.62c-.63-.66-1.4-.99-2.3-.99-.66,0-1.31.2-1.85.58-.95.66-1.42,1.69-1.42,3.09,0,1.14.32,2.05.95,2.71.78.82,1.77,1.14,2.96.95.2-.03.41-.1.6-.19,1.34-.64,2.01-1.79,2.01-3.45,0-1.14-.32-2.04-.95-2.7Z" />
// 											<path className="cls-2" d="M77.07,25.91v3.88h-2.33c-1.66,0-2.95-.41-3.88-1.22s-1.39-2.13-1.39-3.97v-5.94h-1.82v-3.8h1.82v-3.64h4.57v3.64h2.99v3.8h-2.99v5.99c0,.45.11.77.32.96s.57.29,1.07.29h1.63Z" />
// 											<path className="cls-2" d="M92.29,16.4c1.03,1.13,1.55,2.69,1.55,4.66v8.72h-4.55v-8.1c0-1-.26-1.77-.78-2.33s-1.21-.83-2.08-.83-1.57.28-2.08.83c-.52.55-.78,1.33-.78,2.33v8.1h-4.57V10h4.57v6.87c.46-.66,1.1-1.19,1.9-1.58.8-.39,1.7-.59,2.7-.59,1.71,0,3.08.57,4.12,1.7Z" />
// 											<path className="cls-2" d="M99.47,29.06c-1.17-.62-2.08-1.52-2.75-2.67-.67-1.16-1-2.51-1-4.06s.34-2.88,1.02-4.05c.68-1.17,1.6-2.06,2.78-2.69s2.49-.94,3.96-.94,2.78.31,3.96.94,2.1,1.52,2.78,2.69c.68,1.17,1.02,2.52,1.02,4.05s-.34,2.88-1.03,4.05c-.69,1.17-1.62,2.06-2.81,2.69-1.19.62-2.51.94-3.97.94s-2.78-.31-3.94-.94ZM105.65,25.08c.61-.64.92-1.56.92-2.75s-.3-2.11-.9-2.75c-.6-.64-1.33-.96-2.21-.96s-1.63.32-2.22.95c-.59.63-.88,1.56-.88,2.77s.29,2.11.87,2.75c.58.64,1.31.96,2.18.96s1.62-.32,2.23-.96Z" />
// 											<path className="cls-2" d="M116.45,29.33c-1.02-.45-1.82-1.06-2.41-1.83-.59-.78-.92-1.65-.99-2.61h4.52c.05.52.3.94.72,1.26.43.32.95.48,1.58.48.57,0,1.01-.11,1.32-.33.31-.22.47-.51.47-.87,0-.43-.22-.74-.67-.95-.45-.2-1.17-.43-2.17-.68-1.07-.25-1.96-.51-2.67-.79-.71-.28-1.33-.71-1.84-1.31-.52-.6-.78-1.4-.78-2.42,0-.86.24-1.63.71-2.34.47-.7,1.17-1.26,2.09-1.67s2.01-.61,3.28-.61c1.87,0,3.35.46,4.42,1.39s1.7,2.16,1.86,3.69h-4.22c-.07-.52-.3-.93-.68-1.23-.38-.3-.89-.45-1.51-.45-.53,0-.95.1-1.23.31s-.43.49-.43.84c0,.43.23.75.68.96s1.16.43,2.13.64c1.1.29,2.01.57,2.7.84.7.28,1.31.72,1.83,1.34s.8,1.44.82,2.47c0,.87-.25,1.65-.74,2.34-.49.69-1.19,1.23-2.11,1.62-.92.39-1.98.59-3.2.59-1.3,0-2.46-.22-3.48-.67Z" />
// 										</g>
// 										<g>
// 											<path className="cls-1" d="M133.64,18.4c.61-1.14,1.46-2.02,2.54-2.65,1.08-.62,2.31-.93,3.7-.93,1.82,0,3.32.45,4.49,1.35,1.18.9,1.94,2.12,2.28,3.67h-2.02c-.25-1.06-.8-1.9-1.63-2.5-.84-.6-1.88-.9-3.12-.9-.99,0-1.88.22-2.67.67s-1.42,1.12-1.88,2.01c-.46.89-.69,1.99-.69,3.28s.23,2.39.69,3.29,1.08,1.58,1.88,2.02c.79.45,1.68.68,2.67.68,1.24,0,2.28-.3,3.12-.91.84-.6,1.38-1.44,1.63-2.52h2.02c-.34,1.51-1.11,2.73-2.29,3.64-1.19.92-2.68,1.38-4.48,1.38-1.39,0-2.62-.31-3.7-.93s-1.93-1.5-2.54-2.65c-.61-1.14-.92-2.48-.92-4.01s.31-2.87.92-4.01Z" />
// 											<path className="cls-1" d="M152.31,29.07c-1.11-.62-1.98-1.5-2.62-2.65-.64-1.14-.96-2.48-.96-4.01s.32-2.87.97-4.01,1.53-2.02,2.65-2.65c1.12-.62,2.37-.93,3.75-.93s2.64.31,3.77.93c1.12.62,2.01,1.5,2.65,2.65.64,1.14.96,2.48.96,4.01s-.32,2.84-.97,4c-.65,1.15-1.54,2.04-2.67,2.66-1.13.62-2.39.93-3.78.93s-2.63-.31-3.74-.93ZM158.75,27.69c.83-.44,1.5-1.11,2.01-2,.51-.89.77-1.98.77-3.28s-.25-2.39-.76-3.28-1.17-1.56-2-2c-.83-.44-1.73-.66-2.7-.66s-1.87.22-2.7.66-1.49,1.11-1.99,2c-.49.89-.74,1.99-.74,3.28s.25,2.39.74,3.28c.5.89,1.15,1.56,1.97,2,.82.44,1.72.66,2.69.66s1.87-.22,2.7-.66Z" />
// 											<path className="cls-1" d="M187.32,16.41c1.09,1.09,1.63,2.67,1.63,4.74v8.64h-1.86v-8.42c0-1.6-.39-2.83-1.16-3.67-.77-.85-1.83-1.27-3.16-1.27s-2.49.46-3.32,1.38c-.83.92-1.24,2.25-1.24,4v7.99h-1.86v-8.42c0-1.6-.39-2.83-1.16-3.67-.77-.85-1.84-1.27-3.19-1.27s-2.49.46-3.32,1.38c-.83.92-1.24,2.25-1.24,4v7.99h-1.89v-14.74h1.89v2.54c.47-.92,1.13-1.61,2-2.09.86-.48,1.83-.72,2.89-.72,1.28,0,2.4.31,3.36.92.96.61,1.66,1.51,2.09,2.7.4-1.17,1.07-2.06,2.04-2.69s2.06-.93,3.28-.93c1.73,0,3.14.55,4.23,1.63Z" />
// 											<path className="cls-1" d="M212.8,16.41c1.09,1.09,1.63,2.67,1.63,4.74v8.64h-1.86v-8.42c0-1.6-.39-2.83-1.16-3.67-.77-.85-1.83-1.27-3.16-1.27s-2.49.46-3.32,1.38c-.83.92-1.24,2.25-1.24,4v7.99h-1.86v-8.42c0-1.6-.39-2.83-1.16-3.67-.77-.85-1.84-1.27-3.19-1.27s-2.49.46-3.32,1.38c-.83.92-1.24,2.25-1.24,4v7.99h-1.89v-14.74h1.89v2.54c.47-.92,1.13-1.61,2-2.09.86-.48,1.83-.72,2.89-.72,1.28,0,2.4.31,3.36.92.96.61,1.66,1.51,2.09,2.7.4-1.17,1.07-2.06,2.04-2.69s2.06-.93,3.28-.93c1.73,0,3.14.55,4.23,1.63Z" />
// 											<path className="cls-1" d="M230.57,23.14h-12.23c.05,1.12.32,2.07.81,2.86s1.12,1.39,1.92,1.8c.79.4,1.66.61,2.59.61,1.22,0,2.26-.3,3.09-.89s1.39-1.39,1.66-2.4h2c-.36,1.44-1.13,2.62-2.31,3.52s-2.66,1.36-4.44,1.36c-1.39,0-2.63-.31-3.73-.93-1.1-.62-1.96-1.5-2.58-2.65-.62-1.14-.93-2.48-.93-4.01s.31-2.87.92-4.02c.61-1.15,1.47-2.03,2.56-2.65s2.35-.92,3.75-.92,2.63.31,3.69.92c1.05.61,1.86,1.44,2.43,2.47.57,1.04.85,2.18.85,3.44,0,.65-.02,1.14-.05,1.48ZM228.05,18.79c-.46-.77-1.09-1.36-1.88-1.76-.79-.4-1.66-.59-2.59-.59-1.4,0-2.6.45-3.59,1.35-.99.9-1.54,2.17-1.65,3.81h10.37c.02-1.1-.2-2.03-.66-2.81Z" />
// 											<path className="cls-1" d="M236.49,15.53c.85-.5,1.9-.76,3.15-.76v1.97h-.51c-1.37,0-2.47.37-3.29,1.11-.83.74-1.24,1.97-1.24,3.7v8.23h-1.89v-14.74h1.89v2.62c.41-.92,1.05-1.63,1.9-2.13Z" />
// 											<path className="cls-1" d="M242.55,18.4c.61-1.14,1.46-2.02,2.54-2.65s2.31-.93,3.7-.93c1.82,0,3.32.45,4.49,1.35,1.18.9,1.94,2.12,2.28,3.67h-2.02c-.25-1.06-.8-1.9-1.63-2.5-.84-.6-1.88-.9-3.12-.9-.99,0-1.88.22-2.67.67s-1.42,1.12-1.88,2.01c-.46.89-.69,1.99-.69,3.28s.23,2.39.69,3.29,1.08,1.58,1.88,2.02c.79.45,1.68.68,2.67.68,1.24,0,2.28-.3,3.12-.91.84-.6,1.38-1.44,1.63-2.52h2.02c-.34,1.51-1.11,2.73-2.29,3.64-1.19.92-2.68,1.38-4.48,1.38-1.39,0-2.62-.31-3.7-.93s-1.93-1.5-2.54-2.65c-.61-1.14-.92-2.48-.92-4.01s.31-2.87.92-4.01Z" />
// 											<path className="cls-1" d="M271.79,23.14h-12.23c.05,1.12.32,2.07.81,2.86.49.79,1.12,1.39,1.92,1.8.79.4,1.66.61,2.59.61,1.22,0,2.25-.3,3.09-.89.84-.59,1.39-1.39,1.66-2.4h2c-.36,1.44-1.13,2.62-2.31,3.52-1.18.91-2.66,1.36-4.44,1.36-1.39,0-2.63-.31-3.73-.93s-1.96-1.5-2.58-2.65c-.62-1.14-.93-2.48-.93-4.01s.31-2.87.92-4.02c.61-1.15,1.47-2.03,2.57-2.65s2.35-.92,3.75-.92,2.63.31,3.68.92c1.05.61,1.86,1.44,2.43,2.47.57,1.04.85,2.18.85,3.44,0,.65-.02,1.14-.05,1.48ZM269.26,18.79c-.46-.77-1.09-1.36-1.88-1.76-.79-.4-1.66-.59-2.59-.59-1.4,0-2.6.45-3.59,1.35s-1.54,2.17-1.65,3.81h10.37c.02-1.1-.2-2.03-.66-2.81Z" />
// 										</g>
// 									</g>
// 									<g>
// 										<path className="cls-2" d="M40,13.34c0,2.87-2.1,5.2-4.7,5.2h-10.42c-3.66,0-5.9-4.42-4.02-7.9l4.37-8.11c.86-1.57,2.37-2.53,4.02-2.53h6.03c2.59,0,4.7,2.34,4.7,5.2l.02,8.14Z" />
// 										<path className="cls-1" d="M40,34.79c0,2.87-2.1,5.2-4.7,5.2h-10.42c-3.66,0-5.9-4.42-4.02-7.9l4.37-8.11c.86-1.57,2.37-2.53,4.02-2.53h6.03c2.59,0,4.7,2.34,4.7,5.2l.02,8.14Z" />
// 										<path className="cls-1" d="M0,5.2C0,2.34,2.1,0,4.7,0h10.42c3.66,0,5.9,4.42,4.02,7.9l-4.37,8.11c-.86,1.57-2.37,2.53-4.02,2.53h-6.03C2.12,18.54.02,16.21.02,13.34l-.02-8.14Z" />
// 										<path className="cls-2" d="M0,26.66c0-2.87,2.1-5.2,4.7-5.2h10.42c3.66,0,5.9,4.42,4.02,7.9l-4.37,8.11c-.86,1.57-2.37,2.53-4.02,2.53h-6.03C2.12,40,.02,37.66.02,34.8l-.02-8.14Z" />
// 									</g>
// 								</g>
// 							</g>
// 						</svg>
// 					</div>

// 					<div
// 						className={'header-actions'}
// 						onClick={(e) => {
// 							e.preventDefault();
// 							e.stopPropagation();
// 							setCollapsed(true);
// 						}}
// 					>
// 						<Button
// 							onClick={() => {
// 								onRemoveClick();
// 							}}
// 						>
// 							Stop Editing
// 						</Button>
// 						<span
// 							onClick={() => {
// 								setCollapsed(true);
// 							}}
// 						>
// 							<Icon icon="close-thin" />
// 						</span>
// 					</div>

// 				</header>

// 				<aside>
// 					<div className='tab-selection'>
// 						{editorStore.tabs.map((tab, i) => {
// 							return (
// 								<div key={i}
// 									className={classnames('tab', { active: editorStore.activeTab === tab })}
// 									onClick={() => {
// 										editorStore.switchTabs(tab);
// 									}}
// 								>{tab}</div>
// 							)
// 						})}
// 					</div>
// 					{editorStore.activeTab === 'Templates' ? (
// 						<div>
// 							Template stuff goes here - we don't have everything to do this yet...
// 						</div>
// 					): ''}
// 					{editorStore.activeTab === 'Configuration' ? (
// 						<div>

// 							<div className="option">
// 								<label htmlFor="siteId">SiteId: </label>
// 								<input
// 									id="siteId"
// 									type="text"
// 									placeholder={'Enter the siteId from the Athos Console'}
// 									value={templatesStore.config.config.siteId}
// 									disabled
// 								/>
// 							</div>
// 							<div className="option">
// 								<label htmlFor="platform">Platform: </label>
// 								<select
// 									id="platform"
// 									value={templatesStore.config.config.platform}
// 									onChange={(e) => {}}
// 									disabled
// 								>
// 									{/* TODO: need better platform or get it from other place instead of library.plugins */}
// 									{Object.keys(templatesStore.library.import.plugins).map(plugin => plugin == 'common' ? 'other' : plugin).map((plugin, i) => {
// 										return (
// 											<option key={i} value={plugin}>{plugin}</option>
// 										)
// 									})}
// 								</select>
// 							</div>

// 							<div className="option">
// 								<label htmlFor="theme-select">Theme: </label>
// 								<select
// 									id="theme-select"
// 									onChange={(e) => {
// 										const { selectedIndex, options } = e.currentTarget;
// 										const selectedOption = options[selectedIndex];
// 										const selectedTheme = selectedOption.value;
// 										const type = selectedOption.closest('optgroup')?.label as TemplateThemeTypes;

// 										if (type) {

// 											/*
// 											templatesStore.targets = {
// 												search: TargetMap;
// 												autocomplete: TargetMap;
// 												recommendation: {
// 													[key in RecsTemplateTypes]: TargetMap;
// 												};

// 												type TargetMap = { [targetId: string]: TargetStore };
// 											}
// 											*/

// 											// loop through all targets in templateStore and call setTheme on them all
// 											// const target = templatesStore.getTarget(selectedTarget.type, selectedTarget.target);
// 											Object.keys(templatesStore.targets).forEach(feature => {
// 												// loop through all the features (search, autocomplete, recommendations)

// 												if(feature == 'recommendation') {
// 													const recommendationObj = templatesStore.targets[feature as keyof typeof templatesStore.targets] as {
// 														[key in RecsTemplateTypes]: TargetMap;
// 													}
// 													Object.keys(recommendationObj).forEach(recType => {
// 														const targetMap = recommendationObj[recType as keyof typeof recommendationObj];
// 														Object.keys(targetMap).forEach(target => {
// 															const targetStore = targetMap[target as keyof typeof targetMap] as TargetStore;
// 															targetStore.setTheme(selectedTheme, type)
// 														})
// 													})
// 												} else {
// 													const targetMap = templatesStore.targets[feature as keyof typeof templatesStore.targets];
// 												}

// 												// const featureSet = templatesStore.targets[feature as keyof typeof templatesStore.targets];
// 												// Object.keys(featureSet).forEach(target => {
// 												// 	// loop through all the targets

// 												// 	if(['bundle', 'default', 'email'].includes(target)) {

// 												// 		const targetMap = featureSet[target as keyof typeof featureSet] as TargetMap;
// 												// 		Object.keys(targetMap).forEach(targetName => {

// 												// 		});
// 												// 		// targetStore.setTheme(selectedTheme, type)
// 												// 	} else {
// 												// 		const targetStore = featureSet[target as keyof typeof featureSet] as TargetStore;
// 												// 		targetStore.setTheme(selectedTheme, type)
// 												// 	}
// 												// 	// {
// 												// 	// 	bundle: {},
// 												// 	// 	default: {},
// 												// 	// 	email:{},
// 												// 	// }

// 												// 	// console.log("targetStore", target, targetStore)
// 												// 	// targetStore.setTheme(selectedTheme, type)
// 												// })
// 											});
// 										}
// 									}}
// 								>
// 									<optgroup label="library">
// 										{Object.keys(templatesStore.themes.library).map((libraryTheme) => (
// 											<option>
// 												{libraryTheme}
// 											</option>
// 										))}
// 									</optgroup>
// 									<optgroup label="local">
// 										{Object.keys(templatesStore.themes.local).map((localTheme) => (
// 											<option
// 											// selected={templatesStore.targets.search['search'].theme.location === 'local' && templatesStore.targets.search['search'].theme.name === localTheme}
// 											>
// 												{localTheme}
// 											</option>
// 										))}
// 									</optgroup>
// 								</select>
// 							</div>

// 							<div className="option">
// 								<label htmlFor="language">Language: </label>
// 								<select
// 									id="language"
// 									value={templatesStore.language}
// 									onChange={(e) => {
// 										templatesStore.setLanguage(e.target.value as LanguageCodes)
// 									}}
// 								>
// 									{Object.keys(templatesStore.library.locales.languages).map((option, i) => {
// 										return (
// 											<option key={i} value={option}>{option}</option>
// 										)
// 									})}
// 								</select>
// 							</div>
// 							<div className="option">
// 								<label htmlFor="currency">Currency: </label>
// 								<select
// 									id="currency"
// 									value={templatesStore.currency}
// 									onChange={(e) => {
// 										templatesStore.setCurrency(e.target.value as CurrencyCodes)
// 									}}
// 								>
// 									{Object.keys(templatesStore.library.locales.currencies).map((option, i) => {
// 										return (
// 											<option key={i} value={option}>{option}</option>
// 										)
// 									})}
// 								</select>
// 							</div>

// 						</div>
// 					): ''}

// 				</aside>

// 				<footer>
// 					footer content here
// 				</footer>

// 			</div>

// 		</CacheProvider>
// 	);
// });

// export interface TemplatesEditorProps extends ComponentProps {
// 	onRemoveClick: () => void;
// 	templatesStore: TemplatesStore;
// 	editorStore: TemplateEditorStore;
// }
