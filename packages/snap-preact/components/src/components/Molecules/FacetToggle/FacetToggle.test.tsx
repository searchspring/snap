import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../providers';
import { FacetToggle } from './FacetToggle';
import type { FacetValue, ValueFacet } from '@searchspring/snap-store-mobx';
import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModelFacet, SearchResponseModelFacetValueAllOf } from '@searchspring/snapi-types';

describe('FacetToggle Component', () => {
	let value: FacetValue;
	let listFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf;

	beforeEach(() => {
		const mockData = new MockData();
		listFacetMock = mockData
			.search()
			.facets!.filter((facet) => facet.type == 'value')!
			.pop()!;

		value = listFacetMock.values![0] as FacetValue;
	});

	it('renders with values', () => {
		const rendered = render(<FacetToggle values={[value]} />);
		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element).toBeInTheDocument();
	});

	it('renders with facet', () => {
		const facet = listFacetMock;
		facet.values = [facet.values![0]];
		const rendered = render(<FacetToggle facet={facet as ValueFacet} />);
		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element).toBeInTheDocument();
	});

	it('wont render with no value or facet', () => {
		const rendered = render(<FacetToggle />);
		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element).not.toBeInTheDocument();
	});

	it('wont render with multiple values', () => {
		const rendered = render(<FacetToggle values={listFacetMock.values as FacetValue[]} />);
		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element).not.toBeInTheDocument();
	});

	it('wont render with multiple values in facet', () => {
		const rendered = render(<FacetToggle facet={listFacetMock as ValueFacet} />);
		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element).not.toBeInTheDocument();
	});

	it('renders custom label', () => {
		const _label = 'custom label';
		const rendered = render(<FacetToggle values={[value]} label={_label} />);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		const label = rendered.container.querySelector('.ss__toggle__label');

		expect(element).toBeInTheDocument();
		expect(label).toHaveTextContent(_label);
	});

	it('renders value label by default', () => {
		const rendered = render(<FacetToggle values={[value]} />);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		const label = rendered.container.querySelector('.ss__toggle__label');

		expect(element).toBeInTheDocument();
		expect(label).toHaveTextContent(value.label);
	});

	it('can disable styling', () => {
		const rendered = render(<FacetToggle values={[value]} disableStyles={true} />);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element?.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<FacetToggle values={[value]} className={className} />);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('can set custom onClick func', async () => {
		const onClickFunc = jest.fn();
		const rendered = render(<FacetToggle values={[value]} onClick={onClickFunc} />);

		const element = rendered.container.querySelector('.ss__toggle__switch')!;
		expect(element).toBeInTheDocument();
		userEvent.click(element);

		await waitFor(() => {
			expect(onClickFunc).toHaveBeenCalled();
		});
	});

	it('calls urlManager onclick func onclick', async () => {
		const onclickFunc = jest.fn();
		// @ts-ignore
		value.url = {
			link: {
				onClick: onclickFunc,
			},
		};

		const rendered = render(<FacetToggle values={[value]} />);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		const toggle = rendered.container.querySelector('.ss__toggle__switch');

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
				<FacetToggle values={[value]} />
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

		const rendered = render(<FacetToggle values={[value]} theme={propTheme} />);

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
				<FacetToggle values={[value]} theme={propTheme} />
			</ThemeProvider>
		);

		const element = rendered.container.querySelector('.ss__facet-toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.facetToggle.className);
		expect(element).not.toHaveClass(globalTheme.components.facetToggle.className);
	});
});
