import { h } from 'preact';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { ErrorType } from '@searchspring/snap-store-mobx';

import { ThemeProvider } from '../../../providers/theme';
import { ErrorHandler } from './ErrorHandler';

describe('Error Handler Component', () => {
	const error = {
		type: ErrorType.WARNING,
		message: 'hello',
	};

	const globalTheme = {
		colors: {
			message: {
				error: '#333333',
				warning: '#666666',
				info: '#999999',
			},
		},
	};

	it('renders using custom error', () => {
		const rendered = render(<ErrorHandler error={error} />);
		const errorElement = rendered.container.querySelector('.ss__error-handler');
		expect(errorElement).toBeInTheDocument();
	});

	it('can use custom retry onClick event', () => {
		const onClick = jest.fn();
		const rendered = render(<ErrorHandler error={{ code: 429, ...error }} onRetryClick={onClick} />);
		const errorElement = rendered.container.querySelector('.ss__error-handler');
		const retryButton = errorElement.querySelector('.ss__error-handler__button');
		expect(errorElement).toBeInTheDocument();
		expect(retryButton).toBeInTheDocument();

		userEvent.click(retryButton);
		expect(onClick).toHaveBeenCalled();
	});

	it('is themeable with ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<ErrorHandler error={error} />
			</ThemeProvider>
		);

		const errorElement = rendered.container.querySelector('.ss__error-handler');

		const styles = getComputedStyle(errorElement);

		expect(styles.borderLeftColor).toBe(globalTheme.colors.message.warning);
		expect(errorElement).toBeInTheDocument();
	});
});
