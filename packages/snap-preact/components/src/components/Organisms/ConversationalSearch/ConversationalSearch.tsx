import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import deepmerge from 'deepmerge';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { mergeProps, mergeStyles } from '../../../utilities';
import { ComponentProps, StyleScript } from '../../../types';
import type { ConversationalSearchController } from '@searchspring/snap-controller';
import { Button } from '../../Atoms/Button';

const defaultStyles: StyleScript<ConversationalSearchProps> = () => {
	return css({
		position: 'fixed',
		right: 0,
		bottom: '20px',
		minWidth: '300px',
		border: '1px solid #ccc',
		zIndex: 1000,
		display: 'flex',
		flexDirection: 'column',
		'& .ss__conversational-search__header': {},
		'& .ss__conversational-search__messages': {},
		'& .ss__conversational-search__actions': {},
		'& .ss__conversational-search__input': {
			display: 'flex',
			'.ss__button': {},
			'& input': {
				flex: '1 0 auto',
				boxSizing: 'border-box',
				padding: '10px',
				border: 'none',
				borderTop: '1px solid #ccc',
			},
		},
	});
};

export const ConversationalSearch = observer((properties: ConversationalSearchProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<ConversationalSearchProps> = {
		treePath: globalTreePath,
	};

	let props = mergeProps('facets', globalTheme, defaultProps, properties);

	const { className, internalClassName, controller } = props;

	const themeDefaults: Theme = {
		components: {},
	};

	// merge deeply the themeDefaults with the theme props and the displaySettings theme props (do not merge arrays, but replace them)
	const theme = deepmerge(themeDefaults, props?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });

	props = {
		...props,
		theme,
	};

	// const subProps: ConversationalSearchSubProps = {};

	const KEY_ENTER = 13;
	const handleOnChange = (event: KeyboardEvent) => {
		console.log('handleOnChange', event);
		const input = event.target as HTMLInputElement;
		const value = input.value;
		// handle enter key to submit
		if (event.keyCode === KEY_ENTER) {
			controller.send();
		} else {
			controller.store.inputValue = value;
		}
	};

	const styling = mergeStyles<ConversationalSearchProps>(props, defaultStyles);

	return true ? (
		<CacheProvider>
			<div className={classnames('ss__conversational-search', className, internalClassName)} {...styling}>
				<div className={'ss__conversational-search__header'}>Header</div>
				<div className={'ss__conversational-search__messages'}>Content</div>
				<div className={'ss__conversational-search__actions'}>Actions</div>
				<div className={'ss__conversational-search__input'}>
					<input type="text" placeholder="Type your message..." onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleOnChange(e as any)} />
					<Button onClick={() => controller.send()}>Send</Button>
				</div>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

// interface ConversationalSearchSubProps {
// 	[thing: string]: any;
// }
export interface ConversationalSearchProps extends ComponentProps {
	controller: ConversationalSearchController;
}
