import { h } from 'preact';
import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers/theme';

import { FacetListOptions } from './FacetListOptions';
import { listFacetMock } from '../../../mocks/searchResponse';

describe('ListValue Component', () => {
	let listValueComponent;
	beforeEach(() => {
		listValueComponent = render(<FacetListOptions values={listFacetMock.values} />);
	});

	it('renders', () => {
		const listValueElement = listValueComponent.container.querySelector('.ss__facet-list-options');
		expect(listValueElement).toBeInTheDocument();
	});

	it('renders label and count', () => {
		const listOption = listValueComponent.container.querySelectorAll('.ss__facet-list-options__option');

		expect(listOption).toHaveLength(listFacetMock.values.length);

		expect(listOption[0]).toHaveTextContent(listFacetMock.values[0].label);

		const optionCount = listOption[0].querySelector('.ss__facet-list-options__option__value__count');
		expect(optionCount).toHaveTextContent(listFacetMock.values[0].count.toString());
	});

	it('renders checkboxs', () => {
		const checkbox = listValueComponent.container.querySelector('.ss__checkbox');
		expect(checkbox).toBeInTheDocument();
	});
});

describe('ListValue Component hiding checkbox and count', () => {
	let listValueComponent;
	beforeEach(() => {
		listValueComponent = render(<FacetListOptions hideCheckbox={true} hideCount={true} values={listFacetMock.values} />);
	});

	it('renders', () => {
		const listValueElement = listValueComponent.container.querySelector('.ss__facet-list-options');
		expect(listValueElement).toBeInTheDocument();
	});

	it('doesnt render checkboxs', () => {
		const checkbox = listValueComponent.container.querySelector('.ss__checkbox');
		expect(checkbox).not.toBeInTheDocument();
	});

	it('renders label but not count', () => {
		const listOption = listValueComponent.container.querySelectorAll('.ss__facet-list-options__option');

		expect(listOption).toHaveLength(listFacetMock.values.length);

		expect(listOption[0]).toHaveTextContent(listFacetMock.values[0].label);
		expect(listOption[0]).not.toHaveTextContent(listFacetMock.values[0].count.toString());
	});
});

describe('FacetListOptions theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				facetListOptions: {
					hideCount: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetListOptions values={listFacetMock.values} />
			</ThemeProvider>
		);
		const Element = rendered.container.querySelector('.ss__facet-list-options');
		const countElement = rendered.container.querySelector('.ss__facet-list-options__option__value__count');
		expect(Element).toBeInTheDocument();
		expect(countElement).not.toBeInTheDocument();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				facetListOptions: {
					hideCount: true,
				},
			},
		};

		const rendered = render(<FacetListOptions values={listFacetMock.values} theme={propTheme} />);

		const Element = rendered.container.querySelector('.ss__facet-list-options');
		const countElement = rendered.container.querySelector('.ss__facet-list-options__option__value__count');
		expect(Element).toBeInTheDocument();
		expect(countElement).not.toBeInTheDocument();
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				facetListOptions: {
					hideCount: true,
				},
			},
		};
		const propTheme = {
			components: {
				facetListOptions: {
					hideCount: false,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetListOptions values={listFacetMock.values} theme={propTheme} />
			</ThemeProvider>
		);

		const Element = rendered.container.querySelector('.ss__facet-list-options');
		const countElement = rendered.container.querySelector('.ss__facet-list-options__option__value__count');
		expect(Element).toBeInTheDocument();
		expect(countElement).toBeInTheDocument();
	});
});
