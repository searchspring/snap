import { h } from 'preact';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { searchResponse } from '../../../mocks/searchResponse';
import { InlineBanner } from './InlineBanner';
import { ThemeProvider } from '../../../providers';

describe('Merchandising Inline Banner Component', () => {
	it('renders type:inline banner', () => {
		const rendered = render(<InlineBanner banner={searchResponse.merchandising.content.inline[0]} />);
		const merchBannerElement = rendered.container.querySelector('.ss__inline-banner');
		expect(merchBannerElement).toBeInTheDocument();
		expect(merchBannerElement.innerHTML).toBe(searchResponse.merchandising.content.inline[0].value);
	});

	it('can set a custom onClick function', () => {
		const onClickFunc = jest.fn();

		const rendered = render(<InlineBanner banner={searchResponse.merchandising.content.inline[0]} onClick={onClickFunc} />);
		const merchBannerElement = rendered.container.querySelector('.ss__inline-banner');
		expect(merchBannerElement).toBeInTheDocument();

		userEvent.click(merchBannerElement);
		expect(onClickFunc).toHaveBeenCalled();
	});

	it('can disable styling', () => {
		const rendered = render(<InlineBanner disableStyles={true} banner={searchResponse.merchandising.content.inline[0]} />);
		const loadingbarElement = rendered.container.querySelector('.ss__inline-banner');
		expect(loadingbarElement.classList.length).toBe(2);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<InlineBanner className={className} banner={searchResponse.merchandising.content.inline[0]} />);
		const merchBannerElement = rendered.container.querySelector('.ss__inline-banner');
		expect(merchBannerElement).toBeInTheDocument();
		expect(merchBannerElement).toHaveClass(className);
	});
});

describe('InlineBanner theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				inlineBanner: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<InlineBanner banner={searchResponse.merchandising.content.inline[0]} />
			</ThemeProvider>
		);

		const InlineBannerElement = rendered.container.querySelector('.ss__inline-banner');
		expect(InlineBannerElement).toHaveClass(globalTheme.components.inlineBanner.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				inlineBanner: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(<InlineBanner banner={searchResponse.merchandising.content.inline[0]} theme={propTheme} />);

		const InlineBannerElement = rendered.container.querySelector('.ss__inline-banner');
		expect(InlineBannerElement).toHaveClass(propTheme.components.inlineBanner.className);
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				inlineBanner: {
					className: 'global-class',
				},
			},
		};

		const propTheme = {
			components: {
				inlineBanner: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<InlineBanner banner={searchResponse.merchandising.content.inline[0]} theme={propTheme} />
			</ThemeProvider>
		);

		const InlineBannerElement = rendered.container.querySelector('.ss__inline-banner');
		expect(InlineBannerElement).toHaveClass(propTheme.components.inlineBanner.className);
		expect(InlineBannerElement).not.toHaveClass(globalTheme.components.inlineBanner.className);
	});
});
