import { h, Fragment } from 'preact';

import { css, Global } from '@emotion/react';
import classnames from 'classnames';
import { useState } from 'preact/hooks';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { ChromePicker } from 'react-color';
import { Icon } from '../../Atoms/Icon/Icon';
import { Button } from '../../Atoms/Button';
import { observer } from 'mobx-react-lite';
import { debounce } from '@searchspring/snap-toolbox';
import { CacheProvider } from '../../../providers';

const CSS = {
	ColorDisplay: ({ color, isColorPickerVisible }: any) =>
		css({
			backgroundColor: color,
			border: isColorPickerVisible ? '1px solid black' : '',
		}),
	TemplatesEditor: ({}: Partial<TemplatesEditorProps>) =>
		css({
			display: 'flex',
			flexDirection: 'column',
			minWidth: '420px',
			overflow: 'hidden',
			fontSize: '14px',
			position: 'fixed',
			zIndex: '10003',
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

export const TemplatesEditor = observer((properties: TemplatesEditorProps): JSX.Element => {
	const { onRemoveClick, templatesStore } = properties;
	const searchTargets = Object.keys(templatesStore.targets.search || {}).map((target) => ({
		type: 'search',
		subType: '',
		target,
		template: templatesStore.targets.search[target],
		selector: templatesStore.targets.search[target].selector,
	}));
	const autocompleteTargets = Object.keys(templatesStore.targets.autocomplete || {}).map((target) => ({
		type: 'autocomplete',
		subType: '',
		target,
		template: templatesStore.targets.autocomplete[target],
		selector: templatesStore.targets.autocomplete[target].selector,
	}));
	const recommendationBundleTargets = Object.keys(templatesStore.targets.recommendation.bundle || {}).map((target) => ({
		type: 'recommendation',
		subType: 'bundle',
		target,
		template: templatesStore.targets.recommendation.bundle[target],
		selector: templatesStore.targets.recommendation.bundle[target].selector,
	}));
	const recommendationDefaultTargets = Object.keys(templatesStore.targets.recommendation.default || {}).map((target) => ({
		type: 'recommendation',
		subType: 'default',
		target,
		template: templatesStore.targets.recommendation.default[target],
		selector: templatesStore.targets.recommendation.default[target].selector,
	}));
	const recommendationEmailTargets = Object.keys(templatesStore.targets.recommendation.email || {}).map((target) => ({
		type: 'recommendation',
		subType: 'email',
		target,
		template: templatesStore.targets.recommendation.email[target],
		selector: templatesStore.targets.recommendation.email[target].selector,
	}));
	const targets = [
		...searchTargets,
		...autocompleteTargets,
		...recommendationBundleTargets,
		...recommendationDefaultTargets,
		...recommendationEmailTargets,
	];

	if (targets.length === 0) {
		return <div>no themes found</div>;
	}

	const [collapsed, setCollapsed] = useState(false);
	const [selectedTarget, changeTargetSelection] = useState(targets[0]);
	const [selectedLanguage, changeLanguage] = useState(templatesStore.language);
	const [selectedCurrency, changeCurrency] = useState(templatesStore.currency);

	const styling: RootNodeProperties = {
		css: [CSS.TemplatesEditor({ ...properties })],
	};

	const { library } = templatesStore;
	const { languages, currencies } = library.locales;
	const languageKeys = Object.keys(languages);
	const currencyKeys = Object.keys(currencies);
	const libraryThemes = Object.keys(templatesStore.themes.library || {});
	const lcoalThemes = Object.keys(templatesStore.themes.local || {}).sort((a, b) => {
		if (a === 'global') return -1;
		if (b === 'global') return 1;
		return 0;
	});
	const selectedTargetConfig = templatesStore.getTarget(selectedTarget.type, selectedTarget.subType, selectedTarget.target);

	const themeRef = templatesStore.themes[selectedTarget.template.theme.location][selectedTarget.template.theme.name];
	const theme = themeRef.theme;

	const setOverride = debounce((obj: { themeName: string; path: string[]; rootEditingKey: string; value: string }) => {
		themeRef.setOverride(obj);
	}, 10);

	const [isColorPickerVisible, setColorPickerVisible] = useState(false);

	return (
		<CacheProvider>
			<div
				className={classnames('ss__template-editor', { collapsed: collapsed })}
				{...styling}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setCollapsed(false);

					if (isColorPickerVisible && !(e.target as HTMLDivElement).className.includes('color-preview')) {
						setColorPickerVisible(false);
					}
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
							${selectedTarget.selector} {
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
							templatesStore.setLanguage(language);
						}}
					>
						{languageKeys.map((language: string) => {
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
							templatesStore.setCurrency(currency);
						}}
					>
						{currencyKeys.map((currency: string) => {
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
							const optgroup = selectedOption.closest('optgroup');
							const controller = optgroup?.label;
							const subType = optgroup?.dataset.subtype || '';
							const newTarget = targets.find((target) => target.target === targetId && target.type === controller && target.subType === subType);
							if (newTarget) {
								changeTargetSelection(newTarget);
							}
						}}
					>
						{searchTargets && (
							<optgroup label="search">
								{searchTargets.map((target) => (
									<option>{target.target}</option>
								))}
							</optgroup>
						)}
						{autocompleteTargets && (
							<optgroup label="autocomplete">
								{autocompleteTargets.map((target) => (
									<option>{target.target}</option>
								))}
							</optgroup>
						)}
						{recommendationBundleTargets && (
							<optgroup label="recommendation" data-subtype="bundle">
								{recommendationBundleTargets.map((target) => (
									<option>{target.target}</option>
								))}
							</optgroup>
						)}
						{recommendationDefaultTargets && (
							<optgroup label="recommendation" data-subtype="default">
								{recommendationDefaultTargets.map((target) => (
									<option>{target.target}</option>
								))}
							</optgroup>
						)}
						{recommendationEmailTargets && (
							<optgroup label="recommendation" data-subtype="email">
								{recommendationEmailTargets.map((target) => (
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
							if (selectedTarget.type === 'recommendation' && selectedTarget.subType) {
								templatesStore.targets[selectedTarget.type][selectedTarget.subType][selectedTarget.target].setComponent(selectedTemplate);
							} else {
								templatesStore.targets[selectedTarget.type][selectedTarget.target].setComponent(selectedTemplate);
							}
						}}
					>
						{Object.keys(library.components[selectedTarget.type][selectedTarget.subType] || library.components[selectedTarget.type] || {}).map(
							(componentName: string) => {
								return <option selected={componentName === selectedTarget.template.component}>{componentName}</option>;
							}
						)}
					</select>
				</div>

				<div className="section">
					<label htmlFor="result-select">Result Component: </label>
					<select
						id="result-select"
						onChange={(e) => {
							const { selectedIndex, options } = e.currentTarget;
							const selectedOption = options[selectedIndex];
							const selectedTemplate = selectedOption.value;
							if (selectedTarget.type === 'recommendation' && selectedTarget.subType) {
								templatesStore.targets[selectedTarget.type][selectedTarget.subType][selectedTarget.target].setResultComponent(selectedTemplate);
							} else {
								templatesStore.targets[selectedTarget.type][selectedTarget.target].setResultComponent(selectedTemplate);
							}
						}}
					>
						{Object.keys(library.components.result || {}).map((componentName: string) => {
							return <option selected={componentName === selectedTarget.template.resultComponent}>{componentName}</option>;
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

							if (selectedTarget.type === 'recommendation' && selectedTarget.subType) {
								templatesStore.targets[selectedTarget.type][selectedTarget.subType][selectedTarget.target].setTheme(selectedTheme, type);
							} else {
								templatesStore.targets[selectedTarget.type][selectedTarget.target].setTheme(selectedTheme, type);
							}
						}}
					>
						<optgroup label="library">
							{libraryThemes.map((libraryTheme) => (
								<option selected={selectedTargetConfig.theme.location === 'library' && selectedTargetConfig.theme.name === libraryTheme}>
									{libraryTheme}
								</option>
							))}
						</optgroup>
						<optgroup label="local">
							{lcoalThemes.map((localTheme) => (
								<option selected={selectedTargetConfig.theme.location === 'local' && selectedTargetConfig.theme.name === localTheme}>
									{localTheme}
								</option>
							))}
						</optgroup>
					</select>
				</div>

				<h3>{selectedTargetConfig.theme.name} variables</h3>
				<div className="section">
					<div className="indent">
						{/* {themes[selectedTargetConfig.theme]?.isFromStorage ? (
						<Fragment>
							<label htmlFor="theme-select">
								<i>Loaded from storage</i>
							</label>
							<button
								onClick={() => {
									templatesStore.removeFromStorage(selectedTargetConfig.theme);
									window?.location.reload();
								}}
							>
								Clear stored theme
							</button>
						</Fragment>
					) : (
						''
					)} */}
						{theme?.variables ? (
							<ThemeEditor
								property={theme?.variables}
								rootEditingKey={'variables'}
								themeName={selectedTarget.template.theme.name}
								setOverride={setOverride}
								isColorPickerVisible={isColorPickerVisible}
								setColorPickerVisible={setColorPickerVisible}
							/>
						) : (
							''
						)}
					</div>
				</div>
			</div>
		</CacheProvider>
	);
});

const ThemeEditor = (props: any): any => {
	const pathPrefix: any = props.pathPrefix || [];
	const path = [...pathPrefix, props?.propertyName].filter((a) => a);
	const themeName = props.themeName;
	const setOverride = props.setOverride;
	const rootEditingKey = props.rootEditingKey;

	const setColorPickerVisible = props.setColorPickerVisible;
	const isColorPickerVisible = props.isColorPickerVisible;
	const [colorBeingEdited, setColorBeingEdited] = useState('');

	// if (!props?.property) {
	// 	// Property is empty
	// 	return;
	// }

	if (Array.isArray(props.property)) {
		// string input comma separated
		return;
		// return (
		// 	<Fragment>
		// 		<label>{path.join('.')}: </label>
		// 		<input type="text" value={props.property.join(',')} />
		// 		<span>(csv)</span>
		// 	</Fragment>
		// );
	}

	if (typeof props.property === 'number' || typeof props.property === 'string' || typeof props.property === 'boolean') {
		const value = props.property.toString();
		if (path.includes('color')) {
			const key = path.join('.');
			return (
				<Fragment>
					<label>{key}: </label>
					<div
						className={'color-preview'}
						css={CSS.ColorDisplay({ color: value, isColorPickerVisible })}
						onClick={() => {
							setColorPickerVisible('');
							if (isColorPickerVisible !== key) {
								setColorPickerVisible(key);
								setColorBeingEdited(value);
							}
						}}
					></div>
					<div className={'color-value'}>{value}</div>
					{isColorPickerVisible == key ? (
						<ChromePicker
							color={colorBeingEdited}
							onChange={(color) => {
								setColorBeingEdited(color.hex);
								setOverride({
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
			<div className={classnames({ 'theme-editor': index > 0 })}>
				<ThemeEditor
					key={index}
					property={property}
					rootEditingKey={rootEditingKey}
					themeName={themeName}
					setOverride={setOverride}
					propertyName={Object.getOwnPropertyNames(props.property)[index]}
					pathPrefix={[...pathPrefix, props.propertyName]}
					isColorPickerVisible={isColorPickerVisible}
					setColorPickerVisible={setColorPickerVisible}
				/>
			</div>
		</Fragment>
	));
};

export interface TemplatesEditorProps extends ComponentProps {
	onRemoveClick: () => void;
	templatesStore: any;
}
