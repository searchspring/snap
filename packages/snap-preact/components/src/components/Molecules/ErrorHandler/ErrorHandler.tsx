import { h, Fragment } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { Button, ButtonProps } from '../../Atoms/Button/Button';
import { defined, lightenDarkenColor, mergeProps } from '../../../utilities';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { ErrorType } from '@searchspring/snap-store-mobx';

import type { AbstractController } from '@searchspring/snap-controller';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

const CSS = {
	errorHandler: ({ theme }: Partial<ErrorHandlerProps>) =>
		css({
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

				'.ss__icon': {
					marginRight: '5px',
				},
			},

			'& .ss__error-handler__button': {
				backgroundColor: 'white',
				color: 'inherit',
				borderColor: theme?.variables?.color?.primary,
				width: ['150px', 'fit-content'],
				margin: '5px 10px',

				'.ss__icon': {
					marginRight: '5px',
				},
			},

			'&.ss__error-handler--error': {
				backgroundColor: lightenDarkenColor('#cc1212', 180),
				borderLeftColor: '#cc1212',
				'.ss__error-handler__message': {
					'.ss__icon': {
						fill: '#cc1212',
					},
				},
			},
			'&.ss__error-handler--warning': {
				backgroundColor: lightenDarkenColor('#ecaa15', 180),
				borderLeftColor: '#ecaa15',
				'.ss__icon': {
					fill: '#ecaa15',
				},
				'.ss__error-handler__button': {
					borderColor: '#ecaa15',
				},
			},
			'&.ss__error-handler--info': {
				backgroundColor: lightenDarkenColor('#4c3ce2', 180),
				borderLeftColor: '#4c3ce2',
				'.ss__error-handler__message': {
					'.ss__icon': {
						fill: '#4c3ce2',
					},
				},
			},
		}),
};

export const ErrorHandler = observer((properties: ErrorHandlerProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<ErrorHandlerProps> = {};

	const props = mergeProps('errorHandler', globalTheme, defaultProps, properties);

	const { controller, error, disableStyles, style, styleScript, onRetryClick, className } = props;

	const subProps: ErrorHandlerSubProps = {
		icon: {
			// default props
			className: 'ss__error-handler__icon',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
		},
		button: {
			// default props
			className: 'ss__error-handler__button',
			// global theme
			...globalTheme?.components?.button,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
		},
	};

	const errorObject = controller?.store?.error || error;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.errorHandler(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	//initialize lang
	const defaultLang = {
		warningText: {
			value: `<b>Warning:&nbsp;</b>`,
		},
		infoText: {
			value: `<b>Info:&nbsp;</b>`,
		},
		errorText: {
			value: `<b>Error:&nbsp;</b>`,
		},
		reloadText: {
			value: `Reload`,
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
										<span {...mergedLang.warningText?.all}></span>
										{errorObject.message}
									</div>
									{errorObject?.code == 429 ? (
										<Button
											{...subProps.button}
											onClick={(e) => {
												onRetryClick ? onRetryClick(e) : controller?.search();
											}}
											{...mergedLang.reloadText.attributes}
										>
											<Icon {...subProps.icon} icon={'rotate-right'} />
											<span {...mergedLang.reloadText.value}></span>
										</Button>
									) : null}
								</>
							);
						case ErrorType.ERROR:
							return (
								<div className="ss__error-handler__message">
									<Icon {...subProps.icon} icon={'error'} />
									<span {...mergedLang.errorText?.all}></span>
									{errorObject.message}
								</div>
							);
						case ErrorType.INFO:
							return (
								<div className="ss__error-handler__message">
									<Icon {...subProps.icon} icon={'info'} />
									<span {...mergedLang.infoText?.all}></span>
									{errorObject.message}
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
	button: ButtonProps;
}
