import { h } from 'preact';
import { render } from '@testing-library/preact';
import { Result } from './Result';
import { searchResponse } from '../../../mocks/searchResponse';
import { FALLBACK_IMAGE_URL } from '../../Atoms/Image';
import { ThemeProvider } from '../../../providers';
import userEvent from '@testing-library/user-event';

describe('Result Component', () => {
	it('renders', () => {
		const rendered = render(<Result result={searchResponse.results[0]} />);
		const resultElement = rendered.container.querySelector('.ss__result');
		expect(resultElement).toBeInTheDocument();
	});

	it('renders image', () => {
		const rendered = render(<Result result={searchResponse.results[0]} />);
		const imageElement = rendered.container.querySelector('.ss__result .ss__result__image-wrapper .ss__image img');
		expect(imageElement).toBeInTheDocument();
	});

	it('renders badge', () => {
		const rendered = render(<Result result={searchResponse.results[0]} />);
		const badgeElement = rendered.container.querySelector('.ss__result .ss__result__image-wrapper .ss__badge');
		expect(badgeElement).toBeInTheDocument();
	});

	it('renders title', () => {
		const rendered = render(<Result result={searchResponse.results[0]} />);
		const title = rendered.container.querySelector('.ss__result .ss__result__details .ss__result__details__title').textContent;
		expect(title).toBe(searchResponse.results[0].mappings.core.name);
	});

	it('renders pricing', () => {
		const rendered = render(<Result result={searchResponse.results[0]} />);
		const priceElement = rendered.container.querySelectorAll('.ss__result .ss__result__details__pricing .ss__price');
		expect(priceElement[0]).toBeInTheDocument();
		expect(priceElement.length).toBe(2);
	});

	it('renders details', () => {
		const args = {
			result: searchResponse.results[0],
			detailSlot: <div className="details">Add to cart'</div>,
		};
		const rendered = render(<Result {...args} />);
		const detailsElement = rendered.container.querySelector('.ss__result .ss__result__details .details');
		expect(detailsElement).toBeInTheDocument();
		expect(detailsElement).toHaveTextContent('Add to cart');
	});

	it('hides various sections', () => {
		const args = {
			result: searchResponse.results[0],
			hideBadge: true,
			hideTitle: true,
			hidePricing: true,
		};
		const rendered = render(<Result {...args} />);
		const badgeElement = rendered.container.querySelector('.ss__result .ss__result__image-wrapper .ss__badge');
		const titleElement = rendered.container.querySelector('.ss__result .ss__result__details .ss__result__wrapper__details__title');
		const priceElement = rendered.container.querySelector('.ss__result .ss__result__details__pricing .ss__price');
		expect(badgeElement).not.toBeInTheDocument();
		expect(titleElement).not.toBeInTheDocument();
		expect(priceElement).not.toBeInTheDocument();
	});

	it('should display a fallback image', () => {
		const rendered = render(<Result result={searchResponse.results[1]} />);
		const imageElement = rendered.container.querySelector('.ss__result .ss__result__image-wrapper .ss__image img');
		expect(imageElement).toHaveAttribute('src', FALLBACK_IMAGE_URL);
	});

	it('can set a custom onClick function', () => {
		const onClickFunc = jest.fn();

		const rendered = render(<Result result={searchResponse.results[1]} onClick={onClickFunc} />);
		const resultElement = rendered.container.querySelector('.ss__result a');
		expect(resultElement).toBeInTheDocument();

		userEvent.click(resultElement);
		expect(onClickFunc).toHaveBeenCalled();
	});
});

describe('Result theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				result: {
					hideTitle: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Result result={searchResponse.results[0]} />
			</ThemeProvider>
		);
		const result = rendered.container.querySelector('.ss__result');
		const title = rendered.container.querySelector('.ss__result__details__title');
		expect(result).toBeInTheDocument();
		expect(title).not.toBeInTheDocument();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				result: {
					hideTitle: true,
				},
			},
		};
		const rendered = render(<Result result={searchResponse.results[0]} theme={propTheme} />);
		const result = rendered.container.querySelector('.ss__result');
		const title = rendered.container.querySelector('.ss__result__details__title');
		expect(result).toBeInTheDocument();
		expect(title).not.toBeInTheDocument();
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				result: {
					hideTitle: true,
					hideBadge: true,
				},
			},
		};
		const propTheme = {
			components: {
				result: {
					hideTitle: false,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Result result={searchResponse.results[0]} theme={propTheme} />
			</ThemeProvider>
		);

		const badge = rendered.container.querySelector('.ss__badge');
		const result = rendered.container.querySelector('.ss__result');
		const title = rendered.container.querySelector('.ss__result__details__title');
		expect(result).toBeInTheDocument();
		expect(title).toBeInTheDocument();
		expect(badge).not.toBeInTheDocument();
	});
});
