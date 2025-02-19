import { h, ComponentChildren } from 'preact';
import { jsx } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme } from '../../../providers';
import { Checkbox, CheckboxProps } from '../../Molecules/Checkbox';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { mergeProps } from '../../../utilities';
import type { ComponentProps } from '../../../types';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

export const BundleSelector = observer((properties: BundleSelectorProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<BundleSelectorProps> = {
		hideCheckboxes: false,
	};

	const props = mergeProps('bundleSelector', globalTheme, defaultProps, properties);

	const { children, checked, icon, seedText, seed, hideCheckboxes, onCheck, title, className, treePath } = props;

	const lastPath = treePath?.lastIndexOf(' ');
	const modifiedTreePath = treePath?.slice(0, lastPath);

	const subProps: BundleSelectorSubProps = {
		icon: {
			// default props
			name: 'bundle-selector',
			className: 'ss__recommendation-bundle__wrapper__selector__icon',
			size: 15,
			// global theme
			...globalTheme?.components?.icon,
			// component theme overrides
			theme: props?.theme,
			treePath: modifiedTreePath,
		},
		checkbox: {
			className: 'ss__recommendation-bundle__wrapper__selector__result-wrapper__checkbox',
			checked: checked,
			size: '18px',
			onClick: onCheck,
			lang: {
				checkbox: {
					attributes: {
						'aria-label': checked ? `remove product from bundle ${title}` : `add product to bundle ${title}`,
					},
				},
			},
			// global theme
			...globalTheme?.components?.checkbox,
			// component theme overrides
			theme: props?.theme,
			treePath: modifiedTreePath,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge({}, props.lang || {});
	const mergedLang = useLang(lang as any, {});

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
				{seedText && <div className={'ss__recommendation-bundle__wrapper__selector__result-wrapper__seed-badge'} {...mergedLang.seedText?.all}></div>}
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
	icon?: IconType | Partial<IconProps> | boolean;
	lang?: Partial<BundleSelectorLang>;
	title?: string;
}

export interface BundleSelectorLang {
	seedText: Lang<never>;
}
