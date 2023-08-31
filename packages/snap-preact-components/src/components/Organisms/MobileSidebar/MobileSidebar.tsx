/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { Slideout, SlideoutProps } from '../../Molecules/Slideout';
import { defined, mergeProps } from '../../../utilities';
import { SearchController } from '@searchspring/snap-controller';
import { Sidebar, SidebarProps } from '../Sidebar';
import { Button, ButtonProps } from '../../Atoms/Button';

const CSS = {
	toolbar: () =>
		css({
			'& .ss__mobile-sidebar__title': {
				justifyContent: 'space-between',
				flexDirection: 'row',
				display: 'flex',

				'& .ss__icon': {
					cursor: 'pointer',
				},
			},

			'& .ss__mobile-sidebar__slideout__button': {
				cursor: 'pointer',
			},

			'& .ss__mobile-sidebar__cta-wrapper': {
				justifyContent: 'space-around',
				flexDirection: 'row',
				display: 'flex',
			},
		}),
};

export const MobileSidebar = observer((properties: MobileSidebarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<MobileSidebarProps> = {
		slideoutButtonText: 'Filters',
		clearButtonText: 'Clear All',
		applyButtonText: 'Apply Filters',
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
		slideoutButtonText,
		clearButtonText,
		applyButtonText,
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
		slideout: {
			// default props
			controller,
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
		button: {
			// default props
			// global theme
			...globalTheme?.components?.button,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		sidebar: {
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
			<div className="ss__mobile-sidebar__content">
				{!hideTitle && (
					<div className="ss__mobile-sidebar__title">
						<span>{titleText}</span>
						{!hideCloseButton && (
							<Button
								className="ss__mobile-sidebar__title__close-button"
								name="mobile-sidebar__title__close-button"
								disableStyles={true}
								onClick={() => toggleActive()}
								icon={iconClose}
								{...subProps.button}
							></Button>
						)}
					</div>
				)}

				<Sidebar className="ss__mobile-sidebar__sidebar" name={'mobile-sidebar__sidebar'} controller={controller} {...subProps.sidebar} />

				<div className="ss__mobile-sidebar__cta-wrapper">
					{!hideApplyButton && (
						<Button
							className="ss__mobile-sidebar__apply-button"
							name={'mobile-sidebar__apply-button'}
							content={applyButtonText}
							onClick={() => toggleActive()}
							{...subProps.button}
						/>
					)}
					{!hideClearAllButton && (
						<Button
							className="ss__mobile-sidebar__clear-button"
							name={'mobile-sidebar__clear-button'}
							content={clearButtonText}
							onClick={() => {
								controller?.urlManager.remove('filter').remove('page').go();
								toggleActive();
							}}
							{...subProps.button}
						/>
					)}
				</div>
			</div>
		);
	};

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__mobile-sidebar', className)}>
				<Slideout
					className="ss__mobile-sidebar__slideout"
					buttonContent={
						<Button className="ss__mobile-sidebar__slideout__button" name={'mobile-sidebar__slideout__button'} icon={iconOpen} {...subProps.button}>
							{slideoutButtonText}
						</Button>
					}
					{...subProps.slideout}
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
	slideoutButtonText?: string;
	clearButtonText?: string;
	applyButtonText?: string;
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
	sidebar: Partial<SidebarProps>;
	slideout: Partial<SlideoutProps>;
	button: Partial<ButtonProps>;
}
