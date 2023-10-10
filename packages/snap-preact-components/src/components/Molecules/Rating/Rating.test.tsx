import { h } from 'preact';

import { ThemeProvider } from '../../../providers';
import themes from '../../../themes';
import { render } from '@testing-library/preact';
import { Rating } from './Rating';

const args = {
	value: 5,
};

describe('Rating Component', () => {
	Object.keys(themes || {}).forEach((themeName) => {
		it(`uses ${themeName} theme`, () => {
			const theme = themes[themeName as keyof typeof themes];
			const rendered = render(<Rating theme={theme} value={4} count={10} />);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it('renders', () => {
		const value = 5;
		const rendered = render(<Rating value={value} />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).toBeInTheDocument();
		expect(element?.classList).toHaveLength(2);

		// has a wrapper element
		const iconWrapperElement = rendered.container.querySelector('.ss__rating .ss__rating__icons');
		expect(iconWrapperElement).toBeInTheDocument();

		// does not have a count by default
		const countElement = rendered.container.querySelector('.ss__rating .ss__rating__count');
		expect(countElement).not.toBeInTheDocument();

		// does not have text by default
		const textElement = rendered.container.querySelector('.ss__rating .ss__rating__text');
		expect(textElement).not.toBeInTheDocument();

		// has an empty star wrapper element
		const emptyStarsWrapperElement = rendered.container.querySelector('.ss__rating .ss__rating__stars--empty');
		expect(emptyStarsWrapperElement).toBeInTheDocument();

		// has 5 empty stars no matter the value
		const emptyStarElements = rendered.container.querySelectorAll('.ss__rating .ss__rating__stars__star--empty');
		const emptyStarIconElements = rendered.container.querySelectorAll('.ss__rating .ss__rating__stars__star--empty .ss__icon');
		expect(emptyStarElements).toHaveLength(5);
		expect(emptyStarIconElements).toHaveLength(5);
		// uses a specific empty icon by default
		emptyStarIconElements.forEach((emptyIcon) => expect(emptyIcon.classList.contains('ss__icon--star-o')).toBe(true));

		// has a full star wrapper element
		const fullStarsWrapperElement = rendered.container.querySelector('.ss__rating .ss__rating__stars--full');
		expect(fullStarsWrapperElement).toBeInTheDocument();

		// has specific number of full stars based on the value provided
		const fullStarsElements = rendered.container.querySelectorAll('.ss__rating .ss__rating__stars__star--full');
		const fullStarIconElements = rendered.container.querySelectorAll('.ss__rating .ss__rating__stars__star--full .ss__icon');
		expect(fullStarsElements).toHaveLength(Math.ceil(value));
		expect(fullStarIconElements).toHaveLength(Math.ceil(value));
		// uses a specific full icon by default
		fullStarIconElements.forEach((fullIcon) => expect(fullIcon.classList.contains('ss__icon--star')).toBe(true));
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('does not render by default with a zero value', () => {
		const rendered = render(<Rating value={0} />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('does not render by default with a zero value and no count', () => {
		const rendered = render(<Rating value={0} count={0} />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('will render with a zero value when there is a count', () => {
		const rendered = render(<Rating value={0} count={1} />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it(`will render with a zero value when using 'alwaysRender' prop`, () => {
		const rendered = render(<Rating value={0} alwaysRender />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it(`will attempt to change string values to number values`, () => {
		// @ts-ignore - testing string prop
		const rendered = render(<Rating value="5" alwaysRender />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).toBeInTheDocument();

		// has specific number of full stars based on the value provided
		const fullStarsElements = rendered.container.querySelectorAll('.ss__rating .ss__rating__stars__star--full');
		expect(fullStarsElements).toHaveLength(5);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it(`will change values that are not numbers to zero (which it won't without 'alwaysRender' prop)`, () => {
		// @ts-ignore - testing bad prop value
		const rendered = render(<Rating value={'five'} />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it(`will change values that less than zero to zero`, () => {
		// @ts-ignore - testing bad prop value
		const rendered = render(<Rating value={-1} />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('will take any numbers greater than 5 and set them to 5', () => {
		const values = [5, 6, 7, 8, 9, 10, 100, 1000];
		values.forEach((value) => {
			const rendered = render(<Rating value={value} />);

			const element = rendered.container.querySelector('.ss__rating');
			expect(element).toBeInTheDocument();

			// has specific number of full stars based on the value provided
			const fullStarsElements = rendered.container.querySelectorAll('.ss__rating .ss__rating__stars__star--full');
			expect(fullStarsElements).toHaveLength(5);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it(`will by default render partial fills`, () => {
		const values = [0.5, 0.6, 1, 1.4, 2.01, 2.75, 3.14159265359, 3.333333, 4.5, 4.99999, 5.0];

		values.forEach((value) => {
			const rendered = render(<Rating value={value} />);

			const element = rendered.container.querySelector('.ss__rating');
			expect(element).toBeInTheDocument();

			// has specific number of full stars based on the value provided
			const fullStarsElements = rendered.container.querySelectorAll('.ss__rating .ss__rating__stars__star--full');
			expect(fullStarsElements).toHaveLength(Math.ceil(value));

			const lastFullStarElement = rendered.container.querySelector('.ss__rating .ss__rating__stars__star--full:last-of-type');
			const styles = getComputedStyle(lastFullStarElement!);

			// calculation should match calculation in component
			const width = (value % 1 || 1) * 100;
			expect(styles.width).toBe(`${width}%`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it(`will NOT render partial fills when using the 'disablePartialFill' prop`, () => {
		const values = [0.5, 0.6, 1.4, 2.01, 2.75, 3.14159265359, 3.333333, 4.5, 4.99999, 5.0];

		values.forEach((value) => {
			const rendered = render(<Rating value={value} disablePartialFill />);

			const element = rendered.container.querySelector('.ss__rating');
			expect(element).toBeInTheDocument();

			// has specific number of full stars based on the value provided
			const fullStarsRendered = Math.floor(value);
			const fullStarsElements = rendered.container.querySelectorAll('.ss__rating .ss__rating__stars__star--full');
			expect(fullStarsElements).toHaveLength(fullStarsRendered);

			if (fullStarsRendered) {
				const lastFullStarElement = rendered.container.querySelector('.ss__rating .ss__rating__stars__star--full:last-of-type');
				const styles = getComputedStyle(lastFullStarElement!);
				expect(styles.width).toBe(`100%`);
			}
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it(`will render with count when provided`, () => {
		const count = 44;
		const rendered = render(<Rating value={5} count={count} />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).toBeInTheDocument();
		const countElement = rendered.container.querySelector('.ss__rating__count');
		expect(countElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it(`will render with text when provided`, () => {
		const text = 'super rated';
		const rendered = render(<Rating value={5} text={text} />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).toBeInTheDocument();
		const textElement = rendered.container.querySelector('.ss__rating .ss__rating__text');
		expect(textElement).toBeInTheDocument();
		expect(textElement).toHaveTextContent(text);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it(`will render with different full and empty icons when provided`, () => {
		const value = 5;
		const fullIcon = 'heart';
		const emptyIcon = 'heart-o';
		const rendered = render(<Rating value={value} fullIcon={fullIcon} emptyIcon={emptyIcon} />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).toBeInTheDocument();

		// has 5 empty stars no matter the value
		const emptyStarIconElements = rendered.container.querySelectorAll(`.ss__rating .ss__rating__stars__star--empty .ss__icon.ss__icon--${emptyIcon}`);
		expect(emptyStarIconElements).toHaveLength(5);

		// has specific number of full stars based on the value provided
		const fullStarIconElements = rendered.container.querySelectorAll(`.ss__rating .ss__rating__stars__star--full .ss__icon.ss__icon--${fullIcon}`);
		expect(fullStarIconElements).toHaveLength(Math.ceil(value));
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it(`renders a specific number of empty and full stars based on the value prop provided`, () => {
		const values = [0, 1, 2, 3, 4, 5, 0.5, 1.5, 2.5, 3.5, 4.5];

		values.forEach((value) => {
			const rendered = render(<Rating value={value} alwaysRender />);

			const element = rendered.container.querySelector('.ss__rating');
			expect(element).toBeInTheDocument();

			// has an empty star wrapper element
			const emptyStarsWrapperElement = rendered.container.querySelector('.ss__rating .ss__rating__stars--empty');
			expect(emptyStarsWrapperElement).toBeInTheDocument();

			// has 5 empty stars no matter the value
			const emptyStarElements = rendered.container.querySelectorAll('.ss__rating .ss__rating__stars__star--empty');
			const emptyStarIconElements = rendered.container.querySelectorAll('.ss__rating .ss__rating__stars__star--empty .ss__icon');
			expect(emptyStarElements).toHaveLength(5);
			expect(emptyStarIconElements).toHaveLength(5);

			// has a full star wrapper element
			const fullStarsWrapperElement = rendered.container.querySelector('.ss__rating .ss__rating__stars--full');
			expect(fullStarsWrapperElement).toBeInTheDocument();

			// has specific number of full stars based on the value provided
			const fullStarsElements = rendered.container.querySelectorAll('.ss__rating .ss__rating__stars__star--full');
			expect(fullStarsElements).toHaveLength(Math.ceil(value));
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Rating value={5} className={className} />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<Rating value={5} style={style} />);

		const element = rendered.container.querySelector('.ss__rating');
		const styles = getComputedStyle(element!);

		expect(styles.padding).toBe(style.padding);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can disable styles', () => {
		const rendered = render(<Rating {...args} disableStyles />);

		const element = rendered.container.querySelector('.ss__rating');

		expect(element?.classList).toHaveLength(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	describe('Rating theming works', () => {
		it('is themeable with ThemeProvider', () => {
			const globalTheme = {
				components: {
					rating: {
						alwaysRender: true,
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Rating value={0} />
				</ThemeProvider>
			);

			// would normally not render unless using the `alwaysRender` prop
			const element = rendered.container.querySelector('.ss__rating');
			expect(element).toBeInTheDocument();
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('is themeable with theme prop', () => {
			const propTheme = {
				components: {
					rating: {
						alwaysRender: true,
					},
				},
			};
			const rendered = render(<Rating value={0} theme={propTheme} />);

			// would normally not render unless using the `alwaysRender` prop
			const element = rendered.container.querySelector('.ss__rating');
			expect(element).toBeInTheDocument();
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					rating: {
						alwaysRender: false,
						text: 'rated',
					},
				},
			};
			const propTheme = {
				components: {
					rating: {
						alwaysRender: true,
						text: 'rating',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Rating value={0} theme={propTheme} />
				</ThemeProvider>
			);

			// would normally not render unless using the `alwaysRender` prop
			const element = rendered.container.querySelector('.ss__rating');
			expect(element).toBeInTheDocument();

			const textElement = rendered.container.querySelector('.ss__rating .ss__rating__text');
			expect(textElement).toBeInTheDocument();
			expect(textElement).toHaveTextContent(propTheme.components.rating.text);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});
});
