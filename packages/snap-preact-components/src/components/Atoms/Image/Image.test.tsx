import { h } from 'preact';

import { ThemeProvider } from '../../../providers';
import { render, waitFor } from '@testing-library/preact';

import { Image, FALLBACK_IMAGE_URL } from './Image';
import userEvent from '@testing-library/user-event';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModel } from '@searchspring/snapi-types';

const mockData = new MockData();
const searchResponse: SearchResponseModel = mockData.search();

describe('image Component', () => {
	const result = searchResponse.results![1].mappings?.core;
	const badResult = searchResponse.results![0].mappings?.core;
	badResult!.imageUrl = '';
	badResult!.thumbnailImageUrl = '';
	const rolloverImage = searchResponse.results![2].mappings?.core?.thumbnailImageUrl;

	it('renders', () => {
		const rendered = render(<Image alt={result?.name!} src={result?.thumbnailImageUrl!} />);
		const imageElement = rendered.container.querySelector('.ss__image img');
		expect(imageElement).toBeInTheDocument();
		expect(imageElement).toHaveAttribute('src', result?.thumbnailImageUrl);
		expect(imageElement).toHaveAttribute('alt', result?.name);
		expect(imageElement).toHaveAttribute('title', result?.name);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Image className={className} alt={result?.name!} src={result?.thumbnailImageUrl!} />);
		const imageElement = rendered.container.querySelector('.ss__image');

		expect(imageElement).toHaveClass(className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('disables styles', () => {
		const rendered = render(<Image disableStyles alt={result?.name!} src={result?.thumbnailImageUrl!} />);
		const imageElement = rendered.container.querySelector('.ss__image');

		expect(imageElement?.classList).toHaveLength(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	describe('Working Image', () => {
		it('renders image', () => {
			const rendered = render(<Image alt={result?.name!} src={result?.thumbnailImageUrl!} />);
			const imageElement = rendered.container.querySelector('.ss__image img');
			expect(imageElement).toBeInTheDocument();
			expect(imageElement).toHaveAttribute('src', result?.thumbnailImageUrl);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	describe('Broken Image', () => {
		it('should display default fallback image', () => {
			const rendered = render(<Image alt={badResult?.name!} src={badResult?.thumbnailImageUrl!} />);
			const imageElement = rendered.container.querySelector('.ss__image img');
			expect(imageElement).toHaveAttribute('src', FALLBACK_IMAGE_URL);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('should display custom fallback image', () => {
			const fallbackImage = 'https://www.telegraph.co.uk/content/dam/Pets/spark/royal-canin/happy-puppy-xlarge.jpg?imwidth=1200';
			const rendered = render(<Image alt={badResult?.name!} src={badResult?.thumbnailImageUrl!} fallback={fallbackImage} />);
			const imageElement = rendered.container.querySelector('.ss__image img');
			expect(imageElement).toHaveAttribute('src', fallbackImage);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	describe('hover src', () => {
		it('should change src on hover & run a custom onhoverfunc prop', async () => {
			const onHoverFunc = jest.fn();
			const rendered = render(<Image alt={badResult?.name!} onMouseOver={onHoverFunc} src={result?.thumbnailImageUrl!} hoverSrc={rolloverImage} />);
			const imageElement = rendered.container.querySelector('.ss__image img')!;

			expect(imageElement).toHaveAttribute('src', result?.thumbnailImageUrl);
			expect(rendered.asFragment()).toMatchSnapshot();

			userEvent.hover(imageElement);
			await waitFor(() => expect(onHoverFunc).toHaveBeenCalled());
			expect(imageElement).toHaveAttribute('src', rolloverImage);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	describe('click func', () => {
		it('custom onclick src on hover', () => {
			const clickfunc = jest.fn();

			const rendered = render(<Image alt={badResult?.name!} src={result?.thumbnailImageUrl!} onClick={clickfunc} />);
			const imageElement = rendered.container.querySelector('.ss__image img')!;

			expect(imageElement).toHaveAttribute('src', result?.thumbnailImageUrl);
			expect(rendered.asFragment()).toMatchSnapshot();

			userEvent.click(imageElement);
			expect(clickfunc).toHaveBeenCalled();
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});
});

describe('Image theming works', () => {
	const result = searchResponse.results![0].mappings?.core;

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
				<Image alt={result?.name!} src={result?.thumbnailImageUrl!} />
			</ThemeProvider>
		);
		const image = rendered.container.querySelector('.ss__image');
		expect(image).toBeInTheDocument();
		expect(image?.classList.length).toBe(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				image: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(<Image alt={result?.name!} src={result?.thumbnailImageUrl!} theme={propTheme} />);
		const image = rendered.container.querySelector('.ss__image');
		expect(image).toBeInTheDocument();
		expect(image?.classList.length).toBe(1);
		expect(rendered.asFragment()).toMatchSnapshot();
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
				<Image alt={result?.name!} src={result?.thumbnailImageUrl!} theme={propTheme} />
			</ThemeProvider>
		);

		const image = rendered.container.querySelector('.ss__image');
		expect(image).toBeInTheDocument();
		expect(image?.classList.length).toBe(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});
