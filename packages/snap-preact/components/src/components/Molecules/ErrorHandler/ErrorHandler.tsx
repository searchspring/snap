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

	const { controller, error, disableStyles, style, styleScript, onRetryClick, className, treePath } = props;

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
			treePath,
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
			treePath,
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
										<b>Warning:&nbsp;</b>
										{errorObject.message}
									</div>
									{errorObject?.code == 429 ? (
										<Button
											{...subProps.button}
											onClick={(e) => {
												onRetryClick ? onRetryClick(e) : controller?.search();
											}}
										>
											<Icon {...subProps.icon} icon={'rotate-right'} />
											Reload
										</Button>
									) : null}
								</>
							);
						case ErrorType.ERROR:
							return (
								<div className="ss__error-handler__message">
									<Icon {...subProps.icon} icon={'error'} />
									<b>Error:&nbsp;</b>
									{errorObject.message}
								</div>
							);
						case ErrorType.INFO:
							return (
								<div className="ss__error-handler__message">
									<Icon {...subProps.icon} icon={'info'} />
									<b>Info:&nbsp;</b>
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
}

interface ErrorHandlerSubProps {
	icon: IconProps;
	button: ButtonProps;
}
