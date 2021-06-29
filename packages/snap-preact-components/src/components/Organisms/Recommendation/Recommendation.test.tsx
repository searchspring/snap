import { h } from 'preact';
import { render } from '@testing-library/preact';

import { ThemeProvider } from '../../../providers/theme';

import { Recommendation } from './Recommendation';
import { filters } from '../../../mocks/store';

describe('Recommendation Component', () => {
	it.skip('renders with results', () => {
		const rendered = render(<Recommendation />);
		const recommendationElement = rendered.container.querySelector('.ss__recommendation');

		expect(recommendationElement).toBeInTheDocument();
	});
});
