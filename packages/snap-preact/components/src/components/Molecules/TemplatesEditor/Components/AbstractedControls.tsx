import { observer } from 'mobx-react-lite';
import { TemplateEditorStore } from '../../../../../../src/Templates/Stores/TemplateEditor/TemplateEditorStore';
import { AbstractionGroup } from '../../../../../../src/types';
import { Control } from './Control';

type AbstractedControlsProps<Params> = {
	feature: string;
	editorStore: TemplateEditorStore;
	data?: Params;
};

export const AbstractedControls = observer(<Params,>(props: AbstractedControlsProps<Params>) => {
	const { feature, editorStore, data } = props;
	const [section, feat] = feature.split('/');
	const controlSection = editorStore.uiAbstractions[section as keyof typeof editorStore.uiAbstractions];
	const controlGroups = controlSection?.[feat as keyof typeof controlSection] as AbstractionGroup<Params>[] | undefined;

	if (!controlGroups) {
		console.warn(`No controls found for feature: ${feature}`, controlSection, controlGroups);
		return null;
	}

	return (
		<div className="ss__template-editor__abstracted-controls">
			{controlGroups.map((group) => {
				return (
					<div className="group" key={group.title}>
						<h3>{group.title}</h3>
						<p>{group.description}</p>
						{group.controls.map((control, index) => {
							return (
								<Control
									key={index}
									type={control.type}
									label={control.label}
									description={control.description}
									showReset={control.shouldShowReset()}
									onChange={(value) => control.onValueChange(value, data)}
									onReset={() => control.onReset(data)}
									display={control.getDisplayState ? control.getDisplayState(data) : 'visible'}
									value={control.getValue(data)}
									options={control.getOptions ? control.getOptions(data) : []}
								/>
							);
						})}
					</div>
				);
			})}
		</div>
	);
});
