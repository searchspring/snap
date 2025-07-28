// import { AbstractedControl } from "../../../../../../src/Templates/Stores/ui-abstractions";

export const DropdownControl = (props: DropdownControlProps) => {
	const { label, description, onReset, disabled, showReset, value, options, onChange } = props;
	return (
		<div className="checkbox">
			<label>
				{label} <a target="snapdocs">i</a>:
			</label>
			{showReset && (
				<button
					onClick={() => {
						onReset();
					}}
				>
					reset
				</button>
			)}
			<select onChange={(e) => onChange(e.target.value)} disabled={disabled} value={value}>
				{options.map((option, index) => (
					<option value={option} key={index}>
						{option}
					</option>
				))}
			</select>
			<span>{description}</span>
		</div>
	);
};

type DropdownControlProps = {
	label: string;
	description: string;
	options: (string | number)[];
	onReset: () => void;
	// visible: boolean;
	disabled: boolean;
	showReset?: boolean;

	value: string | number;
	onChange: (value: string | number) => void;
};
