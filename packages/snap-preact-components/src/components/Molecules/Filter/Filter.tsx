/** @jsx jsx */
import { h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { defined } from '../../../utilities';
import { Theme, useTheme } from '../../../providers';
import { ComponentProps } from '../../../types';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Icon, IconProps } from '../../Atoms/Icon';

const CSS = {
	filter: ({ style }) =>
		css({
			textDecoration: 'none',
			display: 'inline-flex',
			'& .ss__filter__button': {
				alignItems: 'center',
				'& .ss__filter__button__icon': {
					marginRight: '5px',
				},
			},
			'& .ss__filter__label': {
				marginRight: '5px',
				fontWeight: 'bold',
			},
			...style,
		}),
};

// TODO: look into urlManager and how it connects in this case, left the href out for the time being
export const Filter = observer((properties: FilterProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: FilterProps = {
		// default props
		// global theme
		...globalTheme?.components?.filter,
		//props
		...properties,
		...properties.theme?.components?.filter,
	};

	const { facetLabel, valueLabel, url, hideFacetLabel, onClick, icon, separator, disableStyles, className, style } = props;

	const subProps: FilterSubProps = {
		button: {
			// default props
			className: 'ss__filter__button',
			// global theme
			...globalTheme?.components?.button,
			// component theme overrides
			...props.theme?.components?.button,
		},
		icon: {
			// default props
			icon: 'close-thin',
			className: 'ss__filter__button__icon',
			size: '10px',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
				icon,
			}),
			// component theme overrides
			...props.theme?.components?.icon,
		},
	};

	return (
		valueLabel && (
			<a
				css={!disableStyles && CSS.filter({ style })}
				className={classnames('ss__filter', className)}
				onClick={(e) => onClick && onClick(e as any)}
				{...url?.link}
			>
				<Button {...subProps.button}>
					<Icon {...subProps.icon} />
					{!hideFacetLabel && (
						<span className="ss__filter__label">
							{facetLabel}
							{separator && <span className="ss__filter__label__separator">{separator}</span>}
						</span>
					)}
					<span className="ss__filter__value">{valueLabel}</span>
				</Button>
			</a>
		)
	);
});

export interface FilterProps extends ComponentProps {
	facetLabel?: string;
	valueLabel: string;
	url?: any;
	hideFacetLabel?: boolean;
	onClick?: (e: Event) => void;
	icon?: string;
	separator?: string;
}

interface FilterSubProps {
	button: ButtonProps;
	icon: IconProps;
}
