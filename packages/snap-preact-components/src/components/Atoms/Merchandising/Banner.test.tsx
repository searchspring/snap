import { h } from 'preact';

import { render } from '@testing-library/preact';

import { searchResponse } from '../../../mocks/searchResponse';
import { Banner } from './Banner';
import { BannerType } from '../../../types';
import { ThemeProvider } from '../../../providers/theme';

describe('Merchandising Banner Component', () => {
	const theme = {
		components: {
			banner: {
				style: {
					backgroundColor: 'red',
				},
			},
		},
	};
	const typesWithContent: BannerType[] = [BannerType.HEADER, BannerType.FOOTER, BannerType.BANNER];

	typesWithContent.forEach((type) => {
		it(`renders type:${type} banner`, () => {
			const rendered = render(<Banner content={searchResponse.merchandising.content} type={type} />);
			const merchBannerElement = rendered.container.querySelector(`.ss__banner.ss__banner--${type}`);
			expect(merchBannerElement).toBeInTheDocument();
			expect(merchBannerElement.innerHTML).toBe(searchResponse.merchandising.content[type].join(''));
		});
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Banner className={className} content={searchResponse.merchandising.content} type={BannerType.BANNER} />);
		const merchBannerElement = rendered.container.querySelector('.ss__banner.ss__banner--banner');
		expect(merchBannerElement).toBeInTheDocument();
		expect(merchBannerElement).toHaveClass(className);
	});

	it('doesnt render if empty', () => {
		const rendered = render(<Banner content={[]} type={BannerType.LEFT} />);
		const merchBannerElement = rendered.container.querySelector('.ss__banner.ss__banner--left');
		expect(merchBannerElement).not.toBeInTheDocument();
	});

	it('is themeable with ThemeProvider', () => {
		const args = {
			content: searchResponse.merchandising.content,
			type: BannerType.BANNER,
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<Banner {...args} />
			</ThemeProvider>
		);
		const bannerElement = rendered.container.querySelector('.ss__banner');
		const styles = getComputedStyle(bannerElement);
		expect(styles.backgroundColor).toBe(theme.components.banner.style.backgroundColor);
	});

	it('is themeable with theme prop', () => {
		const args = {
			content: searchResponse.merchandising.content,
			type: BannerType.BANNER,
		};
		const rendered = render(<Banner {...args} theme={theme} />);
		const bannerElement = rendered.container.querySelector('.ss__banner');
		const styles = getComputedStyle(bannerElement);
		expect(styles.backgroundColor).toBe(theme.components.banner.style.backgroundColor);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = {
			content: searchResponse.merchandising.content,
			type: BannerType.BANNER,
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
		const bannerElement = rendered.container.querySelector('.ss__banner');
		const styles = getComputedStyle(bannerElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.banner.style.backgroundColor);
	});
});
