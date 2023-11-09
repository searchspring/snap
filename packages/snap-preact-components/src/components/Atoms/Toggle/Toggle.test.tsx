import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../providers';

import { Toggle } from './Toggle';

describe('Toggle Component', () => {
	const label = 'sale';

	it('renders', () => {
		const rendered = render(<Toggle />);
		const element = rendered.container.querySelector('.ss__toggle');
		expect(element).toBeInTheDocument();
	});

	it('renders label', () => {
		const rendered = render(<Toggle label={label} />);

		const element = rendered.container.querySelector('.ss__toggle');
		const labelElem = rendered.container.querySelector('.ss__toggle__label');

		expect(element).toBeInTheDocument();
		expect(labelElem).toHaveTextContent(label);
	});

	it('renders with round prop', () => {
		const rendered = render(<Toggle round={true} />);

		const element = rendered.container.querySelector('.ss__toggle');
		const slider = rendered.container.querySelector('.ss__toggle__slider');

		expect(element).toBeInTheDocument();
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveClass('ss__toggle__slider--round');
		let styles = getComputedStyle(slider!);
		expect(styles.borderRadius).toBe('50%');
	});

	it('can set toggled state', () => {
		const rendered = render(<Toggle toggled={true} />);

		const slider = rendered.container.querySelector('.ss__toggle__switch');

		expect(slider).toBeInTheDocument();
		expect(slider).toHaveClass('ss__toggle__switch--filtered');
	});

	it('can change the colors', async () => {
		const activeColor = 'orange';
		const inactiveColor = 'red';
		const buttonColor = 'blue';
		const rendered = render(<Toggle activeColor={activeColor} inactiveColor={inactiveColor} buttonColor={buttonColor} />);

		const element = rendered.container.querySelector('.ss__toggle');
		const slider = rendered.container.querySelector('.ss__toggle__slider-box');
		const toggle = rendered.container.querySelector('.ss__toggle__switch');

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
		const rendered = render(<Toggle disableStyles={true} />);

		const element = rendered.container.querySelector('.ss__toggle');
		expect(element?.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Toggle className={className} />);

		const element = rendered.container.querySelector('.ss__toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('can set custom onClick func', async () => {
		const onClickFunc = jest.fn();
		const rendered = render(<Toggle onClick={onClickFunc} />);

		const element = rendered.container.querySelector('.ss__toggle__switch')!;
		expect(element).toBeInTheDocument();
		userEvent.click(element);

		await waitFor(() => {
			expect(onClickFunc).toHaveBeenCalled();
		});
	});

	it('onclick toggles toggled state', async () => {
		const rendered = render(<Toggle toggled={true} />);

		const slider = rendered.container.querySelector('.ss__toggle__switch');

		expect(slider).toBeInTheDocument();
		expect(slider).toHaveClass('ss__toggle__switch--filtered');

		userEvent.click(slider!);

		await waitFor(() => {
			const slider = rendered.container.querySelector('.ss__toggle__switch');
			expect(slider).not.toHaveClass('ss__toggle__switch--filtered');
		});

		userEvent.click(slider!);

		await waitFor(() => {
			const slider = rendered.container.querySelector('.ss__toggle__switch');
			expect(slider).toHaveClass('ss__toggle__switch--filtered');
		});
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				toggle: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Toggle />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(globalTheme.components.toggle.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				toggle: {
					className: 'classy',
				},
			},
		};

		const rendered = render(<Toggle theme={propTheme} />);

		const element = rendered.container.querySelector('.ss__toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.toggle.className);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				toggle: {
					className: 'notclassy',
				},
			},
		};
		const propTheme = {
			components: {
				toggle: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Toggle theme={propTheme} />
			</ThemeProvider>
		);

		const element = rendered.container.querySelector('.ss__toggle');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(propTheme.components.toggle.className);
		expect(element).not.toHaveClass(globalTheme.components.toggle.className);
	});
});
