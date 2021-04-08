import { h } from 'preact';

import { render } from '@testing-library/preact';

import { searchResponse } from '../../../mocks/searchResponse';
import { InlineBanner } from './InlineBanner';
import { BannerType } from '../../../types';
import { ThemeProvider } from '../../../providers/theme';

describe('Merchandising Inline Banner Component', () => {
	it('renders type:inline banner', () => {
		const rendered = render(<InlineBanner banner={searchResponse.merchandising.content.inline[0]} />);
		const merchBannerElement = rendered.container.querySelector('.ss-inlineBanner');
		expect(merchBannerElement).toBeInTheDocument();
		expect(merchBannerElement.innerHTML).toBe(searchResponse.merchandising.content.inline[0].value);
	});
});
