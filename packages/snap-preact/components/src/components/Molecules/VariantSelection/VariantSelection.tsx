import { h, Fragment } from 'preact';
import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined } from '../../../utilities';
import { ComponentProps, RootNodeProperties } from '../../../types';
import type { VariantSelection as VariantSelectionType } from '@searchspring/snap-store-mobx';
import { List, ListProps } from '../List';
import { Swatches, SwatchesProps } from '../Swatches';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { Icon, IconProps } from '../../Atoms/Icon';
import { useA11y } from '../../../hooks';

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

	const { type, selection, disableStyles, className, style, treePath } = props;

	const subProps: VariantSelectionSubProps = {
		dropdown: {
			className: 'ss__variant-selection__dropdown',
			// TODO: label doesnt exist on dropdown?
			// label: selection.label || selection.field,
			// global theme
			...globalTheme?.components?.dropdown,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		icon: {
			// default props
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
			treePath,
		},
		list: {
			titleText: selection.field,
			className: 'ss__variant-selection__list',
			multiSelect: false,
			hideOptionCheckboxes: true,
			onSelect: (e, option) => selection.select(option.value),
			selected: selection.selected,

			// global theme
			...globalTheme?.components?.list,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		swatches: {
			className: 'ss__variant-selection__swatches',
			onSelect: (e, option) => selection.select(option.value),
			selected: selection.selected,
			// global theme
			...globalTheme?.components?.swatches,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const styling: RootNodeProperties = { 'ss-name': props.name };
	if (!disableStyles) {
		styling.css = [CSS.variantSelection(), style];
	} else if (style) {
		styling.css = [style];
	}

	const DropdownContent = (props: any) => {
		const { toggleOpen } = props;
		return (
			<ul className="ss__variant-selection__options" ref={(e) => useA11y(e, -1, true, () => toggleOpen())}>
				{selection.values.map((val: any) => {
					const selected = selection.selected?.value == val.value;
					return (
						<li
							className={classnames(`ss__variant-selection__option`, {
								'ss__variant-selection__option--selected': selected,
								'ss__variant-selection__option--disabled': val.disabled,
								'ss__variant-selection__option--unavailable': val.available === false,
							})}
							onClick={() => !val.disabled && selection.select(val.value)}
							ref={(e) => useA11y(e)}
							aria-selected={selected}
							aria-disabled={val.disabled || val.available === false}
						>
							{val.label}
						</li>
					);
				})}
			</ul>
		);
	};
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
															<Fragment />
														)}
													</div>
													<Icon icon={open ? 'angle-up' : 'angle-down'} {...subProps.icon} />
												</Fragment>
											);
										};

										return <Dropdown button={<Button />} {...subProps.dropdown} content={<DropdownContent />} />;
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
}
