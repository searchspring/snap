/** @jsx jsx */
import { h, ComponentChildren } from 'preact';
import { jsx } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme } from '../../../providers';
import { Checkbox, CheckboxProps } from '../../Molecules/Checkbox';
import { Icon, IconProps } from '../../Atoms/Icon';

export const BundleSelector = observer((properties: BundleSelectorProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: BundleSelectorProps = {
		// default props
		showCheckboxes: true,
		qtyText: 'Qty:',
		// global theme
		...properties,
	};

	const { children, checked, quantity, icon, seedText, qtyText, showCheckboxes, onCheck, onInputChange } = props;

	const subProps: BundleSelectorSubProps = {
		icon: {
			// default props
			className: 'ss__bundled-recommendations__product-wrapper__selector__icon',
			color: 'black',
			size: 15,
			// global theme
			...globalTheme?.components?.icon,
		},
		checkbox: {
			className: 'ss__bundled-recommendations__product-wrapper__selector__result-wrapper__checkbox',
			checked: checked,
			onClick: onCheck,
			...globalTheme?.components?.checkbox,
		},
	};

	return (
		<div
			className={classnames(
				'ss__bundled-recommendations__product-wrapper__selector',
				seedText ? 'ss__bundled-recommendations__product-wrapper__selector--seed' : ''
			)}
		>
			<div className="ss__bundled-recommendations__product-wrapper__selector__result-wrapper">
				{showCheckboxes && <Checkbox {...subProps.checkbox} />}
				{seedText && <div className={'ss__bundled-recommendations__product-wrapper__selector__result-wrapper__seed-badge'}>{seedText}</div>}
				{children}
				{typeof quantity == 'number' && (
					<div className="ss__bundled-recommendations__product-wrapper__selector__qty">
						{qtyText}
						<input
							className="ss__bundled-recommendations__product-wrapper__selector__qty__input"
							onChange={onInputChange}
							aria-label="Product Quantity"
							type="number"
							min="0"
							placeholder="QTY #"
							value={quantity}
						/>
					</div>
				)}
			</div>
			<Icon {...subProps.icon} {...(typeof icon == 'string' ? { icon: icon as string } : (icon as Partial<IconProps>))} />
		</div>
	);
});

export interface BundleSelectorSubProps {
	icon: Partial<IconProps>;
	checkbox: Partial<CheckboxProps>;
}

export interface BundleSelectorProps {
	children?: ComponentChildren;
	checked?: boolean;
	quantity?: number;
	seedText?: string;
	showCheckboxes?: boolean;
	qtyText?: string;
	onCheck?: () => void;
	onInputChange?: (e: any) => void;
	icon?: string | Partial<IconProps> | boolean;
}
