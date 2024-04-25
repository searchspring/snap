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
import { Grid, GridProps } from '../Grid';
import { Swatches, SwatchesProps } from '../Swatches';
import { Option, Select, SelectProps } from '../Select';

const CSS = {
	variantSelection: () => css({}),
};

export const VariantSelection = observer((properties: VariantSelectionProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: VariantSelectionProps = {
		// default props
		type: 'select',
		// global theme
		...globalTheme?.components?.variantSelection,
		// props
		...properties,
		...properties.theme?.components?.variantSelection,
	};

	const { type, selection, hideTitle, disableStyles, className, style } = props;

	const subProps: VariantSelectionSubProps = {
		select: {
			className: 'ss__variant-selection__select',
			label: !hideTitle ? selection.field : undefined,
			// global theme
			...globalTheme?.components?.select,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		list: {
			titleText: !hideTitle ? selection.field : undefined,
			className: 'ss__variant-selection__list',
			// global theme
			...globalTheme?.components?.list,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		grid: {
			className: 'ss__variant-selection__grid',
			titleText: !hideTitle ? selection.field : undefined,
			// global theme
			...globalTheme?.components?.grid,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		swatches: {
			className: 'ss__variant-selection__swatches',
			// global theme
			...globalTheme?.components?.grid,
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
			<div {...styling} className={classnames('ss__variant-selection', className)}>
				{(() => {
					switch (type) {
						case 'select':
							return (
								<Fragment>
									{(() => {
										const convertedValues: Option[] = selection.values.map(
											(val) =>
												(val = {
													//@ts-ignore - disabled isnt available on SelectionValue
													disabled: !val.available,
													label: val.label || val.value,
													...val,
												})
										);

										return (
											<Select {...subProps.select} options={convertedValues} onSelect={(e, option) => selection.select(option?.value as string)} />
										);
									})()}
								</Fragment>
							);
						case 'grid':
							return (
								<Fragment>
									{(() => {
										const convertedValues: ListOption[] = selection.values.map(
											(val) =>
												(val = {
													//@ts-ignore - disabled isnt available on SelectionValue
													disabled: !val.available,
													...val,
												})
										);

										return (
											<Grid
												{...subProps.grid}
												options={convertedValues}
												onSelect={(e, option) => {
													selection.select(option.value as string);
												}}
												selected={selection.selected}
											/>
										);
									})()}
								</Fragment>
							);
						case 'list':
							return (
								<Fragment>
									{(() => {
										const convertedValues: ListOption[] = selection.values.map(
											(val) =>
												(val = {
													//@ts-ignore - disabled isnt available on SelectionValue
													disabled: !val.available,
													...val,
												})
										);

										return (
											<List
												{...subProps.list}
												options={convertedValues}
												onSelect={(e, option) => selection.select(option.value as string)}
												multiSelect={false}
												hideOptionCheckboxes={true}
												selected={selection.selected}
											/>
										);
									})()}
								</Fragment>
							);
						case 'swatches':
							return (
								<Fragment>
									{(() => {
										const convertedValues: ListOption[] = selection.values.map(
											(val) =>
												(val = {
													//@ts-ignore - disabled isnt available on SelectionValue
													disabled: !val.available,
													...val,
												})
										);

										return (
											<Swatches
												{...subProps.swatches}
												options={convertedValues}
												onSelect={(e, option) => selection.select(option.value as string)}
												selected={selection.selected}
											/>
										);
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
	select: SelectProps;
	list: ListProps;
	grid: GridProps;
	swatches: SwatchesProps;
}

export interface VariantSelectionProps extends ComponentProps {
	selection: VariantSelectionType;
	type?: 'select' | 'swatches' | 'grid' | 'list';
	hideTitle?: boolean;
}
