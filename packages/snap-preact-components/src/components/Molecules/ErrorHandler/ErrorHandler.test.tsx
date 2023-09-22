import { h } from 'preact';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { ErrorType } from '@searchspring/snap-store-mobx';

import { ThemeProvider } from '../../../providers/theme';
import themes from '../../../themes';
import { ErrorHandler } from './ErrorHandler';

describe('Error Handler Component', () => {
	const error = {
		type: ErrorType.WARNING,
		message: 'hello',
	};

	Object.keys(themes || {}).forEach((themeName) => {
		it(`uses ${themeName} theme`, () => {
			const theme = themes[themeName as keyof typeof themes];
			const rendered = render(<ErrorHandler theme={theme} error={error} />);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it('renders using custom error', () => {
		const rendered = render(<ErrorHandler error={error} />);
		const errorElement = rendered.container.querySelector('.ss__error-handler');
		expect(errorElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can use custom retry onClick event', () => {
		const onClick = jest.fn();
		const rendered = render(<ErrorHandler error={{ code: 429, ...error }} onRetryClick={onClick} />);
		const errorElement = rendered.container.querySelector('.ss__error-handler');
		const retryButton = errorElement?.querySelector('.ss__error-handler__button')!;
		expect(errorElement).toBeInTheDocument();
		expect(retryButton).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();

		userEvent.click(retryButton);
		expect(onClick).toHaveBeenCalled();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can disable styling', () => {
		const rendered = render(<ErrorHandler error={error} disableStyles={true} />);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement?.classList.length).toBe(2);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<ErrorHandler error={error} className={className} />);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement).toBeInTheDocument();
		expect(ErrorElement).toHaveClass(className);
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<ErrorHandler error={error} theme={gTheme} />);

		const ErrorElement = rendered.container.querySelector('.ss__error-handler');
		expect(ErrorElement).toBeInTheDocument();
		expect(ErrorElement).toHaveClass(gTheme.components.errorHandler.className);
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});
