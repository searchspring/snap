import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import { useState } from 'preact/hooks';
import classnames from 'classnames';
import deepmerge from 'deepmerge';
import { filters } from '@searchspring/snap-toolbox';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties, ListOption, SwatchOption } from '../../../types';
import { Lang, useA11y, useLang } from '../../../hooks';
import { Image, ImageProps } from '../../Atoms/Image';
import { cloneWithProps, defined } from '../../../utilities';

const CSS = {
	Grid: ({ theme, columns, gapSize, disableOverflowAction }: Partial<GridProps>) =>
		css({
			'& .ss__grid__options': {
				display: 'flex',
				flexFlow: 'row wrap',
				gridTemplateColumns: `repeat(${columns}, 1fr)`,
				gap: gapSize,
				gridAutoRows: `1fr`,

				'& .ss__grid__option': {
					display: 'flex',
					flexDirection: 'column',
					boxSizing: 'content-box',
					backgroundRepeat: 'no-repeat',
					backgroundSize: `calc(100% / ${columns} - ${2 * Math.round((columns! + 2) / 2)}px)`,
					backgroundPosition: 'center !important',
					justifyContent: 'center',
					alignItems: 'center',
					flex: '0 1 auto',
					border: `1px solid ${theme?.variables?.colors?.primary || '#333'}`,
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
						border: `2px solid ${theme?.variables?.colors?.primary || '#333'}`,
					},

					'&.ss__grid__option--disabled': {
						position: 'relative',
						opacity: '.5',
						cursor: 'none',
						pointerEvents: 'none',
					},

					'&.ss__grid__option--unavailable': {
						position: 'relative',
						opacity: '.5',
					},

					'&.ss__grid__option--disabled:before, &.ss__grid__option--unavailable:before': {
						content: '""',
						display: 'block',
						position: 'absolute',
						top: '50%',
						width: '90%',
						height: '1px',
						borderTop: '3px solid #eee',
						outline: '1px solid #ffff',
						transform: 'rotate(-45deg)',
					},

					'&:hover:not(.ss__grid__option--selected)': {
						cursor: 'pointer',
						background: theme?.variables?.colors?.hover?.background || '#f8f8f8',
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

			'& .ss__grid__show-more-wrapper': {
				'&:hover': {
					cursor: disableOverflowAction ? 'initial !important' : 'pointer !important',
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
		hideShowLess,
		gapSize,
		overflowButtonInGrid,
		disabled,
		options,
		disableStyles,
		onOverflowButtonClick,
		className,
		style,
		treePath,
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
			treePath,
		},
	};

	let selected = props.selected;

	const styling: RootNodeProperties = { 'ss-name': props.name };
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
	const remainder = Math.max(0, options.length - (limit - (overflowButtonInGrid ? 1 : 0)));

	const [limited, setLimited] = useState<number | boolean>(remainder);

	const OverflowButtonElem = () => {
		const showButton = hideShowLess ? (!limited ? false : true) : true;

		//initialize lang
		const defaultLang = {
			showMoreText: {
				value: `+ ${remainder}`,
			},
			showLessText: {
				value: 'Less',
			},
		};

		//deep merge with props.lang
		const lang = deepmerge(defaultLang, props.lang || {});
		const mergedLang = useLang(lang as any, {
			limited,
			remainder,
		});

		return showButton && remainder > 0 && options.length !== limit ? (
			<div
				className={`ss__grid__show-more-wrapper ${overflowButtonInGrid ? 'ss__grid__option' : ''}`}
				onClick={(e) => {
					!disableOverflowAction && setLimited(!limited);
					onOverflowButtonClick && onOverflowButtonClick(e, Boolean(limited), remainder);
				}}
				{...(limited ? mergedLang.showMoreText.attributes : mergedLang.showLessText.attributes)}
			>
				{overflowButton ? (
					cloneWithProps(overflowButton, { limited, remainder, treePath })
				) : limited ? (
					<span className={'ss__grid__show-more'} {...mergedLang.showMoreText.value}></span>
				) : remainder ? (
					<span className={'ss__grid__show-less'} {...mergedLang.showLessText.value}></span>
				) : (
					<Fragment />
				)}
			</div>
		) : (
			<Fragment />
		);
	};

	return typeof options == 'object' && options?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__grid', disabled ? 'ss__grid--disabled' : '', className)}>
				{titleText && <h5 className="ss__grid__title">{titleText}</h5>}

				<div className="ss__grid__options">
					{options.map((option, idx) => {
						const selected = selection.some((select: ListOption) => select.value == option.value);

						if (!limited || options.length == limit || idx < limit - (overflowButtonInGrid ? 1 : 0)) {
							return (
								<div
									className={classnames(`ss__grid__option ss__grid__option--${filters.handleize(option.value.toString())}`, {
										'ss__grid__option--selected': selected,
										'ss__grid__option--disabled': option?.disabled,
										'ss__grid__option--unavailable': option?.available === false,
									})}
									style={{ background: option.background ? option.background : option.backgroundImageUrl ? undefined : option.value }}
									onClick={(e) => !disabled && !option?.disabled && makeSelection(e as any, option)}
									ref={(e) => useA11y(e)}
									title={option.label}
									role="option"
									aria-selected={selected}
								>
									{!option.background && option.backgroundImageUrl ? (
										<Image {...subProps.image} src={option.backgroundImageUrl} alt={option.label || option.value.toString()} />
									) : (
										<Fragment />
									)}
									{!hideLabels ? <label className="ss__grid__option__label">{option.label || option.value}</label> : <Fragment />}
								</div>
							);
						}
					})}
					{overflowButtonInGrid ? <OverflowButtonElem /> : <Fragment />}
				</div>

				{!overflowButtonInGrid ? <OverflowButtonElem /> : <Fragment />}
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
	disabled?: boolean;
	hideShowLess?: boolean;
	selected?: ListOption | ListOption[];
	columns?: number;
	rows?: number;
	gapSize?: string;
	disableOverflowAction?: boolean;
	overflowButton?: JSX.Element;
	overflowButtonInGrid?: boolean;
	onOverflowButtonClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>, status: boolean, remainder: number) => void;
	lang?: Partial<GridLang>;
}

export interface GridLang {
	showMoreText: Lang<{
		limited: number | boolean;
		remainder: number;
	}>;
	showLessText: Lang<{
		limited: number | boolean;
		remainder: number;
	}>;
}

interface GridSubProps {
	image: Partial<ImageProps>;
}
