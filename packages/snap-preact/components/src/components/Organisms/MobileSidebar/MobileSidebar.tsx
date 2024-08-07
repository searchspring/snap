import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { Slideout, SlideoutProps } from '../../Molecules/Slideout';
import { defined, mergeProps } from '../../../utilities';
import { SearchController } from '@searchspring/snap-controller';
import { Sidebar, SidebarProps } from '../Sidebar';
import { Button, ButtonProps } from '../../Atoms/Button';
import { useA11y } from '../../../hooks';
import { MutableRef, useRef } from 'preact/hooks';
import { IconType } from '../../Atoms/Icon';

const CSS = {
	toolbar: () =>
		css({
			'& .ss__mobile-sidebar__header': {
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'baseline',

				'& .ss__mobile-sidebar__header__close-button': {
					cursor: 'pointer',
				},
			},
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
		openButtonText: 'Filters',
		clearButtonText: 'Clear All',
		applyButtonText: 'Apply',
		titleText: 'Filter Options',
		displayAt: '',
		closeButtonIcon: 'close-thin',
	};

	const props = mergeProps('mobileSidebar', globalTheme, defaultProps, properties);

	const {
		controller,
		hideFacets,
		hideFilterSummary,
		hidePerPage,
		hideHeader,
		hideFooter,
		hideSortBy,
		hideApplyButton,
		clearButtonIcon,
		hideCloseButton,
		closeButtonText,
		openButtonText,
		clearButtonText,
		applyButtonIcon,
		applyButtonText,
		closeButtonIcon,
		openButtonIcon,
		titleText,
		displayAt,
		hideClearButton,
		disableStyles,
		className,
		style,
		treePath,
	} = props;

	const styling: RootNodeProperties = { 'ss-name': props.name };

	if (!disableStyles) {
		styling.css = [CSS.toolbar(), style];
	} else if (style) {
		styling.css = [style];
	}

	const subProps: MobileSidebarSubProps = {
		slideout: {
			// default props
			controller,
			displayAt: (displayAt && `(max-width: ${displayAt})`) || '',
			// global theme
			...globalTheme?.components?.slideout,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
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
			treePath,
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
			treePath,
		},
	};

	const closeButtonRef: MutableRef<any> = useRef();
	const openButtonRef: MutableRef<any> = useRef();

	const Content = (props: any) => {
		const { toggleActive } = props;
		return (
			<div
				className="ss__mobile-sidebar__content"
				ref={(e) =>
					useA11y(e, 0, true, () => {
						closeButtonRef.current?.base?.focus();
						closeButtonRef.current?.base?.click();
						openButtonRef.current.base.focus();
					})
				}
			>
				{!hideHeader && (
					<div className="ss__mobile-sidebar__header">
						<h4 aria-atomic="true" aria-live="polite" className="ss__mobile-sidebar__header__title">
							{titleText}
						</h4>

						{!hideCloseButton && (
							<Button
								className="ss__mobile-sidebar__header__close-button"
								disableStyles={true}
								aria-label={closeButtonText || `close ${openButtonText} button`}
								onClick={() => toggleActive()}
								ref={(e: any) => {
									if (e) {
										closeButtonRef.current = e;
									}
								}}
								icon={closeButtonIcon}
								{...subProps.button}
								name={'close'}
							>
								{closeButtonText}
							</Button>
						)}
					</div>
				)}

				<Sidebar className="ss__mobile-sidebar__body" controller={controller} {...subProps.sidebar} />

				{!hideFooter && (
					<div className="ss__mobile-sidebar__footer">
						{!hideApplyButton && (
							<Button
								className="ss__mobile-sidebar__footer__apply-button"
								content={applyButtonText}
								icon={applyButtonIcon}
								onClick={() => toggleActive()}
								{...subProps.button}
								name={'apply'}
							/>
						)}
						{!hideClearButton && (
							<Button
								className="ss__mobile-sidebar__footer__clear-button"
								icon={clearButtonIcon}
								content={clearButtonText}
								onClick={() => {
									controller?.urlManager.remove('filter').remove('page').go();
									toggleActive();
								}}
								{...subProps.button}
								name={'clear'}
							/>
						)}
					</div>
				)}
			</div>
		);
	};
	const contentRef: MutableRef<any> = useRef();
	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__mobile-sidebar', className)}>
				<Slideout
					className="ss__mobile-sidebar__slideout"
					buttonContent={
						<Button
							className="ss__mobile-sidebar__slideout__button"
							icon={openButtonIcon}
							ref={openButtonRef}
							{...subProps.button}
							onClick={() => {
								setTimeout(() => {
									contentRef.current?.base?.focus();
								});
							}}
							name={'slideout'}
						>
							{openButtonText}
						</Button>
					}
					{...subProps.slideout}
				>
					<Content ref={contentRef} />
				</Slideout>
			</div>
		</CacheProvider>
	);
});

export interface MobileSidebarProps extends ComponentProps {
	controller: SearchController;
	titleText?: string;
	openButtonText?: string;
	clearButtonText?: string;
	applyButtonIcon?: IconType;
	clearButtonIcon?: IconType;
	applyButtonText?: string;
	closeButtonIcon?: IconType;
	openButtonIcon?: IconType;
	hideHeader?: boolean;
	hideFooter?: boolean;
	hideFacets?: boolean;
	hidePerPage?: boolean;
	hideSortBy?: boolean;
	hideFilterSummary?: boolean;
	hideApplyButton?: boolean;
	hideClearButton?: boolean;
	hideCloseButton?: boolean;
	closeButtonText?: string;
	displayAt?: string;
}

interface MobileSidebarSubProps {
	sidebar: Partial<SidebarProps>;
	slideout: Partial<SlideoutProps>;
	button: Partial<ButtonProps>;
}
