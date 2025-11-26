import { h } from 'preact';
import { render, fireEvent } from '@testing-library/preact';
import { Tooltip } from '../Tooltip';
import { ThemeProvider } from '../../../providers';
import '@testing-library/jest-dom';

describe('Tooltip Component', () => {
	const content = 'Tooltip Content';

	it('renders with content', () => {
		const rendered = render(<Tooltip content={content} />);
		const tooltipContent = rendered.container.querySelector('.ss__tooltip__content');
		expect(tooltipContent).toBeInTheDocument();
		expect(tooltipContent).toHaveTextContent(content);
	});

	it('renders with children', () => {
		const childrenText = 'Hover me';
		const rendered = render(
			<Tooltip content={content}>
				<span>{childrenText}</span>
			</Tooltip>
		);
		const childrenElement = rendered.getByText(childrenText);
		expect(childrenElement).toBeInTheDocument();
	});

	it('renders with icon', () => {
		const icon = 'info';
		const rendered = render(<Tooltip content={content} icon={icon} />);
		const iconElement = rendered.container.querySelector('.ss__icon');
		expect(iconElement).toBeInTheDocument();
		expect(iconElement).toHaveClass(`ss__icon--${icon}`);
	});

	it('renders with both icon and children', () => {
		const icon = 'info';
		const childrenText = 'Hover me';
		const rendered = render(
			<Tooltip content={content} icon={icon}>
				<span>{childrenText}</span>
			</Tooltip>
		);
		const iconElement = rendered.container.querySelector('.ss__icon');
		const childrenElement = rendered.getByText(childrenText);
		expect(iconElement).toBeInTheDocument();
		expect(childrenElement).toBeInTheDocument();
	});

	it('renders with custom class name', () => {
		const className = 'custom-class';
		const rendered = render(<Tooltip content={content} className={className} />);
		const tooltipElement = rendered.container.querySelector('.ss__tooltip');
		expect(tooltipElement).toHaveClass(className);
	});

	it('renders with position prop', () => {
		const position = 'bottom';
		const rendered = render(<Tooltip content={content} position={position} />);
		const tooltipElement = rendered.container.querySelector('.ss__tooltip');
		expect(tooltipElement).toBeInTheDocument();
		// Note: styles are applied via emotion/css, so we might not see class changes directly related to position
		// but we can check if the component renders without error
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Tooltip content={content} className={className} />);

		const resultsElement = rendered.container.querySelector('.ss__tooltip');
		expect(resultsElement).toBeInTheDocument();
		expect(resultsElement).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<Tooltip content={content} disableStyles />);

		const resultsElement = rendered.container.querySelector('.ss__tooltip');
		expect(resultsElement?.classList).toHaveLength(1);
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				tooltip: {
					className: 'theme-class',
				},
			},
		};
		const content = 'Tooltip Content';
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Tooltip content={content} />
			</ThemeProvider>
		);
		const tooltipElement = rendered.container.querySelector('.ss__tooltip');
		expect(tooltipElement).toHaveClass(globalTheme.components.tooltip.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				tooltip: {
					className: 'theme-class',
				},
			},
		};
		const content = 'Tooltip Content';
		const rendered = render(<Tooltip content={content} theme={propTheme} />);
		const tooltipElement = rendered.container.querySelector('.ss__tooltip');
		expect(tooltipElement).toHaveClass(propTheme.components.tooltip.className);
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				tooltip: {
					className: 'global-class',
				},
			},
		};
		const propTheme = {
			components: {
				tooltip: {
					className: 'theme-class',
				},
			},
		};
		const content = 'Tooltip Content';
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Tooltip content={content} theme={propTheme} />
			</ThemeProvider>
		);
		const tooltipElement = rendered.container.querySelector('.ss__tooltip');
		expect(tooltipElement).toHaveClass(propTheme.components.tooltip.className);
		expect(tooltipElement).not.toHaveClass(globalTheme.components.tooltip.className);
	});

	it('renders with usePortal prop', async () => {
		const content = 'Portal Content';
		const childrenText = 'Hover me';
		const rendered = render(
			<Tooltip content={content} usePortal>
				<span>{childrenText}</span>
			</Tooltip>
		);

		const trigger = rendered.getByText(childrenText).closest('.ss__tooltip');
		expect(trigger).toBeInTheDocument();

		// Initially not visible
		expect(rendered.queryByText(content)).not.toBeInTheDocument();

		// Hover
		fireEvent.mouseEnter(trigger!);

		// Now it should be visible
		const portalContent = await rendered.findByText(content);
		expect(portalContent).toBeInTheDocument();

		// Verify it is not in the container (it is in the body)
		expect(rendered.container).not.toContainElement(portalContent);
	});
});
