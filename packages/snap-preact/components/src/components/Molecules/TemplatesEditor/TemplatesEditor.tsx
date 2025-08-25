import { css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { RootNodeProperties } from '../../../types';
import { CacheProvider } from '../../../providers';
import { TemplateEditorStore } from '../../../../../src/Templates/Stores/TemplateEditor/TemplateEditorStore';
import { TemplatesStore, TemplateTypes } from '../../../../../src/Templates/Stores/TemplateStore';
import { SnapTemplates } from '../../../../../src';
import { AutocompleteController, SearchController } from '@searchspring/snap-controller';
import { AthosCommerceLogo } from './Assets';
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
			color: '#333',
			borderRight: 0,
			borderTopLeftRadius: '5px',
			borderBottomLeftRadius: '5px',
			boxShadow: 'rgba(81, 81, 81, 0.5) -1px 0px 3px 0px',
			border: '1px solid #D0E0F3',
			background: '#F2F6FC',
			transition: 'right ease 0.2s, height ease 0.3s 0.3s, max-height ease 0.3s 0.3s',
			boxSizing: 'border-box',
			width: '400px',
			maxWidth: '90vw',
			maxHeight: 'calc(100vh - 20px)',

			'*': {
				boxSizing: 'border-box',
			},

			'.ss__template-editor__header': {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '8px 8px 4px 8px',
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
				overflow: 'hidden',
				flexGrow: 1,
				display: 'flex',
				flexDirection: 'column',
				'.tab-selection': {
					display: 'flex',
					alignItems: 'center',
					padding: '0 5px',
					gap: '4px',
					height: '33px',
					flexShrink: 0,
					'.tab': {
						fontSize: '12px',
						position: 'relative',
						boxShadow: 'rgb(110 110 110 / 50%) 0px -1px 2px -1px',
						textTransform: 'capitalize',
						top: '6px',
						fontWeight: 'bold',
						border: '1px solid #D0E0F3',
						borderBottom: 'none',
						padding: '5px 10px 4px 10px',
						height: '100%',
						color: '#9eaab8',
						backgroundColor: '#dce3eb',
						borderTopLeftRadius: '5px',
						borderTopRightRadius: '5px',
						cursor: 'pointer',
						transition: 'font-size 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
						'&:hover': {
							backgroundColor: '#d2deed',
							color: '#7a838e',
						},
						'&.active': {
							fontSize: '14px',
							backgroundColor: '#fff',
							color: '#283E57',
							paddingTop: '7px',
							top: '2px',
							zIndex: 4,
						},
					},
				},
				'.tab-view': {
					position: 'relative',
					zIndex: 3,
					borderTop: '2px solid #D0E0F3',
					background: '#fff',
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
					minHeight: 0,
					'.tab-view-shadow': {
						position: 'absolute',
						top: 0,
						left: 0,
						right: '10px',
						bottom: 0,
						boxShadow: 'inset 5px 12px 6px 0px #fff',
						pointerEvents: 'none',
						'&.bottom': {
							boxShadow: 'inset 0 -12px 6px 0px #fff',
						},
					},
					'.tab-view-content': {
						padding: '0 10px 10px',
						flexGrow: 1,
						overflowY: 'auto',
						minHeight: 0,
						'&::-webkit-scrollbar': {
							width: '8px',
						},
						'&::-webkit-scrollbar-track': {
							background: '#f5f5f5',
						},
						'&::-webkit-scrollbar-thumb': {
							background: '#96aabe',
						},
					},
				},
			},

			'&.ss__template-editor--collapsed': {
				right: '-354px',
				transition: 'right ease 0.5s, height ease 0.3s 0.3s, max-height ease 0.3s 0.3s',
				height: '48px',
				maxHeight: '48px',
				cursor: 'pointer',
				overflow: 'hidden',
			},

			'input, select, option, optgroup, button, h1, h2, h3, h4, h5, h6, i': {
				all: 'revert',
				color: '#283E57',
			},

			h1: { fontSize: '20px' },
			h2: { fontSize: '18px' },
			h3: { fontSize: '16px' },
			h4: { fontSize: '14px' },
			h5: { fontSize: '12px' },
			h6: { fontSize: '10px' },

			'input[type="text"], input[type="number"], select, button': {
				border: '1px solid #ccc',
				height: '30px',
				minHeight: '30px',
				padding: '0 10px',
				borderRadius: '5px',
				fontSize: '12px',
				color: '#333',
				backgroundColor: '#fff',
				boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
				width: '100%',
				'&:hover': {
					color: 'unset',
					background: 'unset',
				},
				'&:disabled': {
					borderColor: '#ddd',
					boxShadow: 'none',
					opacity: 1,
					color: '#999',
					cursor: 'default',
				},
			},

			'input[type="checkbox"]': {
				height: '18px',
				width: '18px',
				margin: '6px 0',
				border: '1px solid #ccc',
			},

			button: {
				border: 0,
				outline: 0,
				cursor: 'pointer',
				borderRadius: '4px',
				color: '#fff',
				backgroundColor: '#283e57',
				'&:hover': {
					color: '#fff',
					backgroundColor: '#0e1f33ff',
				},
			},

			'input[type="number"]': { width: '50px' },
			'input[type="color"]': {
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

			'.reset': {
				flex: '0 0 30px',
				display: 'flex',
				justifyContent: 'flex-end',
				button: {
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
					svg: {
						fill: '#1c71bf',
						height: '15px',
					},
				},
			},

			'.control-title': {
				display: 'flex',
				alignItems: 'center',
				margin: '5px 0',
				height: '30px',
				h4: {
					margin: 0,
				},
			},

			'.group-title': {
				display: 'flex',
				alignItems: 'center',
				margin: '5px 0',
				height: '30px',
				h4: {
					margin: 0,
				},
			},

			'.option': {
				display: 'flex',
				alignItems: 'center',
				marginBottom: '5px',
				fontSize: '12px',

				label: {
					flex: '0 0 12em',
				},
				'.value': {
					flex: '1 1 auto',
					display: 'flex',
					alignItems: 'center',
					'.invalid': {
						border: '1px solid #cc0000',
						outline: '1px solid #cc0000',
					},
				},
				'&.color-picker': {
					alignItems: 'center',
					'.value': {
						alignItems: 'center',
					},
				},
			},
		}),
};

export const TemplatesEditor = observer((properties: TemplatesEditorProps): JSX.Element => {
	const { onRemoveClick, templatesStore, editorStore, snap } = properties;

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
				<div className="ss__template-editor__header">
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
				</div>

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
					<div className="tab-view">
						<div className="tab-view-shadow"></div>
						<div className="tab-view-content">
							{editorStore.state.activeTab === 'templates' ? (
								<>
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
								</>
							) : (
								''
							)}
							{editorStore.state.activeTab === 'configuration' ? (
								<>
									<AbstractedControls title="Project Configuration" editorStore={editorStore} feature="templates/config" />
									<AbstractedControls title="Theme Configuration" editorStore={editorStore} feature="templates/theme" />
									{/* <TemplateConfig config={editorStore.generateTemplatesConfig()} /> */}
								</>
							) : (
								''
							)}
						</div>
						<div className="tab-view-shadow bottom"></div>
					</div>
				</aside>

				<footer></footer>
			</div>
		</CacheProvider>
	);
});

// const TemplateConfig = observer((props: { config: SnapTemplatesConfig }) => {
// 	const { config } = props;
// 	return (
// 		<div className="template-config">
// 			<h2>Project Code</h2>
// 			<textarea readOnly>{JSON.stringify(config, null, 4)}</textarea>
// 		</div>
// 	);
// });

export interface TemplatesEditorProps {
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
			<h3>{type.charAt(0).toUpperCase() + type.slice(1) + (recsType ? ` (${recsType})` : '')}</h3>

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
