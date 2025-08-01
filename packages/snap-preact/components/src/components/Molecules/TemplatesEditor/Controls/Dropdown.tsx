import { Reset } from '../Assets';

export const DropdownControl = (props: DropdownControlProps) => {
	const { label, description, onReset, disabled, showReset, value, options, onChange } = props;
	return (
		<div className="option dropdown">
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
				<select onChange={(e) => onChange(e.target.value)} disabled={disabled} value={value}>
					{options.map((option, index) => (
						<option value={option} key={index}>
							{option}
						</option>
					))}
				</select>
				<span>{description}</span>
			</div>
		</div>
	);
};

type DropdownControlProps = {
	label: string;
	description: string;
	options: (string | number)[];
	onReset: () => void;
	disabled: boolean;
	showReset?: boolean;
	value?: string | number;
	onChange: (value: string | number) => void;
};
