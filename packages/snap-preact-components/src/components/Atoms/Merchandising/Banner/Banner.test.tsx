import { h } from 'preact';

import { render } from '@testing-library/preact';

import { Banner } from './Banner';
import { ContentType } from '@searchspring/snap-store-mobx';
import { ThemeProvider } from '../../../../providers';
import themes from '../../../../themes';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModel } from '@searchspring/snapi-types';

const mockData = new MockData();
mockData.updateConfig({ search: 'merchandising' });
const searchResponse: SearchResponseModel = mockData.search();

describe('Merchandising Banner Component', () => {
	Object.keys(themes || {}).forEach((themeName) => {
		it(`uses ${themeName} theme`, () => {
			const theme = themes[themeName as keyof typeof themes];
			const rendered = render(<Banner theme={theme} content={searchResponse.merchandising?.content!} type={ContentType.BANNER} />);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	const theme = {
		components: {
			banner: {
				style: {
					backgroundColor: 'red',
				},
			},
		},
	};
	const typesWithContent: ContentType[] = [ContentType.HEADER, ContentType.FOOTER, ContentType.BANNER];

	typesWithContent.forEach((type) => {
		it(`renders type:${type} banner`, () => {
			const rendered = render(<Banner content={searchResponse.merchandising?.content!} type={type} />);
			const merchBannerElement = rendered.container.querySelector(`.ss__banner.ss__banner--${type}`);
			expect(merchBannerElement).toBeInTheDocument();
			expect(merchBannerElement?.innerHTML).toBe(searchResponse.merchandising?.content![type]!.join(''));
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it('doesnt render if empty', () => {
		// @ts-ignore - testing empty banner
		const rendered = render(<Banner content={[]} type={ContentType.LEFT} />);
		const merchBannerElement = rendered.container.querySelector('.ss__banner.ss__banner--left');
		expect(merchBannerElement).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can disable styling', () => {
		const rendered = render(<Banner disableStyles={true} content={searchResponse.merchandising?.content!} type={ContentType.BANNER} />);
		const loadingbarElement = rendered.container.querySelector('.ss__banner');
		expect(loadingbarElement?.classList.length).toBe(2);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Banner className={className} content={searchResponse.merchandising?.content!} type={ContentType.BANNER} />);
		const merchBannerElement = rendered.container.querySelector('.ss__banner.ss__banner--banner');
		expect(merchBannerElement).toBeInTheDocument();
		expect(merchBannerElement).toHaveClass(className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with ThemeProvider', () => {
		const args = {
			content: searchResponse.merchandising?.content!,
			type: ContentType.BANNER,
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<Banner {...args} />
			</ThemeProvider>
		);
		const bannerElement = rendered.container.querySelector('.ss__banner')!;
		const styles = getComputedStyle(bannerElement);
		expect(styles.backgroundColor).toBe(theme.components.banner.style.backgroundColor);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop', () => {
		const args = {
			content: searchResponse.merchandising?.content!,
			type: ContentType.BANNER,
		};
		const rendered = render(<Banner {...args} theme={theme} />);
		const bannerElement = rendered.container.querySelector('.ss__banner')!;
		const styles = getComputedStyle(bannerElement);
		expect(styles.backgroundColor).toBe(theme.components.banner.style.backgroundColor);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = {
			content: searchResponse.merchandising?.content!,
			type: ContentType.BANNER,
		};
		const themeOverride = {
			components: {
				banner: {
					style: {
						backgroundColor: 'blue',
					},
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<Banner {...args} theme={themeOverride} />
			</ThemeProvider>
		);
		const bannerElement = rendered.container.querySelector('.ss__banner')!;
		const styles = getComputedStyle(bannerElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.banner.style.backgroundColor);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});
