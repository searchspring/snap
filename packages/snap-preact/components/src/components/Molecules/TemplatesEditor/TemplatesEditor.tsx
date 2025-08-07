import { css } from '@emotion/react';
import classnames from 'classnames';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { observer } from 'mobx-react-lite';
import { CacheProvider } from '../../../providers';
import { TemplateEditorStore } from '../../../../../src/Templates/Stores/TemplateEditor/TemplateEditorStore';
import { TemplatesStore, TemplateTypes } from '../../../../../src/Templates/Stores/TemplateStore';
import { SnapTemplates, SnapTemplatesConfig } from '../../../../../src';
import { AutocompleteController, SearchController } from '@searchspring/snap-controller';
import { AthosCommerceLogo } from './Assets';
import type { ThemeStore } from '../../../../../src/Templates/Stores/ThemeStore';
import { AbstractedControls } from './Components/AbstractedControls';
import { DropdownControl } from './Controls/Dropdown';

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
			width: '400px',
			maxWidth: '90vw',

			'*': {
				boxSizing: 'border-box',
			},

			'>header': {
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
				overflowY: 'auto',
				flexGrow: 1,
				'.tab-selection': {
					display: 'flex',
					alignItems: 'center',
					borderBottom: '2px solid #eee',
					gap: '3px',
					'.tab': {
						position: 'relative',
						textDecoration: 'capitalize',
						top: '1px',
						fontWeight: 'bold',
						border: '1px solid #eee',
						borderBottom: 'none',
						padding: '5px 10px',
						height: '100%',
						color: '#999',
						cursor: 'pointer',
						'&.active': {
							backgroundColor: '#fff',
							color: '#000',
							paddingBottom: '7px',
							top: '2px',
						},
					},
				},
				'.tab-view': {
					padding: '0 10px',
				},
			},
			'>footer': {
				marginTop: '10px',
			},

			'&.ss__template-editor--collapsed': {
				right: '-354px',
				transition: 'right ease 0.5s 0.5s, height ease 0.5s',
				height: '50px',
				cursor: 'pointer',
				overflow: 'hidden',
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
					borderColor: '#1d4990',
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

			textarea: {
				width: '100%',
				height: '200px',
				border: '1px solid #ccc',
				color: '#777',
				padding: '10px',
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
	const targets = editorStore.getTargets();

	const rootTarget = targets[0];

	const themeLocation = rootTarget.template.theme.location;
	const themeName = rootTarget.template.theme.name;
	const themeRef = templatesStore.themes[themeLocation][themeName];

	const styling: RootNodeProperties = {
		css: [CSS.TemplatesEditor({ ...properties })],
	};

	return (
		<CacheProvider>
			<div
				className={classnames('ss__template-editor', { 'ss__template-editor--collapsed': editorStore.state.hidden })}
				{...styling}
				onClick={(e) => {
					e.stopPropagation();
					editorStore.toggleHide(false);
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
							editorStore.toggleHide(true);
						}}
					>
						<button
							onClick={(e) => {
								e.stopPropagation();
								if (confirm('Closing the editor will disable modification.')) {
									onRemoveClick();
								}
							}}
						>
							Close
						</button>
						<button
							onClick={() => {
								editorStore.toggleHide(true);
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
									className={classnames('tab', { active: editorStore.state.activeTab === tab })}
									onClick={() => {
										editorStore.switchTabs(tab);
									}}
								>
									{tab}
								</div>
							);
						})}
					</div>
					{editorStore.state.activeTab === 'templates' ? (
						<div className="tab-view">
							<TemplateTargetSettings feature="search" templatesStore={templatesStore} />
							<AbstractedControls editorStore={editorStore} data={snap.controllers.search as SearchController} feature="controllers/search" />
							<TemplateTargetSettings feature="autocomplete" templatesStore={templatesStore} />
							<AbstractedControls
								editorStore={editorStore}
								data={snap.controllers.autocomplete as AutocompleteController}
								feature="controllers/autocomplete"
							/>
							<TemplateTargetSettings feature="recommendation/default" templatesStore={templatesStore} />
							<TemplateTargetSettings feature="recommendation/bundle" templatesStore={templatesStore} />
						</div>
					) : (
						''
					)}
					{editorStore.state.activeTab === 'configuration' ? (
						<div className="tab-view">
							<AbstractedControls editorStore={editorStore} feature="templates/config" />
							<AbstractedControls editorStore={editorStore} feature="templates/theme" />
							<TemplateConfig config={editorStore.generateTemplatesConfig()} />
						</div>
					) : (
						''
					)}
				</aside>

				<footer>
					<ResetAllVariablesButton editorStore={editorStore} themeRef={themeRef} />
				</footer>
			</div>
		</CacheProvider>
	);
});

const TemplateConfig = observer((props: { config: SnapTemplatesConfig }) => {
	const { config } = props;
	return (
		<div className="template-config">
			<h2>Project Code</h2>
			<textarea readOnly>{JSON.stringify(config, null, 4)}</textarea>
		</div>
	);
});

const ResetAllVariablesButton = (props: { editorStore: TemplateEditorStore; themeRef: ThemeStore }) => {
	const { editorStore } = props;
	if (Object.keys(editorStore.overrides.theme || {}).length === 0 || editorStore.state.activeTab !== 'configuration') {
		return null;
	}
	return (
		<button
			onClick={() => {
				// TODO: Implement reset logic variables (should be separate for theme vs. controller configs)
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
