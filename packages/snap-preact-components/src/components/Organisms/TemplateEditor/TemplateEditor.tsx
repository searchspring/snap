/** @jsx jsx */
import { h, Fragment } from 'preact';

import { jsx, css, Global } from '@emotion/react';
import classnames from 'classnames';
import { useState } from 'preact/hooks';
import { ComponentProps, StylingCSS } from '../../../types';
import { ChromePicker } from 'react-color';
import { Icon } from '../../Atoms/Icon/Icon';
import { Button } from '../../Atoms/Button';

const CSS = {
	ColorDisplay: ({ color, isColorPickerVisible }: any) =>
		css({
			backgroundColor: color,
			border: isColorPickerVisible ? '1px solid black' : '',
		}),
	TemplateEditor: ({}: Partial<TemplateEditorProps>) =>
		css({
			display: 'flex',
			flexDirection: 'column',
			minWidth: '420px',
			overflow: 'hidden',
			fontSize: '14px',
			position: 'fixed',
			zIndex: '9999',
			cursor: 'auto',
			top: '10px',
			right: 0,
			background: 'white',
			padding: '10px',
			color: '#333',
			border: '1px solid #ccc',
			borderRight: 0,
			borderTopLeftRadius: '5px',
			borderBottomLeftRadius: '5px',
			boxShadow: 'rgba(81, 81, 81, 0.5) 1px 1px 3px 0px',
			transition: 'height ease 0.2s, right ease 0.5s 0.2s',

			'&.collapsed': {
				right: '-400px',
				transition: 'height ease 0.5s 0.5s, right ease 0.5s',
				height: '33px',
				cursor: 'pointer',
			},

			'& .logo': {
				'& img': {
					display: 'inline-block',
					height: '30px',
					maxHeight: '30px',
					verticalAlign: 'middle',
				},
			},

			'& input, select, option, optgroup, button, h1, h2, h3, h4, h5, h6, i': {
				all: 'revert',
			},

			'& h1': { fontSize: '20px' },
			'& h2': { fontSize: '18px' },
			'& h3': { fontSize: '16px' },
			'& h4': { fontSize: '14px' },
			'& h5': { fontSize: '12px' },
			'& h6': { fontSize: '10px' },

			'& .header-actions': {
				cursor: 'pointer',
				position: 'absolute',
				right: 15,
				top: 15,

				'& .ss__button': {
					margin: '0 10px',
				},
			},

			'& .section': {
				marginBottom: '10px',
				fontSize: '14px',

				'& input + span': {
					marginLeft: '10px',
				},

				'& label': {
					width: '215px',
					display: 'inline-flex',
					marginRight: '5px',
				},

				'& .indent': {
					marginLeft: '15px',
					'& label': {
						width: '200px',
					},
				},

				'& .theme-editor': {
					padding: '5px 0',
					position: 'relative',

					'& .chrome-picker': {
						position: 'absolute',
						zIndex: 2,
						left: 'calc(225px / 2)',
						bottom: '35px',
					},
					'& .color-preview': {
						display: 'inline-flex',
						width: '40px',
						height: '20px',
						borderRadius: '3px',
						cursor: 'pointer',
						boxShadow: 'rgba(81, 81, 81, 0.5) 1px 1px 3px 0px',
						verticalAlign: 'middle',
					},
					'& .color-value': {
						display: 'inline-flex',
						padding: '0 10px',
					},
				},
			},
		}),
};

export const TemplateEditor = (properties: TemplateEditorProps): JSX.Element => {
	const { onRemoveClick, templateStore } = properties;
	const searchTemplates = Object.keys(templateStore.templates.search || {}).map((target) => ({
		type: 'search',
		target,
		template: templateStore.templates.search[target],
	}));
	const autocompleteTemplates = Object.keys(templateStore.templates.autocomplete || {}).map((target) => ({
		type: 'autocomplete',
		target,
		template: templateStore.templates.autocomplete[target],
	}));
	const recommendationTemplates = Object.keys(templateStore.templates.recommendation || {}).map((target) => ({
		type: 'recommendation',
		target,
		template: templateStore.templates.recommendation[target],
	}));
	const templates = [...searchTemplates, ...autocompleteTemplates, ...recommendationTemplates];
	if (templates.length === 0) {
		return <div>no themes found</div>;
	}

	const [collapsed, setCollapsed] = useState(false);
	const [selectedTarget, changeTargetSelection] = useState(templates[0]);
	const [selectedLanguage, changeLanguage] = useState(templateStore.language);
	const [selectedCurrency, changeCurrency] = useState(templateStore.currency);

	const styling: { css?: StylingCSS } = {
		css: [CSS.TemplateEditor({ ...properties })],
	};

	const { library } = templateStore;
	const { language, currency } = library.locales;
	const languages = Object.keys(language);
	const currencies = Object.keys(currency);
	const baseThemes = Object.keys(library.themes || {});
	const lcoalThemes = Object.keys(templateStore.themes || {}).sort((a, b) => {
		if (a === 'global') return -1;
		if (b === 'global') return 1;
		return 0;
	});

	const selectedTargetConfig = templateStore.config[selectedTarget.type].templates.find((template: any) => {
		if (selectedTarget.type === 'recommendation') {
			return template.component === selectedTarget.target;
		}
		return template.selector === selectedTarget.target;
	});

	const setThemeOverrides = (obj: { themeName: string; path: string[]; rootEditingKey: string; value: string }) => {
		templateStore.setThemeOverrides(obj);
		setThemes(templateStore.themes);
	};

	const [themes, setThemes] = useState(templateStore.themes);

	return (
		<div
			className={classnames('ss__template-editor', { collapsed: collapsed })}
			{...styling}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				setCollapsed(false);
			}}
		>
			<div className={'logo'}>
				<img src="https://snapui.searchspring.io/searchspring.svg" />
			</div>

			<div
				className={'header-actions'}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setCollapsed(true);
				}}
			>
				<Button
					onClick={() => {
						templateStore.storage.clear();
						onRemoveClick();
					}}
				>
					Stop Editing
				</Button>
				<span
					onClick={() => {
						setCollapsed(true);
					}}
				>
					<Icon icon="close-thin" />
				</span>
			</div>

			{!collapsed ? (
				<Global
					styles={css`
						${selectedTarget.target} {
							border: 1px dashed black !important;
						}
					`}
				/>
			) : (
				''
			)}

			<h2>Global</h2>
			<div className="section">
				<label htmlFor="language-select">Language: </label>
				<select
					id="language-select"
					onChange={(e) => {
						const { selectedIndex, options } = e.currentTarget;
						const selectedOption = options[selectedIndex];
						const language = selectedOption.value;

						changeLanguage(language);
						templateStore.changeLanguage(language);
					}}
				>
					{languages.map((language: string) => {
						return <option selected={language === selectedLanguage}>{language}</option>;
					})}
				</select>
			</div>

			<div className="section">
				<label htmlFor="currency-select">Currency: </label>
				<select
					id="currency-select"
					onChange={(e) => {
						const { selectedIndex, options } = e.currentTarget;
						const selectedOption = options[selectedIndex];
						const currency = selectedOption.value;

						changeCurrency(currency);
						templateStore.changeCurrency(currency);
					}}
				>
					{currencies.map((currency: string) => {
						return <option selected={currency === selectedCurrency}>{currency}</option>;
					})}
				</select>
			</div>

			<h2>Template</h2>
			<div className="section">
				<label htmlFor="target-select">Template Target: </label>
				<select
					id="target-select"
					onChange={(e) => {
						const { selectedIndex, options } = e.currentTarget;
						const selectedOption = options[selectedIndex];
						const targetId = selectedOption.value;
						const controller = selectedOption.closest('optgroup')?.label;
						const newTarget = templates.find((template) => template.target === targetId && template.type === controller);
						if (newTarget) {
							changeTargetSelection(newTarget);
						}
					}}
				>
					{searchTemplates && (
						<optgroup label="search">
							{searchTemplates.map((target) => (
								<option>{target.target}</option>
							))}
						</optgroup>
					)}
					{autocompleteTemplates && (
						<optgroup label="autocomplete">
							{autocompleteTemplates.map((target) => (
								<option>{target.target}</option>
							))}
						</optgroup>
					)}
					{recommendationTemplates && (
						<optgroup label="recommendation">
							{recommendationTemplates.map((target) => (
								<option>{target.target}</option>
							))}
						</optgroup>
					)}
				</select>
			</div>

			<div className="section">
				<label htmlFor="template-select">Template Component: </label>
				<select
					id="template-select"
					onChange={(e) => {
						const { selectedIndex, options } = e.currentTarget;
						const selectedOption = options[selectedIndex];
						const selectedTemplate = selectedOption.value;

						templateStore.changeTemplate(selectedTarget.type, selectedTarget.target, selectedTemplate);
					}}
				>
					{library.components.templates[selectedTarget.type].map((componentName: string) => {
						return <option selected={componentName === selectedTarget.template}>{componentName}</option>;
					})}
				</select>
			</div>

			<div className="section">
				<label htmlFor="theme-select">Theme: </label>
				<select
					id="theme-select"
					onChange={(e) => {
						const { selectedIndex, options } = e.currentTarget;
						const selectedOption = options[selectedIndex];
						const selectedTheme = selectedOption.value;
						const type = selectedOption.closest('optgroup')?.label;

						templateStore.changeTheme(selectedTarget.type, selectedTarget.target, type, selectedTheme);
					}}
				>
					<optgroup label="base">
						{baseThemes.map((baseTheme) => (
							<option>{baseTheme}</option>
						))}
					</optgroup>
					<optgroup label="local">
						{lcoalThemes.map((localTheme) => (
							<option selected={selectedTargetConfig.theme === localTheme}>{localTheme}</option>
						))}
					</optgroup>
				</select>
			</div>

			<h3>Theme Variables</h3>
			<div className="section">
				<div className="indent">
					{themes[selectedTargetConfig.theme]?.isFromStorage ? (
						<Fragment>
							<label htmlFor="theme-select">
								<i>Loaded from storage</i>
							</label>
							<button
								onClick={() => {
									templateStore.removeFromStorage(selectedTargetConfig.theme);
									window?.location.reload();
								}}
							>
								Clear stored theme
							</button>
						</Fragment>
					) : (
						''
					)}
					{themes[selectedTargetConfig.theme]?.merged?.variables ? (
						<ThemeEditor
							property={themes[selectedTargetConfig.theme].merged.variables}
							rootEditingKey={'variables'}
							themeName={selectedTargetConfig.theme}
							setThemeOverrides={setThemeOverrides}
						/>
					) : (
						''
					)}

					{Object.keys(themes[selectedTargetConfig.theme]?.overrides || {}).length > 0 ? (
						<button
							onClick={() => {
								templateStore.save(selectedTargetConfig.theme);
								window?.location.reload();
							}}
						>
							Save
						</button>
					) : (
						''
					)}
				</div>
			</div>
		</div>
	);
};

const ThemeEditor = (props: any): any => {
	const pathPrefix: any = props.pathPrefix || [];
	const path = [...pathPrefix, props?.propertyName].filter((a) => a);
	const themeName = props.themeName;
	const setThemeOverrides = props.setThemeOverrides;
	const rootEditingKey = props.rootEditingKey;

	const [isColorPickerVisible, setColorPickerVisible] = useState(false);
	const [colorBeingEdited, setColorBeingEdited] = useState('');

	if (!props?.property) {
		// Property is empty
		return;
	}

	if (Array.isArray(props.property)) {
		// string input comma separated
		return (
			<Fragment>
				<label>{path.join('.')}: </label>
				<input type="text" value={props.property.join(',')} />
				<span>(csv)</span>
			</Fragment>
		);
	}

	if (typeof props.property === 'number' || typeof props.property === 'string' || typeof props.property === 'boolean') {
		const value = props.property.toString();
		if (path.includes('color')) {
			return (
				<Fragment>
					<label>{path.join('.')}: </label>
					<div
						className={'color-preview'}
						css={CSS.ColorDisplay({ color: value, isColorPickerVisible })}
						onClick={() => {
							setColorBeingEdited(value);
							setColorPickerVisible(!isColorPickerVisible);
						}}
					></div>
					<div className={'color-value'}>{value}</div>
					{isColorPickerVisible ? (
						<ChromePicker
							color={colorBeingEdited}
							onChange={(color) => {
								setColorBeingEdited(color.hex);
							}}
							onChangeComplete={(color) => {
								setThemeOverrides({
									themeName,
									path,
									rootEditingKey,
									value: color.hex,
								});
							}}
						/>
					) : (
						''
					)}
				</Fragment>
			);
		} else {
			// string input
		}
	}

	return Object.values(props.property).map((property, index) => (
		<Fragment>
			<div className="theme-editor">
				<ThemeEditor
					key={index}
					property={property}
					rootEditingKey={rootEditingKey}
					themeName={themeName}
					setThemeOverrides={setThemeOverrides}
					propertyName={Object.getOwnPropertyNames(props.property)[index]}
					pathPrefix={[...pathPrefix, props.propertyName]}
				/>
			</div>
		</Fragment>
	));
};

export interface TemplateEditorProps extends ComponentProps {
	onRemoveClick: () => void;
	templateStore: any;
}
