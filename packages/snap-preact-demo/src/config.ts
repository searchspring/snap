import type { SrpProps } from '@searchspring/snap-preact-components';
import { Styling } from './style';

export const config: SrpProps = {
	someSettings: '',
	filterSummaryLayout: 'horizontal',
	sortLayout: 'vertical',
	perPageLayout: 'vertical',
	style: Styling,
	observerable: {},
	theme: {
		primaryFont: 'fantasy',
		components: {
			checkbox: {
				// native: true,
			},
			select: {
				// native: true,
			},
			facet: {
				components: {
					checkbox: {},
				},
			},
			results: {
				// layout:"list"
			},
			result: {
				detailSlot: 'hi',
			},
		},
	},
};
