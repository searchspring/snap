import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import { useState } from 'preact/hooks';
import classnames from 'classnames';
import deepmerge from 'deepmerge';
import { filters } from '@searchspring/snap-toolbox';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, ListOption, SwatchOption, StyleScript } from '../../../types';
import { Lang, useA11y, useLang } from '../../../hooks';
import { Image, ImageProps } from '../../Atoms/Image';
import { cloneWithProps, defined, mergeProps, mergeStyles } from '../../../utilities';

const defaultStyles: StyleScript<GridProps> = ({ gapSize, columns, theme, disableOverflowAction }) => {
	return css({
		'.ss__grid__options': {
			display: 'flex',
			flexFlow: 'row wrap',
			gridTemplateColumns: `repeat(${columns}, 1fr)`,
			gap: gapSize,
			gridAutoRows: `1fr`,

			'.ss__grid__option': {
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
				},
			},

			'@supports (display: grid)': {
				display: 'grid',

				'.ss__grid__option': {
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
			'&:not(.ss__grid__option)': {
				margin: '8px',
			},
			'&:hover': {
				cursor: disableOverflowAction ? 'initial !important' : 'pointer !important',
			},
		},
	});
};

export function Grid(properties: GridProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();
	const defaultProps: Partial<GridProps> = {
		// default props
		multiSelect: false,
		columns: 4,
		gapSize: '8px',
		treePath: globalTreePath,
	};

	const props = mergeProps('grid', globalTheme, defaultProps, properties);

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
		overflowButtonInGrid,
		disabled,
		options,
		disableStyles,
		onOverflowButtonClick,
		className,
		internalClassName,
		treePath,
		disableA11y,
	} = props;

	const subProps: GridSubProps = {
		image: {
			// default props
			internalClassName: 'ss__grid__image',
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

	const styling = mergeStyles<GridProps>(props, defaultStyles);

	if (selected && !Array.isArray(selected)) {
		selected = [selected];
	}

	// selection state
	const [selection, setSelection] = useState((selected as ListOption[]) || []);

	// original selection state
	const [originalSelected] = useState((selected as ListOption[]) || []);
	// reset selection if 'selected' prop changes
	try {
		if (selected) {
			const originalSelectedstr = JSON.stringify(originalSelected);
			const selectedstr = JSON.stringify(selected);
			const selectionstr = JSON.stringify(selection);
			if (originalSelectedstr !== selectedstr && selectedstr !== selectionstr) {
				setSelection(selected);
			}
		}
	} catch (e) {
		// noop
	}

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

	const [limited, setLimited] = useState<boolean>(!!remainder);

	const OverflowButtonElem = () => {
		const showButton = hideShowLess ? limited : true;

		//initialize lang
		const defaultLang = {
			showMoreText: {
				value: overflowButtonInGrid ? `+ ${remainder}` : 'Show More',
			},
			showLessText: {
				value: overflowButtonInGrid ? `- ${remainder}` : 'Show Less',
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
				role={'button'}
				ref={(e) => (!disableA11y && !disableOverflowAction ? useA11y(e) : null)}
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
			<div {...styling} className={classnames('ss__grid', disabled ? 'ss__grid--disabled' : '', className, internalClassName)}>
				{titleText && <h5 className="ss__grid__title">{titleText}</h5>}

				<div className="ss__grid__options">
					{options.map((option, idx) => {
						const selected = selection.some((select: ListOption) => select.value == option.value);

						if (!limited || options.length == limit || idx < limit - (overflowButtonInGrid ? 1 : 0)) {
							return (
								<div
									className={classnames(`ss__grid__option ss__grid__option-value--${filters.handleize(option.value.toString())}`, {
										'ss__grid__option--selected': selected,
										'ss__grid__option--disabled': option?.disabled,
										'ss__grid__option--unavailable': option?.available === false,
									})}
									style={{ background: option.background ? option.background : option.backgroundImageUrl ? undefined : option.value }}
									onClick={(e) => !disabled && !option?.disabled && makeSelection(e as any, option)}
									ref={(e) => useA11y(e)}
									title={option.label || option.value.toString()}
									role="option"
									aria-selected={selected}
									aria-disabled={option.disabled}
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
	disableA11y?: boolean;
}

export interface GridLang {
	showMoreText: Lang<{
		limited: boolean;
		remainder: number;
		overflowButtonInGrid: boolean;
	}>;
	showLessText: Lang<{
		limited: boolean;
		remainder: number;
		overflowButtonInGrid: boolean;
	}>;
}

interface GridSubProps {
	image: Partial<ImageProps>;
}
