import { h, ComponentChildren } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Theme, useTheme } from '../../../providers';
import { Checkbox, CheckboxProps } from '../../Molecules/Checkbox';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { mergeProps } from '../../../utilities';
import type { ComponentProps, StylingCSS } from '../../../types';

const CSS = {
	bundleSelector: ({}: Partial<BundleSelectorProps>) => css({}),
};

export const BundleSelector = observer((properties: BundleSelectorProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<BundleSelectorProps> = {
		hideCheckboxes: false,
	};

	const props = mergeProps('bundleSelector', globalTheme, defaultProps, properties);

	const { children, checked, icon, seedText, seed, hideCheckboxes, onCheck, disableStyles, className, style, styleScript } = props;

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
			size: 18,
			onClick: onCheck,
			// global theme
			...globalTheme?.components?.checkbox,
			// component theme overrides
			theme: props?.theme,
		},
	};

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.bundleSelector(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<div
			{...styling}
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
			{icon ? <Icon {...subProps.icon} {...(typeof icon == 'string' ? { icon: icon } : (icon as Partial<IconProps>))} /> : undefined}
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
	onCheck?: () => void;
	icon?: IconType | Partial<IconProps> | false;
}
