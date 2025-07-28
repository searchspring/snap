// import { AbstractedControl } from "../../../../../../src/Templates/Stores/ui-abstractions";

export const CheckboxControl = (props: CheckboxControlProps) => {
	const { label, description, onReset, disabled, showReset, value, onChange } = props;
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
			<input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
			<span>{description}</span>
		</div>
	);
};

type CheckboxControlProps = {
	label: string;
	description: string;
	onReset: () => void;
	// visible: boolean;
	disabled: boolean;
	showReset?: boolean;

	value: boolean;
	onChange: (value: boolean) => void;
};
