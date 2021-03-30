/** @jsx jsx */
import { h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { defined } from '../../../utilities';
import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps } from '../../../types';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Icon, IconProps } from '../../Atoms/Icon';

const CSS = {
	filter: ({ style }) =>
		css({
			textDecoration: 'none',
			display: 'inline-flex',
			'& .ss-button': {
				alignItems: 'center',
			},
			'& .ss-icon': {
				marginRight: '5px',
			},
			'& .ss-filter__facet-label': {
				marginRight: '5px',
				fontWeight: 'bold',
			},
			...style,
		}),
};

// TODO: look into urlManager and how it connects in this case, left the href out for the time being
export const Filter = observer(
	(properties: FilterProps): JSX.Element => {
		const globalTheme: Theme = useTheme();

		const props: FilterProps = {
			// default props
			hideFacetLabel: false,
			disableStyles: false,
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
				className: 'ss-filter__button',
				// global theme
				...globalTheme?.components?.button,
				// component theme overrides
				...props.theme?.components?.button,
			},
			icon: {
				// default props
				icon: 'close-thin',
				className: 'ss-filter__button-icon',
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
					className={classnames('ss-filter', className)}
					onClick={(e) => {
						onClick && onClick(e as any);
					}}
					{...url?.link}
				>
					<Button {...subProps.button}>
						<Icon {...subProps.icon} />
						{!hideFacetLabel && (
							<span className={'ss-filter__facet-label'}>
								{facetLabel}
								{separator && <span className={'ss-filter__separator'}>{separator}</span>}
							</span>
						)}
						<span className={'ss-filter__value-label'}>{valueLabel}</span>
					</Button>
				</a>
			)
		);
	}
);

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
	button?: ButtonProps;
	icon?: IconProps;
}
