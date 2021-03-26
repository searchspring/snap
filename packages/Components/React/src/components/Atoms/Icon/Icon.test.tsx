import { h } from 'preact';

import { render } from '@testing-library/preact';

import { Icon } from './Icon';
import { iconPaths } from './paths';
import { ThemeProvider } from '../../../providers/theme';

const defaultProps = {
	className: '',
	color: '#000',
	icon: '',
	path: '',
	size: '16px',
	width: '',
	height: '',
	viewBox: '0 0 56 56',
};

describe('Icon Component', () => {
	it('does not render without icon or path props', () => {
		const rendered = render(<Icon />);
		expect(rendered.container).toBeInTheDocument();

		const svg = rendered.container.querySelector('svg');
		expect(svg).not.toBeInTheDocument();
	});

	it('renders with icon prop', () => {
		const icon = 'cog';
		const rendered = render(<Icon icon={icon} />);

		const iconElement = rendered.container.querySelector('.ss-icon');

		expect(iconElement.classList.length).toBe(3);
	});

	it('renders with classname', () => {
		const icon = 'cog';
		const className = 'classy';
		const rendered = render(<Icon className={className} icon={icon} />);

		const iconElement = rendered.container.querySelector('.ss-icon');

		expect(iconElement).toHaveClass(className);
		expect(iconElement.classList.length).toBe(4);
	});

	it('renders with additional style using prop', () => {
		const icon = 'cog';
		const style = {
			padding: '20px',
		};

		const rendered = render(<Icon style={style} icon={icon} />);
		const iconElement = rendered.container.querySelector('.ss-icon');
		const styles = getComputedStyle(iconElement);

		expect(styles.padding).toBe(style.padding);
	});

	it('renders cog icon with default props', () => {
		const icon = 'cog';

		const rendered = render(<Icon icon={icon} />);
		expect(rendered.container).toBeInTheDocument();

		const svg = rendered.container.querySelector('svg');
		expect(svg).toHaveClass('ss-icon');
		expect(svg).toHaveAttribute('viewBox', defaultProps.viewBox);

		const styles = getComputedStyle(svg);
		expect(styles.width).toBe(defaultProps.size);
		expect(styles.height).toBe(defaultProps.size);
		expect(styles.fill).toBe(defaultProps.color);

		const path = svg.querySelector('path');
		expect(path).toHaveAttribute('d', iconPaths[icon]);
	});

	it('renders cog icon with custom props', () => {
		const icon = 'cog';
		const color = '#ff0000';
		const size = '30em';
		const viewBox = '0 0 63 63';
		const className = 'classy';

		const rendered = render(<Icon icon={icon} color={color} size={size} viewBox={viewBox} className={className} />);
		expect(rendered.container).toBeInTheDocument();

		const svg = rendered.container.querySelector('svg');
		expect(svg).toHaveClass('ss-icon');
		expect(svg).toHaveClass(className);
		expect(svg).toHaveAttribute('viewBox', viewBox);

		const styles = getComputedStyle(svg);
		expect(styles.width).toBe(size);
		expect(styles.height).toBe(size);
		expect(styles.fill).toBe(color);

		const path = svg.querySelector('path');
		expect(path).toHaveAttribute('d', iconPaths[icon]);
	});

	it('renders custom path with default props', () => {
		const svgPath =
			'M12.9,13.8C12.9,13.8,12.9,13.8,12.9,13.8c-0.1,0.1-0.3,0.2-0.5,0.2C4.5,17.9,1.9,28.8,6.6,38.5l28.6-13.8 c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.2C43.5,20.6,46.2,9.7,41.5,0L12.9,13.8zM8.6,42.1C8.6,42.1,8.6,42.1,8.6,42.1c-0.1,0.1-0.3,0.1-0.5,0.2C0.3,46.1-2.4,57,2.3,66.7l28.6-13.8 c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.2c7.9-3.8,10.5-14.8,5.8-24.4L8.6,42.1z';

		const rendered = render(<Icon path={svgPath} />);
		expect(rendered.container).toBeInTheDocument();

		const svg = rendered.container.querySelector('svg');
		expect(svg).toHaveClass('ss-icon');
		expect(svg).toHaveAttribute('viewBox', defaultProps.viewBox);

		const styles = getComputedStyle(svg);
		expect(styles.width).toBe(defaultProps.size);
		expect(styles.height).toBe(defaultProps.size);
		expect(styles.fill).toBe(defaultProps.color);

		const path = svg.querySelector('path');
		expect(path).toHaveAttribute('d', svgPath);
	});

	it('renders custom path with custom props', () => {
		const svgPath =
			'M12.9,13.8C12.9,13.8,12.9,13.8,12.9,13.8c-0.1,0.1-0.3,0.2-0.5,0.2C4.5,17.9,1.9,28.8,6.6,38.5l28.6-13.8 c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.2C43.5,20.6,46.2,9.7,41.5,0L12.9,13.8zM8.6,42.1C8.6,42.1,8.6,42.1,8.6,42.1c-0.1,0.1-0.3,0.1-0.5,0.2C0.3,46.1-2.4,57,2.3,66.7l28.6-13.8 c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.2c7.9-3.8,10.5-14.8,5.8-24.4L8.6,42.1z';
		const color = '#3a23ad';
		const size = '3em';
		const viewBox = '0 0 70 70';
		const className = 'custom-classy';

		const rendered = render(<Icon path={svgPath} color={color} size={size} viewBox={viewBox} className={className} />);
		expect(rendered.container).toBeInTheDocument();

		const svg = rendered.container.querySelector('svg');
		expect(svg).toHaveClass('ss-icon');
		expect(svg).toHaveClass(className);
		expect(svg).toHaveAttribute('viewBox', viewBox);

		const styles = getComputedStyle(svg);
		expect(styles.width).toBe(size);
		expect(styles.height).toBe(size);
		expect(styles.fill).toBe(color);

		const path = svg.querySelector('path');
		expect(path).toHaveAttribute('d', svgPath);
	});

	it('can disable styles', () => {
		const icon = 'cog';
		const color = '#3a23ad';
		const size = '40px';

		const rendered = render(<Icon disableStyles icon={icon} color={color} size={size} />);
		expect(rendered.container).toBeInTheDocument();

		const svg = rendered.container.querySelector('svg');
		expect(svg).toHaveClass('ss-icon');
		expect(svg.classList[2]).toMatch(/^css-0/);

		expect(svg).toHaveAttribute('width', size);
		expect(svg).toHaveAttribute('height', size);

		const path = svg.querySelector('path');
		expect(path).toHaveAttribute('d', iconPaths[icon]);
		expect(path).toHaveAttribute('fill', color);
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				icon: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Icon icon="cog" />
			</ThemeProvider>
		);

		const iconElement = rendered.container.querySelector('.ss-icon');
		expect(iconElement).toHaveClass(globalTheme.components.icon.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				icon: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(<Icon icon="cog" theme={propTheme} />);

		const iconElement = rendered.container.querySelector('.ss-icon');
		expect(iconElement).toHaveClass(propTheme.components.icon.className);
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				icon: {
					className: 'global-class',
				},
			},
		};

		const propTheme = {
			components: {
				icon: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Icon icon="cog" theme={propTheme} />
			</ThemeProvider>
		);

		const iconElement = rendered.container.querySelector('.ss-icon');
		expect(iconElement).toHaveClass(propTheme.components.icon.className);
		expect(iconElement).not.toHaveClass(globalTheme.components.icon.className);
	});
});
