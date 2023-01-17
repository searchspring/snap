import { h } from 'preact';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { Button } from './Button';
import { ThemeProvider } from '../../../providers';

describe('Button Component', () => {
	describe('styled', () => {
		it('does not render without children or content props', () => {
			const rendered = render(<Button />);
			expect(rendered.container).toBeInTheDocument();

			const buttonElement = rendered.container.querySelector('.ss__button');
			expect(buttonElement).not.toBeInTheDocument();
		});

		it('renders with content prop', () => {
			const content = 'button1';
			const rendered = render(<Button content={content} />);

			const buttonElement = rendered.container.querySelector('.ss__button');
			expect(buttonElement).toBeInTheDocument();

			expect(buttonElement?.classList.length).toBeGreaterThan(1);

			const buttonElementByContent = rendered.getByText(content);
			expect(buttonElementByContent).toBeInTheDocument();
		});

		it('renders with children prop', () => {
			const content = <h1 className="child">childbutton</h1>;
			const rendered = render(<Button>{content}</Button>);

			const buttonElement = rendered.container.querySelector('.ss__button');
			expect(buttonElement).toBeInTheDocument();

			const childElement = buttonElement?.querySelector('.child');
			expect(childElement).toBeInTheDocument();

			const childElementAltSelector = rendered.getByText('childbutton');
			expect(childElementAltSelector).toBeInTheDocument();
		});

		it('renders with children and content props', () => {
			const content = 'contenttext';
			const childrenContent = 'buttontext';
			const rendered = render(<Button content={content}>{childrenContent}</Button>);

			const buttonElement = rendered.getByText(content + childrenContent);
			expect(buttonElement).toBeInTheDocument();
		});

		it('renders with className prop', () => {
			const className = 'classy';
			const content = 'classy button';

			const rendered = render(<Button className={className}>{content}</Button>);

			const button = rendered.container.querySelector(`.${className}`);
			expect(button).toBeInTheDocument();
		});

		it('renders with colors prop', () => {
			const content = 'colorful button';
			const color = 'blue';
			const backgroundColor = 'green';
			const borderColor = 'red';

			const rendered = render(
				<Button color={color} backgroundColor={backgroundColor} borderColor={borderColor}>
					{content}
				</Button>
			);

			const button = rendered.getByText(content);

			const styles = getComputedStyle(button);
			expect(styles.color).toBe(color);
			expect(styles.backgroundColor).toBe(backgroundColor);
			expect(styles.borderColor).toBe(borderColor);
			expect(button).toBeInTheDocument();
		});

		it('fires onClick prop when clicked', () => {
			const clickFn = jest.fn();
			const content = 'clickable button';

			const rendered = render(<Button onClick={clickFn}>{content}</Button>);

			const buttonElement = rendered.container.querySelector('.ss__button');

			if (buttonElement) userEvent.click(buttonElement);

			expect(clickFn).toHaveBeenCalled();
		});

		it('adds class "ss__button--disabled" and prevents onClick when disabled by prop', () => {
			const clickFn = jest.fn();
			const content = 'disabled button';

			const rendered = render(<Button onClick={clickFn} disabled content={content} />);

			const buttonElement = rendered.container.querySelector(`.ss__button.ss__button--disabled`);
			expect(buttonElement).toBeInTheDocument();

			if (buttonElement) userEvent.click(buttonElement);
			expect(clickFn).not.toHaveBeenCalled();
		});

		it('renders with additional style using prop', () => {
			const content = 'styled button';
			const style = {
				padding: '20px',
			};

			const rendered = render(<Button style={style} content={content} />);
			const buttonElement = rendered.container.querySelector('.ss__button')!;
			let styles = getComputedStyle(buttonElement);

			expect(styles.padding).toBe(style.padding);
		});

		it('can disable styles', () => {
			const content = 'styleless button';

			const rendered = render(<Button disableStyles>{content}</Button>);

			const buttonElement = rendered!.container.querySelector('.ss__button');
			expect(buttonElement?.classList.length).toBe(2);
			expect(buttonElement).toBeInTheDocument();
		});

		it('is themeable with ThemeProvider', () => {
			const content = 'themed button';
			const globalTheme = {
				components: {
					button: {
						color: 'blue',
					},
				},
			};

			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Button content={content} />
				</ThemeProvider>
			);

			const buttonElement = rendered.container.querySelector('.ss__button')!;

			let styles = getComputedStyle(buttonElement);

			expect(styles.color).toBe(globalTheme.components.button.color);
			expect(buttonElement).toBeInTheDocument();
		});

		it('is themeable with theme prop', () => {
			const content = 'themed button';
			const propTheme = {
				components: {
					button: {
						color: 'blue',
					},
				},
			};

			const rendered = render(<Button content={content} theme={propTheme} />);

			const buttonElement = rendered.container.querySelector('.ss__button')!;

			let styles = getComputedStyle(buttonElement);

			expect(styles.color).toBe(propTheme.components.button.color);
			expect(buttonElement).toBeInTheDocument();
		});

		it('is themeable and theme prop overrides ThemeProvider', () => {
			const content = 'themed button';
			const globalTheme = {
				components: {
					button: {
						color: 'blue',
					},
				},
			};

			const propTheme = {
				components: {
					button: {
						color: 'red',
					},
				},
			};

			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Button theme={propTheme} content={content} />
				</ThemeProvider>
			);

			const buttonElement = rendered.container.querySelector('.ss__button')!;

			let styles = getComputedStyle(buttonElement);

			expect(styles.color).toBe(propTheme.components.button.color);
			expect(buttonElement).toBeInTheDocument();
		});
	});

	describe('native', () => {
		it('does not render without children or content props', () => {
			const rendered = render(<Button native />);
			expect(rendered.container).toBeInTheDocument();

			const buttonElement = rendered.container.querySelector('.ss__button');
			expect(buttonElement).not.toBeInTheDocument();
		});

		it('renders with content prop', () => {
			const content = 'button1';
			const rendered = render(<Button native content={content} />);

			const buttonElement = rendered.container.querySelector('.ss__button');
			expect(buttonElement).toBeInTheDocument();

			expect(buttonElement?.classList.length).toBe(2);

			const buttonElementByContent = rendered.getByText(content);
			expect(buttonElementByContent).toBeInTheDocument();
		});

		it('Can enable/disable useAlly with disableA11y prop', () => {
			const content = 'button1';
			const rendered = render(<Button content={content} />);

			const buttonElement = rendered.container.querySelector('.ss__button');
			expect(buttonElement).toBeInTheDocument();

			expect(buttonElement).toHaveAttribute('ssA11y');

			const rendered2 = render(<Button content={content} disableA11y />);

			const buttonElement2 = rendered2.container.querySelector('.ss__button');
			expect(buttonElement2).not.toHaveAttribute('ssA11y');
		});

		it('renders with children prop', () => {
			const content = <h1 className="child">childbutton</h1>;
			const rendered = render(<Button native>{content}</Button>);

			const buttonElement = rendered.container.querySelector('.ss__button');
			expect(buttonElement).toBeInTheDocument();

			const childElement = buttonElement?.querySelector('.child');
			expect(childElement).toBeInTheDocument();

			const childElementAltSelector = rendered.getByText('childbutton');
			expect(childElementAltSelector).toBeInTheDocument();
		});

		it('renders with children and content props', () => {
			const content = 'contenttext';
			const childrenContent = 'buttontext';
			const rendered = render(
				<Button native content={content}>
					{childrenContent}
				</Button>
			);

			const buttonElement = rendered.container.querySelector('.ss__button');
			expect(buttonElement).toBeInTheDocument();

			const childElementAltSelector = rendered.getByText(content + childrenContent);
			expect(childElementAltSelector).toBeInTheDocument();
		});

		it('renders with className prop', () => {
			const className = 'classy';
			const content = 'classy button';

			const rendered = render(
				<Button native className={className}>
					{content}
				</Button>
			);

			const button = rendered.container.querySelector(`.${className}`);
			expect(button).toBeInTheDocument();
		});

		it('does not render with colors prop', () => {
			const content = 'colorful button';
			const color = 'blue';
			const backgroundColor = 'green';
			const borderColor = 'red';

			const rendered = render(
				<Button native color={color} backgroundColor={backgroundColor} borderColor={borderColor}>
					{content}
				</Button>
			);

			const button = rendered.getByText(content);

			const styles = getComputedStyle(button);
			expect(styles.color).not.toBe(color);
			expect(styles.backgroundColor).not.toBe(backgroundColor);
			expect(styles.borderColor).not.toBe(borderColor);
			expect(button).toBeInTheDocument();
		});

		it('fires onClick prop when clicked', () => {
			const clickFn = jest.fn();
			const content = 'clickable button';

			const rendered = render(
				<Button native onClick={clickFn}>
					{content}
				</Button>
			);

			const buttonElement = rendered.container.querySelector('.ss__button');

			if (buttonElement) userEvent.click(buttonElement);

			expect(clickFn).toHaveBeenCalled();
		});

		it('adds class "ss__button--disabled" and prevents onClick when disabled by prop', () => {
			const clickFn = jest.fn();
			const content = 'disabled button';

			const rendered = render(<Button native onClick={clickFn} disabled content={content} />);

			const button = rendered.container.querySelector(`.ss__button.ss__button--disabled`);
			expect(button).toBeInTheDocument();

			if (button) userEvent.click(button);
			expect(clickFn).not.toHaveBeenCalled();
		});
	});
});
