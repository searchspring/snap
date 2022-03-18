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

	it('can disable styling', () => {
		const rendered = render(<ErrorHandler error={error} disableStyles={true} />);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement.classList.length).toBe(2);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<ErrorHandler error={error} className={className} />);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement).toBeInTheDocument();
		expect(ErrorElement).toHaveClass(className);
	});

	const gTheme = {
		components: {
			errorHandler: {
				className: 'GlobalThemeClass',
			},
		},
	};

	it('is themeable with ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={gTheme}>
				<ErrorHandler error={error} />
			</ThemeProvider>
		);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement).toBeInTheDocument();
		expect(ErrorElement).toHaveClass(gTheme.components.errorHandler.className);
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<ErrorHandler error={error} theme={gTheme} />);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement).toBeInTheDocument();
		expect(ErrorElement).toHaveClass(gTheme.components.errorHandler.className);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const themeOverride = {
			components: {
				errorHandler: {
					className: 'themeOverride',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={gTheme}>
				<ErrorHandler error={error} theme={themeOverride} />
			</ThemeProvider>
		);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement).toBeInTheDocument();
		expect(ErrorElement).toHaveClass(themeOverride.components.errorHandler.className);
		expect(ErrorElement).not.toHaveClass(gTheme.components.errorHandler.className);
	});
});
