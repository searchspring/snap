import { h } from 'preact';

import { ThemeProvider } from '../../../providers/theme';
import { render } from '@testing-library/preact';

import { Image, FALLBACK_IMAGE_URL } from './Image';
import { searchResponse, badSearchResponse } from '../../../mocks/searchResponse';

describe('image Component', () => {
	const result = searchResponse.results[0].mappings.core;
	const badResult = badSearchResponse.results[0].mappings.core;

	it('renders', () => {
		const rendered = render(<Image alt={result.name} src={result.thumbnailImageUrl} />);
		const imageElement = rendered.container.querySelector('.ss-image');
		expect(imageElement).toBeInTheDocument();
		expect(imageElement).toHaveAttribute('src', result.thumbnailImageUrl);
		expect(imageElement).toHaveAttribute('alt', result.name);
		expect(imageElement).toHaveAttribute('title', result.name);

		expect(imageElement.classList).toHaveLength(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Image className={className} alt={result.name} src={result.thumbnailImageUrl} />);

		const imageElement = rendered.container.querySelector('.ss-image');

		expect(imageElement).toHaveClass(className);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Image className={className} alt={result.name} src={result.thumbnailImageUrl} />);
		const imageElement = rendered.container.querySelector('.ss-image');

		expect(imageElement).toHaveClass(className);
	});

	it('disables styles', () => {
		const rendered = render(<Image disableStyles alt={result.name} src={result.thumbnailImageUrl} />);
		const imageElement = rendered.container.querySelector('.ss-image');

		expect(imageElement.classList).toHaveLength(1);
	});

	describe('Working Image', () => {
		it('renders image', () => {
			const rendered = render(<Image alt={result.name} src={result.thumbnailImageUrl} />);
			const imageElement = rendered.container.querySelector('.ss-image');
			expect(imageElement).toBeInTheDocument();
			expect(imageElement).toHaveAttribute('src', result.thumbnailImageUrl);
		});
	});

	describe('Broken Image', () => {
		it('should display default fallback image', () => {
			const rendered = render(<Image alt={badResult.name} src={badResult.thumbnailImageUrl} />);
			const imageElement = rendered.container.querySelector('.ss-image');
			expect(imageElement).toHaveAttribute('src', FALLBACK_IMAGE_URL);
		});

		it('should display custom fallback image', () => {
			const fallbackImage = 'https://www.telegraph.co.uk/content/dam/Pets/spark/royal-canin/happy-puppy-xlarge.jpg?imwidth=1200';
			const rendered = render(<Image alt={badResult.name} src={badResult.thumbnailImageUrl} fallback={fallbackImage} />);
			const imageElement = rendered.container.querySelector('.ss-image');
			expect(imageElement).toHaveAttribute('src', fallbackImage);
		});
	});
});

describe('Image theming works', () => {
	const result = searchResponse.results[0].mappings.core;

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				image: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Image alt={result.name} src={result.thumbnailImageUrl} />
			</ThemeProvider>
		);
		const pagination = rendered.container.querySelector('.ss-image');
		expect(pagination).toBeInTheDocument();
		expect(pagination.classList.length).toBe(1);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				image: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(<Image alt={result.name} src={result.thumbnailImageUrl} theme={propTheme} />);
		const pagination = rendered.container.querySelector('.ss-image');
		expect(pagination).toBeInTheDocument();
		expect(pagination.classList.length).toBe(1);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				image: {
					disableStyles: false,
				},
			},
		};
		const propTheme = {
			components: {
				image: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Image alt={result.name} src={result.thumbnailImageUrl} theme={propTheme} />
			</ThemeProvider>
		);

		const pagination = rendered.container.querySelector('.ss-image');
		expect(pagination).toBeInTheDocument();
		expect(pagination.classList.length).toBe(1);
	});
});
