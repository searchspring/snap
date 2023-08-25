/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { Slideout, SlideoutProps } from '../../Molecules/Slideout';
import { defined, mergeProps } from '../../../utilities';
import { SearchController } from '@searchspring/snap-controller';
import { Sidebar, SidebarProps } from '../Sidebar';
import { Icon } from '../../Atoms/Icon';
import { Button } from '../../Atoms/Button';

const CSS = {
	toolbar: () =>
		css({
			'& .ss__mobileSidebar__title': {
				justifyContent: 'space-between',
				flexDirection: 'row',
				display: 'flex',

				'& .ss__icon': {
					cursor: 'pointer',
				},
			},

			'& .ss__mobileSidebar__slideout__slideoutbutton': {
				cursor: 'pointer',
			},

			'& .ss__mobileSidebar__cta-wrapper': {
				justifyContent: 'space-around',
				flexDirection: 'row',
				display: 'flex',
			},
		}),
};

export const MobileSidebar = observer((properties: MobileSidebarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<MobileSidebarProps> = {
		buttonText: 'Filters',
		titleText: 'Filter Options',
		displayAt: '650px',
		iconClose: 'close-thin',
	};

	const props = mergeProps('mobileSidebar', globalTheme, defaultProps, properties);

	const {
		controller,
		hideFacets,
		hideFilterSummary,
		hidePerPage,
		hideTitle,
		hideSortBy,
		hideApplyButton,
		hideCloseButton,
		buttonText,
		iconClose,
		iconOpen,
		titleText,
		displayAt,
		hideClearAllButton,
		disableStyles,
		className,
		style,
	} = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.toolbar(), style];
	} else if (style) {
		styling.css = [style];
	}

	const subProps: MobileSidebarSubProps = {
		Slideout: {
			// default props
			controller,
			// noButtonWrapper: true,
			className: 'ss__toolbar__slideout',
			displayAt: `(max-width: ${displayAt})`,
			// global theme
			...globalTheme?.components?.slideout,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		Sidebar: {
			// default props
			hideTitle: true,
			hideFacets: hideFacets,
			hidePerPage: hidePerPage,
			hideSortBy: hideSortBy,
			hideFilterSummary: hideFilterSummary,
			// global theme
			...globalTheme?.components?.sidebar,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const Content = (props: any) => {
		const { toggleActive } = props;
		return (
			<Fragment>
				{!hideTitle && (
					<div className="ss__mobileSidebar__title">
						<span>{titleText}</span>
						{!hideCloseButton && (
							<div onClick={() => toggleActive()}>
								<Icon icon={iconClose} />
							</div>
						)}
					</div>
				)}

				<Sidebar controller={controller} {...subProps.Sidebar} />

				<div className="ss__mobileSidebar__cta-wrapper">
					{!hideApplyButton && <Button content={'Apply Filters'} onClick={() => toggleActive()} />}
					{!hideClearAllButton && (
						<Button
							content={'Clear All'}
							onClick={() => {
								controller?.urlManager.remove('filter').remove('page').go();
								toggleActive();
							}}
						/>
					)}
				</div>
			</Fragment>
		);
	};

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__mobileSidebar', className)}>
				<Slideout
					buttonContent={
						<div className="ss__mobileSidebar__slideout__slideoutbutton">
							{buttonText} <Icon icon={iconOpen} />
						</div>
					}
					{...subProps.Slideout}
				>
					<Content />
				</Slideout>
			</div>
		</CacheProvider>
	);
});

export interface MobileSidebarProps extends ComponentProps {
	controller: SearchController;
	titleText?: string;
	buttonText?: string;
	iconClose?: string;
	iconOpen?: string;
	hideTitle?: boolean;
	hideFacets?: boolean;
	hidePerPage?: boolean;
	hideSortBy?: boolean;
	hideFilterSummary?: boolean;
	hideApplyButton?: boolean;
	hideClearAllButton?: boolean;
	hideCloseButton?: boolean;
	displayAt?: string;
}

interface MobileSidebarSubProps {
	Sidebar: Partial<SidebarProps>;
	Slideout: Partial<SlideoutProps>;
}
