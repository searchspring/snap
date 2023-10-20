import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../providers';

import { FacetToggle } from './FacetToggle';
import type { FacetValue } from '@searchspring/snap-store-mobx';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModelFacet, SearchResponseModelFacetValueAllOf } from '@searchspring/snapi-types';

const mockData = new MockData();
const listFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = mockData
	.search()
	.facets!.filter((facet) => facet.type == 'value')!
	.pop()!;

describe('FacetToggle Component', () => {
	const value = listFacetMock.values![0] as FacetValue;

	it('renders', () => {
		const rendered = render(<FacetToggle value={value} />);
		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element).toBeInTheDocument();
	});

	it('renders label and count', () => {
		const rendered = render(<FacetToggle value={value} label={value.label} />);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		const label = rendered.container.querySelector('.ss__facet-toggle__label');

		expect(element).toBeInTheDocument();
		expect(label).toHaveTextContent(value.label);
	});

	it('renders with round prop', () => {
		const rendered = render(<FacetToggle value={value} round={true} label={value.label} />);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		const slider = rendered.container.querySelector('.ss__facet-toggle__slider');

		expect(element).toBeInTheDocument();
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveClass('ss__facet-toggle__slider--round');
		let styles = getComputedStyle(slider!);
		expect(styles.borderRadius).toBe('34px');
	});

	it('can change the colors', async () => {
		const activeColor = 'orange';
		const inactiveColor = 'red';
		const buttonColor = 'blue';
		const rendered = render(
			<FacetToggle value={value} activeColor={activeColor} inactiveColor={inactiveColor} buttonColor={buttonColor} label={value.label} />
		);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		const slider = rendered.container.querySelector('.ss__facet-toggle__slider');
		const toggle = rendered.container.querySelector('.ss__facet-toggle__switch');

		expect(element).toBeInTheDocument();
		expect(slider).toBeInTheDocument();
		let styles = getComputedStyle(slider!);
		expect(styles.backgroundColor).toBe(inactiveColor);

		userEvent.click(toggle!);

		await waitFor(() => {
			let styles = getComputedStyle(slider!);
			expect(styles.backgroundColor).toBe(activeColor);
		});
	});

	it('can disable styling', () => {
		const rendered = render(<FacetToggle value={value} disableStyles={true} />);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element?.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<FacetToggle value={value} className={className} />);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('can set custom onClick func', () => {
		const onClickFunc = jest.fn();
		const rendered = render(<FacetToggle value={value} onClick={onClickFunc} />);

		const element = rendered.container.querySelector('.ss__facet-toggle__switch')!;
		expect(element).toBeInTheDocument();
		userEvent.click(element);
		expect(onClickFunc).toHaveBeenCalled();
	});

	it('calls urlManager onclick func onclick', async () => {
		const onclickFunc = jest.fn();
		// @ts-ignore
		value.url = {
			link: {
				onClick: onclickFunc,
			},
		};

		const rendered = render(<FacetToggle value={value} />);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		const toggle = rendered.container.querySelector('.ss__facet-toggle__switch');

		expect(element).toBeInTheDocument();

		userEvent.click(toggle!);

		await waitFor(() => {
			expect(onclickFunc).toHaveBeenCalled();
		});
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				facetToggle: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetToggle value={value} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(globalTheme.components.facetToggle.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				facetToggle: {
					className: 'classy',
				},
			},
		};

		const rendered = render(<FacetToggle value={value} theme={propTheme} />);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.facetToggle.className);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				facetToggle: {
					className: 'notclassy',
				},
			},
		};
		const propTheme = {
			components: {
				facetToggle: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetToggle value={value} theme={propTheme} />
			</ThemeProvider>
		);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.facetToggle.className);
		expect(element).not.toHaveClass(globalTheme.components.facetToggle.className);
	});
});
