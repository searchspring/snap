/** @jsx jsx */
import { h, Fragment } from 'preact';
import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined } from '../../../utilities';
import { ComponentProps, ListOption, StylingCSS } from '../../../types';
import type { VariantSelection as VariantSelectionType } from '@searchspring/snap-store-mobx';
import { List, ListProps } from '../List';
import { Swatches, SwatchesProps } from '../Swatches';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';

const CSS = {
	variantSelection: () =>
		css({
			'.ss__variant-selection__dropdown': {
				'.ss__dropdown__button': {
					display: 'flex',
					flexDirection: 'row',

					label: {
						marginLeft: '5px',
						fontSize: '12px',
					},

					span: {
						padding: '0px 15px',
					},

					'.ss__dropdown__button-wrapper': {
						width: '100%',
						justifyContent: 'flex-start',
						display: 'flex',
						alignItems: 'center',
						label: {
							cursor: 'pointer',
						},
						span: {
							cursor: 'pointer',
						},
					},
					'.ss__icon': {
						marginLeft: '10px',
						marginRight: '10px',
					},
				},

				'.ss__dropdown__content': {
					minWidth: 'auto',
					left: '0',
					right: '0',

					'.ss__variant-selection__option': {
						cursor: 'pointer',
					},

					'.ss__variant-selection__option:hover': {
						fontWeight: 'bold',
					},

					'.ss__variant-selection__option--selected': {
						fontWeight: 'bold',
					},

					'.ss__variant-selection__option--disabled': {
						opacity: '.5',
					},

					'.ss__variant-selection__option--disabled:before': {
						content: '""',
						display: 'block',
						position: 'absolute',
						top: '50%',
						left: '0',
						right: '0',
						width: '40px',
						height: '1px',
						borderTop: '1px solid black',
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

	const { type, selection, disableStyles, className, style } = props;

	const subProps: VariantSelectionSubProps = {
		dropdown: {
			name: `ss__variant-selection__dropdown-${selection.field}`,
			className: 'ss__variant-selection__dropdown',
			label: selection.field,
			// global theme
			...globalTheme?.components?.dropdown,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		list: {
			name: `ss__variant-selection__list-${selection.field}`,
			titleText: selection.field,
			className: 'ss__variant-selection__list',
			multiSelect: false,
			hideOptionCheckboxes: true,
			clickableDisabledOptions: true,
			onSelect: (e, option) => selection.select(option.value as string),
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
			name: `ss__variant-selection__swatches-${selection.field}`,
			className: 'ss__variant-selection__swatches',
			onSelect: (e, option) => selection.select(option.value as string),
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

	const convertedValues: ListOption[] = selection.values.map(
		(val: any) =>
			(val = {
				//@ts-ignore - disabled isnt available on SelectionValue
				disabled: !val.available,
				...val,
			})
	);

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
										const Button = () => {
											return (
												<div className="ss__dropdown__button-wrapper">
													<span>{selection.field}</span>
													{selection.selected?.value ? <label>({selection.selected.value})</label> : <></>}
												</div>
											);
										};

										return (
											<Dropdown button={<Button />} {...subProps.dropdown}>
												<div>
													{selection.values.map((val: any) => {
														const selected = selection.selected?.value == val.value;
														return (
															<div
																className={`
																	ss__variant-selection__option
																	${selected ? 'ss__variant-selection__option--selected' : ''} 
																	${val.available ? '' : 'ss__variant-selection__option--disabled'}
																`}
																onClick={() => selection.select(val.value)}
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
										return <List {...subProps.list} options={convertedValues} />;
									})()}
								</Fragment>
							);
						case 'swatches':
							return (
								<Fragment>
									{(() => {
										return <Swatches {...subProps.swatches} options={convertedValues} />;
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
	list: ListProps;
	swatches: SwatchesProps;
}

export interface VariantSelectionProps extends ComponentProps {
	selection: VariantSelectionType;
	type?: 'dropdown' | 'swatches' | 'list' | 'grid';
}
