import { h, Fragment } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { Button, ButtonProps } from '../../Atoms/Button/Button';
import { defined, Colour, mergeProps, mergeStyles } from '../../../utilities';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { ErrorType } from '@searchspring/snap-store-mobx';

import type { AbstractController } from '@searchspring/snap-controller';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

const warnColour = new Colour('#ecaa15');
const errorColour = new Colour('#cc1212');
const infoColour = new Colour('#4c3ce2');

const defaultStyles: StyleScript<ErrorHandlerProps> = ({ theme }) => {
	return css({
		borderRadius: '2px',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderLeft: '4px solid',
		'.ss__error-handler__message': {
			padding: '10px',
			display: 'flex',
			alignItems: 'center',
			'.ss__error-handler__message__type': {
				fontWeight: 'bold',
				marginRight: '5px',
			},

			'.ss__icon': {
				marginRight: '10px',
			},
		},

		'& .ss__error-handler__button': {
			backgroundColor: 'unset',
			color: 'inherit',
			borderColor: theme?.variables?.colors?.primary,
			width: ['150px', 'fit-content'],
			margin: '5px 10px',
			'&:hover': {
				backgroundColor: 'unset',
				borderColor: 'unset',
				color: 'unset',
				'.ss__icon': {
					fill: 'unset',
					stroke: 'unset',
				},
			},

			'.ss__icon': {
				margin: '0 5px 0 0',
			},
		},

		'&.ss__error-handler--error': {
			backgroundColor: errorColour.lighten(180).hex,
			borderLeftColor: errorColour.hex,
			'.ss__error-handler__message': {
				'.ss__icon': {
					fill: errorColour.hex,
				},
			},
		},
		'&.ss__error-handler--warning': {
			backgroundColor: warnColour.lighten(180).hex,
			borderLeftColor: warnColour.hex,
			'.ss__icon': {
				fill: warnColour.hex,
				stroke: warnColour.hex,
			},
			'.ss__error-handler__button': {
				color: warnColour.hex,
				borderColor: warnColour.hex,
				fontWeight: 'bold',
				textTransform: 'uppercase',
				display: 'inline-flex',
				alignItems: 'center',
				'.ss__button__content': {
					order: 2,
				},
				'.ss__button__icon': {
					order: 1,
					width: '10px',
					height: '10px',
					fill: warnColour.hex,
					stroke: warnColour.hex,
				},
				'&:hover': {
					color: warnColour.darken(30).hex,
					borderColor: warnColour.darken(30).hex,
					'.ss__button__icon': {
						fill: warnColour.darken(30).hex,
						stroke: warnColour.darken(30).hex,
					},
				},
			},
		},
		'&.ss__error-handler--info': {
			backgroundColor: infoColour.lighten(180).hex,
			borderLeftColor: infoColour.hex,
			'.ss__error-handler__message': {
				'.ss__icon': {
					fill: infoColour.hex,
				},
			},
		},
	});
};

export const ErrorHandler = observer((properties: ErrorHandlerProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<ErrorHandlerProps> = {
		treePath: globalTreePath,
	};

	const props = mergeProps('errorHandler', globalTheme, defaultProps, properties);

	const { controller, error, disableStyles, onRetryClick, className, treePath } = props;

	const subProps: ErrorHandlerSubProps = {
		icon: {
			// default props
			size: '18px',
			className: 'ss__error-handler__icon',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
		buttonRetry: {
			// default props
			className: 'ss__error-handler__button',
			icon: 'rotate-right',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
	};

	const errorObject = controller?.store?.error || error;

	const styling = mergeStyles<ErrorHandlerProps>(props, defaultStyles);

	//initialize lang
	const defaultLang = {
		warningText: {
			value: `Warning:`,
		},
		infoText: {
			value: `Info:`,
		},
		errorText: {
			value: `Error:`,
		},
		reloadText: {
			value: `Retry`,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		controller,
	});

	return Object.values(ErrorType).includes(errorObject?.type!) && errorObject?.message ? (
		<CacheProvider>
			<div className={classnames('ss__error-handler', `ss__error-handler--${errorObject.type}`, className)} {...styling}>
				{(() => {
					switch (errorObject.type) {
						case ErrorType.WARNING:
							return (
								<>
									<div className="ss__error-handler__message">
										<Icon {...subProps.icon} icon={'warn'} />
										<span className="ss__error-handler__message__type" {...mergedLang.warningText?.all}></span>
										<span className="ss__error-handler__message__content">{errorObject.message}</span>
									</div>
									{errorObject?.code == 429 ? (
										<Button
											{...subProps.buttonRetry}
											onClick={(e) => {
												onRetryClick ? onRetryClick(e) : controller?.search();
											}}
											{...mergedLang.reloadText.attributes}
										>
											<span className="ss__error-handler__button__text" {...mergedLang.reloadText.value}></span>
										</Button>
									) : null}
								</>
							);
						case ErrorType.ERROR:
							return (
								<div className="ss__error-handler__message">
									<Icon {...subProps.icon} icon={'error'} />
									<span className="ss__error-handler__message__type" {...mergedLang.errorText?.all}></span>
									<span className="ss__error-handler__message__content">{errorObject.message}</span>
								</div>
							);
						case ErrorType.INFO:
							return (
								<div className="ss__error-handler__message">
									<Icon {...subProps.icon} icon={'info'} />
									<span className="ss__error-handler__message__type" {...mergedLang.infoText?.all}></span>
									<span className="ss__error-handler__message__content">{errorObject.message}</span>
								</div>
							);
					}
				})()}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface ErrorHandlerProps extends ComponentProps {
	controller?: AbstractController;
	error?: {
		code?: number;
		type: ErrorType;
		message: string;
	};
	onRetryClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	lang?: Partial<ErrorHandlerLang>;
}

export interface ErrorHandlerLang {
	warningText: Lang<{
		controller: AbstractController;
	}>;
	infoText: Lang<{
		controller: AbstractController;
	}>;
	errorText: Lang<{
		controller: AbstractController;
	}>;
	reloadText: Lang<{
		controller: AbstractController;
	}>;
}

interface ErrorHandlerSubProps {
	icon: IconProps;
	buttonRetry: ButtonProps;
}
