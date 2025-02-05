import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';

const defaultStyles: StyleScript<SearchInputProps> = ({ theme }) => {
	return css({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: `1px solid ${theme?.variables?.colors?.primary || '#ccc'}`,

		'& .ss__icon': {
			padding: '5px',
		},

		'& .ss__search-input__input': {
			width: '100%',
			outline: 'none',
			border: '0',
			boxSizing: 'border-box',
		},
	});
};

export const SearchInput = observer((properties: SearchInputProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();
	const defaultProps: Partial<SearchInputProps> = {
		placeholder: 'Search',
		hideIcon: false,
		treePath: globalTreePath,
	};

	const props = mergeProps('searchInput', globalTheme, defaultProps, properties);

	const { placeholder, onChange, hideIcon, disableStyles, className, treePath } = props;

	const subProps: SearchInputSubProps = {
		icon: {
			// default props
			className: 'ss__search-input__icon',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const styling = mergeStyles<SearchInputProps>(props, defaultStyles);

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__search-input', className)}>
				{!hideIcon && <Icon {...subProps.icon} icon="search" />}
				<input
					type="text"
					className="ss__search-input__input"
					onChange={(e) => {
						onChange && onChange(e);
					}}
					placeholder={placeholder}
				/>
			</div>
		</CacheProvider>
	);
});

export interface SearchInputProps extends ComponentProps {
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	hideIcon?: boolean;
}

interface SearchInputSubProps {
	icon: Partial<IconProps>;
}
