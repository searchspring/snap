/** @jsx jsx */
import { h, Fragment } from 'preact';
import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import type { VariantSelection as VariantSelectionType } from '@searchspring/snap-store-mobx';
import { List, ListProps } from '../List';
import { Swatches, SwatchesProps } from '../Swatches';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { Icon, IconProps } from '../../Atoms/Icon';

const CSS = {
	variantSelection: () =>
		css({
			'.ss__variant-selection__dropdown': {
				'.ss__dropdown__button': {
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					'.ss__dropdown__button-wrapper': {
						display: 'flex',
						gap: '5px',
					},
				},

				'.ss__dropdown__content': {
					minWidth: 'auto',
					left: '0',
					right: '0',

					'.ss__variant-selection__option': {
						cursor: 'pointer',
						position: 'relative',
					},

					'.ss__variant-selection__option:hover': {
						fontWeight: 'bold',
					},

					'.ss__variant-selection__option--selected': {
						fontWeight: 'bold',
					},

					'.ss__variant-selection__option--disabled': {
						pointerEvents: 'none',
						cursor: 'initial',
					},

					'.ss__variant-selection__option--disabled, .ss__variant-selection__option--unavailable': {
						textDecoration: 'line-through',
						opacity: 0.5,
					},
				},
			},
		}),
};

export const VariantSelection = observer((properties: VariantSelectionProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: VariantSelectionProps = {
		// default props
		type: 'dropdown',
		// global theme
		...globalTheme?.components?.variantSelection,
		// props
		...properties,
		...properties.theme?.components?.variantSelection,
	};

	const { type, selection, onSelect, disableStyles, className, style } = props;

	const onSelectHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>, value: string) => {
		if (onSelect) {
			onSelect(e, value);
		}

		selection.select(value);
	};
	const subProps: VariantSelectionSubProps = {
		dropdown: {
			name: `ss__variant-selection__dropdown--${selection.field}`,
			className: 'ss__variant-selection__dropdown',
			label: selection.label || selection.field,
			// global theme
			...globalTheme?.components?.dropdown,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		icon: {
			// default props
			name: `ss__variant-selection__icon--${selection.field}`,
			className: 'ss__variant-selection__icon',
			size: '12px',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		list: {
			name: `ss__variant-selection__list--${selection.field}`,
			titleText: selection.field,
			className: 'ss__variant-selection__list',
			multiSelect: false,
			hideOptionCheckboxes: true,
			onSelect: (e, option) => onSelectHandler(e, option.value as string),
			selected: selection.selected,

			// global theme
			...globalTheme?.components?.list,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		swatches: {
			name: `ss__variant-selection__swatches--${selection.field}`,
			className: 'ss__variant-selection__swatches',
			onSelect: (e, option) => onSelectHandler(e, option.value as string),
			selected: selection.selected,
			// global theme
			...globalTheme?.components?.swatches,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.variantSelection(), style];
	} else if (style) {
		styling.css = [style];
	}

	return selection.values.length ? (
		<CacheProvider>
			<div
				{...styling}
				className={classnames('ss__variant-selection', `ss__variant-selection--${type}`, `ss__variant-selection--${selection.field}`, className)}
			>
				{(() => {
					switch (type) {
						case 'dropdown':
							return (
								<Fragment>
									{(() => {
										//todo prettify the button
										const Button = (props: any) => {
											const { open } = props;
											return (
												<Fragment>
													<div className="ss__dropdown__button-wrapper">
														<span className="ss__dropdown__button-wrapper__label">{selection.label}</span>

														{selection.selected ? (
															<span className="ss__dropdown__button-wrapper__selection">({selection.selected.value})</span>
														) : (
															<></>
														)}
													</div>
													<Icon icon={open ? 'angle-up' : 'angle-down'} {...subProps.icon} />
												</Fragment>
											);
										};

										return (
											<Dropdown button={<Button />} {...subProps.dropdown}>
												<div className="ss__variant-selection__options">
													{selection.values.map((val: any) => {
														const selected = selection.selected?.value == val.value;
														return (
															<div
																className={classnames(`ss__variant-selection__option`, {
																	'ss__variant-selection__option--selected': selected,
																	'ss__variant-selection__option--disabled': val.disabled,
																	'ss__variant-selection__option--unavailable': val.available === false,
																})}
																onClick={(e) => !val.disabled && onSelectHandler(e, val.value)}
															>
																{val.label}
															</div>
														);
													})}
												</div>
											</Dropdown>
										);
									})()}
								</Fragment>
							);
						case 'list':
							return (
								<Fragment>
									{(() => {
										return <List {...subProps.list} options={selection.values} />;
									})()}
								</Fragment>
							);
						case 'swatches':
							return (
								<Fragment>
									{(() => {
										return <Swatches {...subProps.swatches} options={selection.values} />;
									})()}
								</Fragment>
							);
					}
				})()}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface VariantSelectionSubProps {
	dropdown: Partial<DropdownProps>;
	icon: Partial<IconProps>;
	list: Partial<ListProps>;
	swatches: Partial<SwatchesProps>;
}

export interface VariantSelectionProps extends ComponentProps {
	selection: VariantSelectionType;
	type?: 'dropdown' | 'swatches' | 'list';
	onSelect?: (e: React.MouseEvent<HTMLElement, MouseEvent>, value: string) => void;
}
