import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { Skeleton } from './Skeleton';

describe('Skeleton Component', () => {
	it('renders', () => {
		const rendered = render(<Skeleton height="200px" width="200px" />);
		const skeleton = rendered.container.querySelector('.ss__skeleton');
		expect(skeleton).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has correct demmensions', () => {
		const rendered = render(<Skeleton height="400px" width="300px" />);
		const skeleton = rendered.container.querySelector('.ss__skeleton');
		expect(skeleton).toHaveStyle('height:400px; width:300px');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can change the backgroundColor color', () => {
		const rendered = render(<Skeleton height="400px" width="300px" backgroundColor={'red'} />);
		const skeleton = rendered.container.querySelector('.ss__skeleton');
		expect(skeleton).toHaveStyle('background-color:red');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can change to a circle', () => {
		const rendered = render(<Skeleton height="300px" width="300px" round={true} />);
		const skeleton = rendered.container.querySelector('.ss__skeleton');
		expect(skeleton).toHaveStyle('border-radius:300px');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Skeleton className={className} height="300px" width="300px" />);
		const skeleton = rendered.container.querySelector('.ss__skeleton');

		expect(skeleton).toHaveClass(className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('disables styles', () => {
		const rendered = render(<Skeleton disableStyles height="300px" width="300px" />);
		const skeleton = rendered.container.querySelector('.ss__skeleton');

		expect(skeleton?.classList).toHaveLength(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
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
		const skeleton = rendered.container.querySelector('.ss__skeleton');
		expect(skeleton).toBeInTheDocument();
		expect(skeleton?.classList.length).toBe(1);
		expect(rendered.asFragment()).toMatchSnapshot();
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
		const skeleton = rendered.container.querySelector('.ss__skeleton');
		expect(skeleton).toBeInTheDocument();
		expect(skeleton?.classList.length).toBe(1);
		expect(rendered.asFragment()).toMatchSnapshot();
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

		const skeleton = rendered.container.querySelector('.ss__skeleton');
		expect(skeleton).toBeInTheDocument();
		expect(skeleton?.classList.length).toBe(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});
