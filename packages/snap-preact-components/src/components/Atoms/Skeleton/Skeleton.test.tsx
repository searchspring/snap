import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { Skeleton } from './Skeleton';

describe('Skeleton Component', () => {
	it('renders', () => {
		const rendered = render(<Skeleton height="200px" width="200px" />);
		const skeleton = rendered.container.querySelector('.ss__skeleton');
		expect(skeleton).toBeInTheDocument();
	});

	it('has correct demmensions', () => {
		const rendered = render(<Skeleton height="400px" width="300px" />);
		const skeleton = rendered.container.querySelector('.ss__skeleton');
		expect(skeleton).toHaveStyle('height:400px; width:300px');
	});

	it('can change the bg color', () => {
		const rendered = render(<Skeleton height="400px" width="300px" bgcolor={'red'} />);
		const skeleton = rendered.container.querySelector('.ss__skeleton');
		expect(skeleton).toHaveStyle('background-color:red');
	});

	it('can change to a circle', () => {
		const rendered = render(<Skeleton height="300px" width="300px" round={true} />);
		const skeleton = rendered.container.querySelector('.ss__skeleton');
		expect(skeleton).toHaveStyle('border-radius:300px');
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Skeleton className={className} height="300px" width="300px" />);
		const imageElement = rendered.container.querySelector('.ss__skeleton');

		expect(imageElement).toHaveClass(className);
	});

	it('disables styles', () => {
		const rendered = render(<Skeleton disableStyles height="300px" width="300px" />);
		const imageElement = rendered.container.querySelector('.ss__skeleton');

		expect(imageElement.classList).toHaveLength(1);
	});

	expect(true).toBe(true);
});

describe('Skeleton theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				skeleton: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Skeleton height="300px" width="300px" />
			</ThemeProvider>
		);
		const pagination = rendered.container.querySelector('.ss__skeleton');
		expect(pagination).toBeInTheDocument();
		expect(pagination.classList.length).toBe(1);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				skeleton: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(<Skeleton height="300px" width="300px" theme={propTheme} />);
		const pagination = rendered.container.querySelector('.ss__skeleton');
		expect(pagination).toBeInTheDocument();
		expect(pagination.classList.length).toBe(1);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				skeleton: {
					disableStyles: false,
				},
			},
		};
		const propTheme = {
			components: {
				skeleton: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Skeleton height="300px" width="300px" theme={propTheme} />
			</ThemeProvider>
		);

		const pagination = rendered.container.querySelector('.ss__skeleton');
		expect(pagination).toBeInTheDocument();
		expect(pagination.classList.length).toBe(1);
	});
});
