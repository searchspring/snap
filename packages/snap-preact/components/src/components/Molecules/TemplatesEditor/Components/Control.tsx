import { observer } from 'mobx-react-lite';
import { ControlDisplayState, ControlOptions, ControlValues, ControlValueTypes } from '../../../../../../src/types';
import { Reset } from '../Assets';

export const Control = observer((props: ControlProps) => {
	const { type, label, description, onReset, display, showReset, value, options, onChange } = props;

	return display === 'hidden' ? null : (
		<div className="option checkbox">
			<label>{label}</label>
			<div className="reset">
				{showReset ? (
					<button
						title="Reset"
						onClick={() => {
							onReset();
						}}
					>
						<Reset />
					</button>
				) : null}
			</div>
			<div className="value" title={description}>
				{(() => {
					switch (type) {
						case 'text': {
							return <input type="text" value={value as string} onChange={(e) => onChange(e.target.value)} disabled={display === 'disabled'} />;
						}
						case 'number': {
							return (
								<input type="number" value={value as number} onChange={(e) => onChange(Number(e.target.value))} disabled={display === 'disabled'} />
							);
						}
						case 'checkbox': {
							return (
								<input type="checkbox" checked={value as boolean} onChange={(e) => onChange(e.target.checked)} disabled={display === 'disabled'} />
							);
						}
						case 'dropdown': {
							return (
								<select onChange={(e) => onChange(e.target.value)} disabled={display === 'disabled'} value={value as string | number}>
									{options?.map((group, groupIndex) =>
										group.group ? (
											<optgroup label={group.group} key={groupIndex}>
												{group.options.map((option, optionIndex) => (
													<option value={option.value as string | number} key={`${groupIndex}-${optionIndex}`}>
														{option.label || option.value}
													</option>
												))}
											</optgroup>
										) : (
											group.options.map((option, optionIndex) => (
												<option value={option.value as string | number} key={`${groupIndex}-${optionIndex}`}>
													{option.label || option.value}
												</option>
											))
										)
									)}
								</select>
							);
						}
						case 'color': {
							return <input type="color" value={value as string} onChange={(e) => onChange(e.target.value)} disabled={display === 'disabled'} />;
						}

						default: {
							return null;
						}
					}
				})()}
			</div>
		</div>
	);
});

type ControlProps = {
	type: ControlValueTypes;
	label: string;
	description: string;
	onReset: () => void;
	display: ControlDisplayState;
	showReset: boolean;
	value: ControlValues;
	options?: ControlOptions;
	onChange: (value: ControlValues) => void;
};
