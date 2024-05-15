/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS, ListOption, SwatchOption } from '../../../types';
import { useState } from 'react';
import { useA11y } from '../../../hooks';
import { Image, ImageProps } from '../../Atoms/Image';
import { cloneWithProps, defined } from '../../../utilities';

const CSS = {
	Grid: ({ theme, columns, gapSize, disableOverflowAction }: Partial<GridProps>) =>
		css({
			'.ss__grid__options-wrapper': {
				display: 'flex',
				flexFlow: 'row wrap',
				gridTemplateColumns: `repeat(${columns}, 1fr)`,
				gap: gapSize,
				gridAutoRows: `1fr`,

				'& .ss__grid__option': {
					boxSizing: 'content-box',
					backgroundRepeat: 'no-repeat',
					backgroundSize: `calc(100% / ${columns} - ${2 * Math.round((columns! + 2) / 2)}px)`,
					backgroundPosition: 'center !important',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flex: '0 1 auto',
					border: `1px solid ${theme?.colors?.primary || '#333'}`,
					textAlign: 'center',
					wordBreak: 'break-all',
					padding: '1em 0',
					width: `calc(100% / ${columns} - ${2 * Math.round((columns! + 2) / 2)}px)`,
					margin: `0 ${gapSize} ${gapSize} 0`,

					'.ss__grid__option__label': {
						cursor: 'pointer',
					},

					[`:nth-of-type(${columns}n)`]: {
						marginRight: '0',
					},
					'&.ss__grid__option--selected': {
						background: theme?.colors?.primary || '#ccc',
						color: theme?.colors?.text?.secondary,
					},

					'&.ss__grid__option--disabled': {
						position: 'relative',
						opacity: '.5',
					},
					'&.ss__grid__option--disabled:before': {
						content: '""',
						display: 'block',
						position: 'absolute',
						top: '50%',
						left: '0',
						right: '0',
						margin: 'auto',
						width: '40px',
						height: '1px',
						borderTop: '1px solid black',
					},

					'&:hover:not(.ss__grid__option--selected)': {
						cursor: 'pointer',
						background: theme?.colors?.hover || '#f8f8f8',
					},
				},

				'@supports (display: grid)': {
					display: 'grid',

					'& .ss__grid__option': {
						padding: '0',
						margin: '0',
						width: 'initial',
					},
					'&::before': {
						content: '""',
						width: 0,
						paddingBottom: '100%',
						gridRow: '1 / 1',
						gridColumn: '1 / 1',
					},
					'&> *:first-of-type': {
						gridRow: '1 / 1',
						gridColumn: '1 / 1',
					},
				},
			},

			'.ss__grid__show-more-wrapper': {
				'&:hover': {
					cursor: disableOverflowAction ? 'initial !important' : 'pointer !important',
					background: !disableOverflowAction ? `${theme?.colors?.hover || '#f8f8f8'} !important` : 'initial !important',
				},
			},
		}),
};

export function Grid(properties: GridProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: GridProps = {
		// default props
		multiSelect: false,
		columns: 4,
		gapSize: '8px',
		// global theme
		...globalTheme?.components?.grid,
		// props
		...properties,
		...properties.theme?.components?.grid,
	};

	const {
		titleText,
		onSelect,
		hideLabels,
		disableOverflowAction,
		multiSelect,
		overflowButton,
		columns,
		rows,
		gapSize,
		overflowButtonInGrid,
		disabled,
		options,
		disableStyles,
		onOverflowButtonClick,
		className,
		style,
	} = props;

	const subProps: GridSubProps = {
		image: {
			// default props
			className: 'ss__swatches__Image',
			// global theme
			...globalTheme?.components?.image,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	let selected = props.selected;

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.Grid({ theme, columns, gapSize, disableOverflowAction }), style];
	} else if (style) {
		styling.css = [style];
	}

	if (selected && !Array.isArray(selected)) {
		selected = [selected];
	}

	// selection state
	const [selection, setSelection] = useState((selected as ListOption[]) || []);

	const makeSelection = (e: React.MouseEvent<HTMLElement>, option: ListOption) => {
		if (multiSelect) {
			let newArray: ListOption[];

			if (selection.find((select) => select.value === option.value)) {
				newArray = [...selection];
				newArray.splice(
					newArray.findIndex((select) => select.value === option.value),
					1
				);
			} else {
				newArray = [...selection, option];
			}

			if (onSelect) {
				onSelect(e, option, newArray);
			}
			setSelection(newArray);
		} else {
			if (onSelect) {
				onSelect(e, option, [option]);
			}
			setSelection([option]);
		}
	};

	const limit = rows && columns ? columns * rows : options.length;
	const remainder = Math.max(0, options.length - limit);

	const [limited, setLimited] = useState<number | boolean>(remainder);

	const OverflowButtonElem = () => (
		<div
			className={`ss__grid__show-more-wrapper ${overflowButtonInGrid ? 'ss__grid__option' : ''}`}
			onClick={() => {
				!disableOverflowAction && setLimited(!limited);
				onOverflowButtonClick && onOverflowButtonClick(Boolean(limited), remainder);
			}}
		>
			{overflowButton ? (
				cloneWithProps(overflowButton, { limited, remainder })
			) : limited ? (
				<span className={'ss__grid__show-more'}>{`+ ${remainder}`}</span>
			) : remainder ? (
				<span className={'ss__grid__show-less'}>Show Less</span>
			) : (
				<></>
			)}
		</div>
	);

	return typeof options == 'object' && options?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__grid', disabled ? 'ss__grid--disabled' : '', className)}>
				{titleText && <h5 className="ss__grid__title">{titleText}</h5>}

				<div className="ss__grid__options-wrapper">
					{options.map((option, idx) => {
						const selected = selection.some((select: ListOption) => select.value == option.value);

						if (!limited || idx < limit - (overflowButtonInGrid ? 1 : 0)) {
							return (
								<div
									className={`ss__grid__option ${selected ? 'ss__grid__option--selected' : ''} ${
										option.disabled ? 'ss__grid__option--disabled' : ''
									}`}
									style={{ background: option.background ? option.background : option.backgroundImageUrl ? `` : option.value }}
									onClick={(e) => !disabled && makeSelection(e as any, option)}
									ref={(e) => useA11y(e)}
									title={option.label}
									role="option"
									aria-selected={selected}
								>
									{!option.background && option.backgroundImageUrl ? (
										<Image {...subProps.image} src={option.backgroundImageUrl} alt={option.label || option.value.toString()} />
									) : (
										<></>
									)}
									{!hideLabels ? <label className="ss__grid__option__label">{option.label || option.value}</label> : <></>}
								</div>
							);
						}
					})}
					{overflowButtonInGrid ? <OverflowButtonElem /> : <></>}
				</div>

				{!overflowButtonInGrid ? <OverflowButtonElem /> : <></>}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
}

export interface GridProps extends ComponentProps {
	options: SwatchOption[];
	hideLabels?: boolean;
	multiSelect?: boolean;
	onSelect?: (e: React.MouseEvent<HTMLElement>, option: ListOption, selected: ListOption[]) => void;
	titleText?: string;
	selected?: ListOption | ListOption[];
	columns?: number;
	rows?: number;
	gapSize?: string;
	disableOverflowAction?: boolean;
	overflowButton?: JSX.Element;
	overflowButtonInGrid?: boolean;
	onOverflowButtonClick?: (status: boolean, remainder: number) => void;
}

interface GridSubProps {
	image: Partial<ImageProps>;
}
