/** @jsx jsx */
import { h, ComponentChildren } from 'preact';
import { jsx } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Theme, useTheme } from '../../../providers';
import { Checkbox, CheckboxProps } from '../../Molecules/Checkbox';
import { Icon, IconProps } from '../../Atoms/Icon';
import type { ComponentProps } from '../../../types';

export const BundleSelector = observer((properties: BundleSelectorProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: BundleSelectorProps = {
		// default props
		hideCheckboxes: false,
		// global theme
		...properties,
	};

	const { className, children, checked, icon, seedText, seed, hideCheckboxes, onCheck } = props;

	const subProps: BundleSelectorSubProps = {
		icon: {
			// default props
			className: 'ss__recommendation-bundle__wrapper__selector__icon',
			size: 15,
			// global theme
			...globalTheme?.components?.icon,
			// component theme overrides
			theme: props?.theme,
		},
		checkbox: {
			className: 'ss__recommendation-bundle__wrapper__selector__result-wrapper__checkbox',
			checked: checked,
			size: '18px',
			onClick: onCheck,
			// global theme
			...globalTheme?.components?.checkbox,
			// component theme overrides
			theme: props?.theme,
		},
	};

	return (
		<div
			className={classnames(
				'ss__recommendation-bundle__wrapper__selector',
				checked ? 'ss__recommendation-bundle__wrapper__selector--selected' : '',
				seedText || seed ? 'ss__recommendation-bundle__wrapper__selector--seed' : '',
				className
			)}
		>
			<div className="ss__recommendation-bundle__wrapper__selector__result-wrapper">
				{!hideCheckboxes && <Checkbox {...subProps.checkbox} />}
				{seedText && <div className={'ss__recommendation-bundle__wrapper__selector__result-wrapper__seed-badge'}>{seedText}</div>}
				{children}
			</div>
			<Icon {...subProps.icon} {...(typeof icon == 'string' ? { icon: icon as string } : (icon as Partial<IconProps>))} />
		</div>
	);
});

export interface BundleSelectorSubProps {
	icon: Partial<IconProps>;
	checkbox: Partial<CheckboxProps>;
}

export interface BundleSelectorProps extends ComponentProps {
	children?: ComponentChildren;
	checked?: boolean;
	seedText?: string;
	seed?: boolean;
	hideCheckboxes?: boolean;
	onCheck?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	icon?: string | Partial<IconProps> | boolean;
}
