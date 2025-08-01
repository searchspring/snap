import { Reset } from '../Assets';

export const CheckboxControl = (props: CheckboxControlProps) => {
	const { label, description, onReset, disabled, showReset, value, onChange } = props;
	return (
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
			<div className="value">
				<input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
				<span>{description}</span>
			</div>
		</div>
	);
};

type CheckboxControlProps = {
	label: string;
	description: string;
	onReset: () => void;
	disabled: boolean;
	showReset?: boolean;
	value: boolean;
	onChange: (value: boolean) => void;
};
