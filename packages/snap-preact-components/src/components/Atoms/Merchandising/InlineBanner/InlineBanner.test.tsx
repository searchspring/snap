import { h } from 'preact';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { InlineBanner } from './InlineBanner';
import { ThemeProvider } from '../../../../providers';
import themes from '../../../../themes';
import type { Banner } from '@searchspring/snap-store-mobx';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModel } from '@searchspring/snapi-types';

const mockData = new MockData();
mockData.updateConfig({ search: 'inlineBanners' });
const searchResponse: SearchResponseModel = mockData.search();

describe('Merchandising Inline Banner Component', () => {
	Object.keys(themes || {}).forEach((themeName) => {
		it(`uses ${themeName} theme`, () => {
			const theme = themes[themeName as keyof typeof themes];
			const rendered = render(<InlineBanner theme={theme} banner={searchResponse.merchandising?.content?.inline![0] as Banner} />);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it('renders type:inline banner', () => {
		const rendered = render(<InlineBanner banner={searchResponse.merchandising?.content?.inline![0] as Banner} />);
		const merchBannerElement = rendered.container.querySelector('.ss__inline-banner');
		expect(merchBannerElement).toBeInTheDocument();
		expect(merchBannerElement?.innerHTML).toBe(searchResponse.merchandising?.content?.inline![0].value!);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can set a custom onClick function', () => {
		const onClickFunc = jest.fn();

		const rendered = render(<InlineBanner banner={searchResponse.merchandising?.content?.inline![0] as Banner} onClick={onClickFunc} />);
		const merchBannerElement = rendered.container.querySelector('.ss__inline-banner')!;
		expect(merchBannerElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();

		userEvent.click(merchBannerElement);
		expect(onClickFunc).toHaveBeenCalled();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can disable styling', () => {
		const rendered = render(<InlineBanner disableStyles={true} banner={searchResponse.merchandising?.content?.inline![0] as Banner} />);
		const loadingbarElement = rendered.container.querySelector('.ss__inline-banner');
		expect(loadingbarElement?.classList.length).toBe(2);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<InlineBanner className={className} banner={searchResponse.merchandising?.content?.inline![0] as Banner} />);
		const merchBannerElement = rendered.container.querySelector('.ss__inline-banner');
		expect(merchBannerElement).toBeInTheDocument();
		expect(merchBannerElement).toHaveClass(className);
		expect(rendered.asFragment()).toMatchSnapshot();
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
				<InlineBanner banner={searchResponse.merchandising?.content?.inline![0] as Banner} />
			</ThemeProvider>
		);

		const InlineBannerElement = rendered.container.querySelector('.ss__inline-banner');
		expect(InlineBannerElement).toHaveClass(globalTheme.components.inlineBanner.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				inlineBanner: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(<InlineBanner banner={searchResponse.merchandising?.content?.inline![0] as Banner} theme={propTheme} />);

		const InlineBannerElement = rendered.container.querySelector('.ss__inline-banner');
		expect(InlineBannerElement).toHaveClass(propTheme.components.inlineBanner.className);
		expect(rendered.asFragment()).toMatchSnapshot();
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
				<InlineBanner banner={searchResponse.merchandising?.content?.inline![0] as Banner} theme={propTheme} />
			</ThemeProvider>
		);

		const InlineBannerElement = rendered.container.querySelector('.ss__inline-banner');
		expect(InlineBannerElement).toHaveClass(propTheme.components.inlineBanner.className);
		expect(InlineBannerElement).not.toHaveClass(globalTheme.components.inlineBanner.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});
