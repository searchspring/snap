import { css } from '@emotion/react';
import classnames from 'classnames';
import { useState } from 'preact/hooks';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { observer } from 'mobx-react-lite';
import { debounce } from '@searchspring/snap-toolbox';
import { CacheProvider } from '../../../providers';
import { TargetStore } from '../../../../../src/Templates/Stores/TargetStore';
import { TemplateEditorStore } from '../../../../../src/Templates/Stores/TemplateEditorStore';
import { RecsTemplateTypes, TargetMap, TemplatesStore, TemplateThemeTypes, TemplateTypes } from '../../../../../src/Templates/Stores/TemplateStore';
import { CurrencyCodes, LanguageCodes } from '../../../../../src/Templates/Stores/LibraryStore';
import { SnapTemplates } from '../../../../../src';
import { AutocompleteController, SearchController } from '@searchspring/snap-controller';
import { AbstractedControl, AbstractionGroup } from '../../../../../src/types';
import { CheckboxControl } from './Controls/Checkbox';
import { DropdownControl } from './Controls/Dropdown';
import { AthosCommerceLogo, Reset } from './Assets';

const CSS = {
	TemplatesEditor: ({}: Partial<TemplatesEditorProps>) =>
		css({
			display: 'flex',
			flexDirection: 'column',
			minWidth: '400px',
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
			borderRight: 0,
			borderTopLeftRadius: '5px',
			borderBottomLeftRadius: '5px',
			boxShadow: 'rgba(81, 81, 81, 0.5) -1px 0px 3px 0px',
			transition: 'right ease 0.5s, height ease 0.5s 0.5s',
			boxSizing: 'border-box',
			height: '65em',
			maxHeight: 'calc(90vh - 20px)',
			overflowY: 'auto',
			width: '400px',
			maxWidth: '90vw',

			'*': {
				boxSizing: 'border-box',
			},

			'>header': {
				height: '50px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				marginBottom: '10px',
				'.athos-logo': {
					maxWidth: '100%',
					width: '200px',
					'.cls-1': {
						fill: '#00aeef',
					},

					'.cls-2': {
						fill: '#1d4990',
					},
				},
				'.header-actions': {
					display: 'flex',
					gap: '10px',
					'& button': {
						width: 'unset',
					},
				},
			},
			'>aside': {
				flexGrow: 1,
				'.tab-selection': {
					display: 'flex',
					alignItems: 'center',
					borderBottom: '2px solid #eee',
					gap: '3px',
					'.tab': {
						fontWeight: 'bold',
						border: '1px solid #ccc',
						borderBottom: 'none',
						padding: '5px 10px',
						height: '100%',
						color: '#999',
						cursor: 'pointer',
						'&.active': {
							backgroundColor: '#fff',
							color: '#000',
						},
					},
				},
				'.tab-view': {
					padding: '0 10px',
					'.template-target-settings, .controller-settings': {},
				},
			},
			'>footer': {
				borderTop: '1px solid #ccc',
				marginTop: '10px',
			},

			'&.ss__template-editor--collapsed': {
				right: '-354px',
				transition: 'right ease 0.5s 0.5s, height ease 0.5s',
				height: '50px',
				cursor: 'pointer',
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

			'& input[type="text"], & input[type="number"], & select, & button': {
				border: '1px solid #ccc',
				height: '30px',
				minHeight: '30px',
				padding: '0 10px',
				borderRadius: '5px',
				fontSize: '14px',
				color: '#333',
				backgroundColor: '#fff',
				boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
				width: '100%',
				'&:hover': {
					color: 'unset',
					background: 'unset',
				},
				'&:disabled': {
					opacity: 0.5,
					cursor: 'default',
				},
			},
			'& button': {
				cursor: 'pointer',
				'&:hover': {
					color: 'white',
					background: '#1d4990',
				},
			},

			'& input[type="number"]': { width: '50px' },
			'& input[type="color"]': {
				width: '70px',
				height: '30px',
				border: '1px solid #ccc',
				borderRadius: '5px',
				outline: 'none',
				boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
				padding: 0,
				margin: '0 5px 0 0',

				'&::-moz-color-swatch': {
					border: 'none',
				},

				'&::-webkit-color-swatch-wrapper': {
					padding: 0,
					borderRadius: 0,
				},

				'&::-webkit-color-swatch': {
					border: 'none',
				},
			},

			'.option': {
				display: 'flex',
				alignItems: 'baseline',
				marginBottom: '10px',

				'& label': {
					textAlign: 'right',
					flex: '0 0 9.5em',
				},
				'& .reset': {
					flex: '0 0 2em',
					display: 'flex',
					justifyContent: 'flex-end',
					'& button': {
						'&:hover': {
							background: 'unset',
						},
						margin: '0 0.5em',
						padding: 0,
						background: 'unset',
						border: 'unset',
						cursor: 'pointer',
						boxShadow: 'unset',
						height: 'unset',
					},
				},
				'& .value': {
					flex: '1 1 auto',
					display: 'flex',
					alignItems: 'baseline',
				},
				'&.color-picker': {
					alignItems: 'center',
					'& .value': {
						alignItems: 'center',
					},
				},
			},
		}),
};

export const TemplatesEditor = observer((properties: TemplatesEditorProps): JSX.Element => {
	const { onRemoveClick, templatesStore, editorStore, snap } = properties;
	const searchTargets = Object.keys(templatesStore.targets.search || {}).map((target) => ({
		type: 'search',
		target,
		template: templatesStore.targets.search[target],
		selector: templatesStore.targets.search[target].selector,
	}));
	const autocompleteTargets = Object.keys(templatesStore.targets.autocomplete || {}).map((target) => ({
		type: 'autocomplete',
		target,
		template: templatesStore.targets.autocomplete[target],
		selector: templatesStore.targets.autocomplete[target].selector,
	}));
	const recommendationBundleTargets = Object.keys(templatesStore.targets.recommendation.bundle || {}).map((target) => ({
		type: 'recommendation/bundle',
		target,
		template: templatesStore.targets.recommendation.bundle[target],
		selector: templatesStore.targets.recommendation.bundle[target].selector,
	}));
	const recommendationDefaultTargets = Object.keys(templatesStore.targets.recommendation.default || {}).map((target) => ({
		type: 'recommendation/default',
		target,
		template: templatesStore.targets.recommendation.default[target],
		selector: templatesStore.targets.recommendation.default[target].selector,
	}));
	const recommendationEmailTargets = Object.keys(templatesStore.targets.recommendation.email || {}).map((target) => ({
		type: 'recommendation/email',
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

	const rootTarget = targets[0];

	const themeLocation = rootTarget.template.theme.location;
	const themeName = rootTarget.template.theme.name;
	const themeRef = templatesStore.themes[themeLocation][themeName];
	const theme = themeRef.theme;

	const [collapsed, setCollapsed] = useState(false);

	const styling: RootNodeProperties = {
		css: [CSS.TemplatesEditor({ ...properties })],
	};

	const setVariable = debounce((obj: { path: string[]; value: unknown }) => {
		editorStore.setVariable(obj, themeRef);
	}, 50);

	return (
		<CacheProvider>
			<div
				className={classnames('ss__template-editor', { 'ss__template-editor--collapsed': collapsed })}
				{...styling}
				onClick={(e) => {
					e.stopPropagation();
					setCollapsed(false);
				}}
			>
				<header>
					<div className={'logo'}>
						<AthosCommerceLogo />
					</div>

					<div
						className={'header-actions'}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							setCollapsed(true);
						}}
					>
						<button
							onClick={(e) => {
								e.stopPropagation();
								if (confirm('Are you sure you want to close the editor? All changes will be lost.')) {
									onRemoveClick();
								}
							}}
						>
							Close
						</button>
						<button
							onClick={() => {
								setCollapsed(true);
							}}
						>
							Hide
						</button>
					</div>
				</header>

				<aside>
					<div className="tab-selection">
						{editorStore.tabs.map((tab, i) => {
							return (
								<div
									key={i}
									className={classnames('tab', { active: editorStore.activeTab === tab })}
									onClick={() => {
										editorStore.switchTabs(tab);
									}}
								>
									{tab}
								</div>
							);
						})}
					</div>
					{editorStore.activeTab === 'Templates' ? (
						<div className="tab-view">
							<TemplateTargetSettings feature="search" templatesStore={templatesStore} />
							<ControllerSettings editorStore={editorStore} snap={snap} feature="search" />
							<TemplateTargetSettings feature="autocomplete" templatesStore={templatesStore} />
							<ControllerSettings editorStore={editorStore} snap={snap} feature="autocomplete" />
							<TemplateTargetSettings feature="recommendation/default" templatesStore={templatesStore} />
							<TemplateTargetSettings feature="recommendation/bundle" templatesStore={templatesStore} />
						</div>
					) : (
						''
					)}
					{editorStore.activeTab === 'Configuration' ? (
						<div className="tab-view">
							<h2>Project Configuration</h2>
							<div className="option">
								<label htmlFor="siteId">SiteId</label>
								<div className="reset"></div>
								<div className="value">
									<input
										id="siteId"
										type="text"
										placeholder={'Enter the siteId from the Athos Console'}
										value={templatesStore.config.config.siteId}
										disabled
									/>
								</div>
							</div>
							<div className="option">
								<label htmlFor="platform">Platform</label>
								<div className="reset"></div>
								<div className="value">
									<select
										id="platform"
										value={templatesStore.config.config.platform}
										// onChange={(e) => { }}
										disabled
									>
										{/* TODO: need better platform or get it from other place instead of library.plugins */}
										{Object.keys(templatesStore.library.import.plugins)
											.map((plugin) => (plugin == 'common' ? 'other' : plugin))
											.map((plugin, i) => {
												return (
													<option key={i} value={plugin}>
														{plugin}
													</option>
												);
											})}
									</select>
								</div>
							</div>

							<div className="option">
								<label htmlFor="theme-select">Theme</label>
								<div className="reset"></div>
								<div className="value">
									<select
										id="theme-select"
										onChange={(e) => {
											const { selectedIndex, options } = e.currentTarget;
											const selectedOption = options[selectedIndex];
											const selectedTheme = selectedOption.value;
											const type = selectedOption.closest('optgroup')?.label as TemplateThemeTypes;

											// get reference to theme and update the overrides
											const theme = templatesStore.themes[type][selectedTheme];
											theme.setEditorOverrides(editorStore.variableOverrides);

											if (type) {
												// loop through all targets in templateStore and call setTheme on them all
												Object.keys(templatesStore.targets).forEach((feature) => {
													// loop through all the features (search, autocomplete, recommendations)
													if (feature == 'recommendation') {
														const recommendationObj = templatesStore.targets[feature as keyof typeof templatesStore.targets] as {
															[key in RecsTemplateTypes]: TargetMap;
														};
														Object.keys(recommendationObj).forEach((recType) => {
															const targetMap = recommendationObj[recType as keyof typeof recommendationObj];
															Object.keys(targetMap).forEach((target) => {
																const targetStore = targetMap[target as keyof typeof targetMap] as TargetStore;
																targetStore.setTheme(selectedTheme, type);
															});
														});
													} else {
														const targetMap = templatesStore.targets[feature as keyof typeof templatesStore.targets] as TargetMap;
														Object.keys(targetMap).forEach((target) => {
															const targetStore = targetMap[target as keyof typeof targetMap] as TargetStore;
															targetStore.setTheme(selectedTheme, type);
														});
													}
												});
											}
										}}
									>
										<optgroup label="library">
											{Object.keys(templatesStore.themes.library).map((libraryTheme) => (
												<option selected={themeLocation === 'library' && themeName === libraryTheme}>{libraryTheme}</option>
											))}
										</optgroup>
										<optgroup label="local">
											{Object.keys(templatesStore.themes.local).map((localTheme) => (
												<option selected={themeLocation === 'local' && themeName === localTheme}>{localTheme}</option>
											))}
										</optgroup>
									</select>
								</div>
							</div>

							<div className="option">
								<label htmlFor="language">Language</label>
								<div className="reset"></div>
								<div className="value">
									<select
										id="language"
										value={templatesStore.language}
										onChange={(e) => {
											templatesStore.setLanguage(e.target.value as LanguageCodes);
										}}
									>
										{Object.keys(templatesStore.library.locales.languages).map((option, i) => {
											return (
												<option key={i} value={option}>
													{option}
												</option>
											);
										})}
									</select>
								</div>
							</div>
							<div className="option">
								<label htmlFor="currency">Currency</label>
								<div className="reset"></div>
								<div className="value">
									<select
										id="currency"
										value={templatesStore.currency}
										onChange={(e) => {
											templatesStore.setCurrency(e.target.value as CurrencyCodes);
										}}
									>
										{Object.keys(templatesStore.library.locales.currencies).map((option, i) => {
											return (
												<option key={i} value={option}>
													{option}
												</option>
											);
										})}
									</select>
								</div>
							</div>

							<ThemeEditor
								property={theme?.variables}
								rootEditingKey={'variables'}
								themeName={rootTarget.template.theme.name}
								setVariable={setVariable}
								editorStore={editorStore}
								themeRef={themeRef}
							/>
						</div>
					) : (
						''
					)}
				</aside>

				<footer>
					<ResetAllVariablesButton editorStore={editorStore} themeRef={themeRef} />
					<ReloadRequiredButton editorStore={editorStore} />
				</footer>
			</div>
		</CacheProvider>
	);
});

const ReloadRequiredButton = (props: any) => {
	const { editorStore } = props;
	if (!editorStore.reloadRequired || editorStore.activeTab !== 'Templates') {
		return null;
	}
	return (
		<button
			onClick={() => {
				window.location.reload();
			}}
		>
			Reload Required
		</button>
	);
};
const ResetAllVariablesButton = (props: any) => {
	const { editorStore, themeRef } = props;
	if (Object.keys(editorStore.variableOverrides).length === 0 || editorStore.activeTab !== 'Configuration') {
		return null;
	}
	return (
		<button
			onClick={() => {
				editorStore.resetAllVariables(themeRef);
			}}
		>
			Reset All Variables
		</button>
	);
};

export interface TemplatesEditorProps extends ComponentProps {
	onRemoveClick: () => void;
	templatesStore: TemplatesStore;
	editorStore: TemplateEditorStore;
	snap: SnapTemplates;
}

const ThemeEditor = (props: any): any => {
	const pathPrefix: any = props.pathPrefix || [];
	const path = [...pathPrefix, props?.propertyName].filter((a) => a);
	const themeName = props.themeName;
	const setVariable = props.setVariable;
	const rootEditingKey = props.rootEditingKey;
	const editorStore = props.editorStore;
	const themeRef = props.themeRef;

	if (!props?.property || Array.isArray(props.property) || typeof props.property === 'boolean') {
		// ignore arrays, numbers, and booleans
		return null;
	}

	const shouldShowResetButton = (path: string[], val: unknown) => {
		try {
			let obj = editorStore.variableOverrides[rootEditingKey];
			if (!obj) {
				// no overrides at this moment
				return false;
			}

			path.forEach((p) => {
				obj = obj[p];
			});
			if (obj && obj === val) {
				return true;
			}
		} catch (e) {
			return false;
		}
	};

	if (typeof props.property === 'object') {
		// object means we need to recurse until we get to the primitives
		return Object.values(props.property).map((property, index) => {
			return (
				<ThemeEditor
					key={index}
					property={property}
					rootEditingKey={rootEditingKey}
					themeName={themeName}
					setVariable={setVariable}
					propertyName={Object.getOwnPropertyNames(props.property)[index]}
					pathPrefix={[...pathPrefix, props.propertyName]}
					editorStore={editorStore}
					themeRef={themeRef}
				/>
			);
		});
	} else if (typeof props.property === 'string') {
		const value = props.property.toString();
		const key = path.join('.');

		if (path.includes('colors')) {
			return (
				<div className={classnames('color-picker', 'option')}>
					<label htmlFor={key}>{key}</label>
					<div className="reset">
						{shouldShowResetButton(path, value) && (
							<button
								title="Reset"
								onClick={() => {
									editorStore.resetVariable({ path, rootEditingKey }, themeRef);
								}}
							>
								<Reset />
							</button>
						)}
					</div>
					<div className="value">
						<input
							type="color"
							value={value}
							id={key}
							name={key}
							onChange={(e) => {
								setVariable({
									path,
									value: e.target.value,
								});
							}}
						/>
						<span>{value}</span>
					</div>
				</div>
			);
		}
	} else if (typeof props.property === 'number') {
		if (path.includes('breakpoints')) {
			const value = props.property;
			const key = path.join('.');
			return (
				<div className={classnames('breakpoint-picker', 'option')}>
					<label htmlFor={key}>{key}</label>
					<div className="reset">
						{shouldShowResetButton(path, value) && (
							<button
								title="Reset"
								onClick={() => {
									editorStore.resetVariable({ path, rootEditingKey }, themeRef);
								}}
							>
								<Reset />
							</button>
						)}
					</div>
					<div className="value">
						<input
							type="number"
							value={value}
							id={key}
							name={key}
							onChange={(e) => {
								setVariable({
									path,
									value: Number(e.target.value),
								});
							}}
						/>
					</div>
				</div>
			);
		}
	}
};

/*

		disableA11y: {
			description: 'boolean to disable autoset ally properties',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},

*/

type ControllerSettingsProps = {
	feature: string;
	editorStore: TemplateEditorStore;
	snap: SnapTemplates;
};

const ControllerSettings = observer((props: ControllerSettingsProps) => {
	const { feature, editorStore, snap } = props;
	const [feat] = feature.split('/');
	const controlGroups = editorStore.uiAbstractions[feat as keyof typeof editorStore.uiAbstractions] as
		| AbstractionGroup<SearchController | AutocompleteController>[]
		| undefined;

	const controller = snap.controllers?.[feat] as SearchController | AutocompleteController;

	if (!controller || !controlGroups) {
		return null;
	}

	return (
		<div className="controller-settings">
			{controlGroups.map((group) => {
				return (
					<div className="group" key={group.title}>
						<h3>{group.title}</h3>
						<p>{group.description}</p>
						{group.controls.map((control, index) => {
							// Type assertion to handle the union type issue
							let value: string | number | boolean;
							const typedControl = control as AbstractedControl<typeof controller>;
							const display: string = typedControl?.getDisplayState ? typedControl.getDisplayState(controller) : 'visible';

							switch (control.type) {
								case 'checkbox':
									value = Boolean(typedControl.getValue(controller));

									return display === 'hidden' ? null : (
										<CheckboxControl
											key={index}
											label={control.label}
											description={control.description}
											showReset={control.shouldShowReset()}
											onReset={() => control.onReset({ controller })}
											disabled={display === 'disabled'}
											value={value}
											onChange={(value: boolean) => control.onValueChange({ value, controller })}
										/>
									);
								case 'dropdown':
									value = typedControl.getValue(controller);

									const dropdownValue = typedControl.getValue(controller) as string | number;
									const dropdownOptions = typeof control.options === 'function' ? control.options(controller) : control.options || [];
									return display === 'hidden' ? null : (
										<DropdownControl
											key={index}
											label={control.label}
											description={control.description}
											showReset={control.shouldShowReset()}
											options={dropdownOptions}
											onReset={() => control.onReset({ controller })}
											disabled={display === 'disabled'}
											value={dropdownValue}
											onChange={(value: string | number) => control.onValueChange({ value, controller })}
										/>
									);
								default:
									return null;
							}
						})}
					</div>
				);
			})}
		</div>
	);
});

type TemplateTargetSettingsProps = {
	feature: TemplateTypes;
	templatesStore: TemplatesStore;
};

const TemplateTargetSettings = observer((props: TemplateTargetSettingsProps) => {
	const { feature, templatesStore } = props;
	const [type, recsType = ''] = feature.split('/');
	const idPrefix = `${type}${recsType ? `-${recsType}` : ''}`;

	const config = templatesStore.config as any;
	const configTarget = config[type]?.[recsType]?.[`${recsType.charAt(0).toUpperCase() + recsType.slice(1)}`] || config[type]?.targets?.[0];

	const libraryComponents = templatesStore.library.components as any;
	const libraryTemplates = recsType ? libraryComponents[type]?.[recsType] : libraryComponents[type];
	const libraryResultComponents = libraryComponents?.result;

	const DEAFULT_RESULT_COMPONENT = 'Result';
	const activeTarget = templatesStore.getTarget(feature, configTarget.selector);
	const showTemplateReset = Boolean(activeTarget?.component) && activeTarget?.component !== configTarget?.component;
	const showResultTemplateReset =
		(activeTarget?.resultComponent || DEAFULT_RESULT_COMPONENT) != (configTarget?.resultComponent || DEAFULT_RESULT_COMPONENT);

	return (
		<div className="template-target-settings">
			<h2>{type.charAt(0).toUpperCase() + type.slice(1) + (recsType ? ` (${recsType})` : '')}</h2>

			{!recsType && (
				<div className="option">
					<label htmlFor={`${idPrefix}-target`}>Target</label>
					<div className="reset"></div>
					<div className="value">
						<input id={`${idPrefix}-target`} type="text" placeholder={''} disabled={true} value={configTarget.selector} />
					</div>
				</div>
			)}

			<DropdownControl
				key={`${idPrefix}-template`}
				label={'Template'}
				description={''}
				showReset={showTemplateReset}
				options={Object.keys(libraryTemplates)}
				onReset={() => activeTarget?.setComponent(configTarget?.component)}
				disabled={false}
				value={activeTarget?.component}
				onChange={(value) => activeTarget?.setComponent(`${value}`)}
			/>

			<DropdownControl
				key={`${idPrefix}-result-template`}
				label={'Result Template'}
				description={''}
				showReset={showResultTemplateReset}
				options={Object.keys(libraryResultComponents)}
				onReset={() => activeTarget?.setResultComponent(configTarget?.resultComponent || DEAFULT_RESULT_COMPONENT)} // TODO: fetch first library.components.result[0] key
				disabled={false}
				value={activeTarget?.resultComponent}
				onChange={(value) => activeTarget?.setResultComponent(`${value}`)}
			/>
		</div>
	);
});

/*
Later:
0. group some controller settings in more intuitive fashion (eg. show trending/history as radio button) - user abstraction layer
1. agree on UI/UX for initial TemplateEditor
2. polish (clean up styles)
*/
