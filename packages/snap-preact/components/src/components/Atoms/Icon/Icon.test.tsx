import { h } from 'preact';

import { render } from '@testing-library/preact';

import { Icon } from './Icon';
import { iconPaths } from './paths';
import { ThemeProvider } from '../../../providers';

const defaultProps = {
	className: '',
	color: '#333',
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

	it('does not render if false icon ', () => {
		const rendered = render(<Icon icon={false} />);
		expect(rendered.container).toBeInTheDocument();

		const iconElement = rendered.container.querySelector('.ss__icon');
		const svg = rendered.container.querySelector('svg');
		expect(svg).not.toBeInTheDocument();
		expect(iconElement).not.toBeInTheDocument();
	});

	it('renders with icon prop', () => {
		const icon = 'cog';
		const rendered = render(<Icon icon={icon} />);

		const iconElement = rendered.container.querySelector('.ss__icon');

		expect(iconElement?.classList.length).toBe(3);
	});

	it('renders with title', () => {
		const icon = 'cog';
		const title = 'custom title';
		const rendered = render(<Icon title={title} icon={icon} />);

		const iconElement = rendered.container.querySelector('.ss__icon');
		const titleElement = rendered.container.querySelector('.ss__icon title');
		expect(iconElement).toBeInTheDocument();
		expect(titleElement).toHaveTextContent(title);
	});

	it('renders with classname', () => {
		const icon = 'cog';
		const className = 'classy';
		const rendered = render(<Icon className={className} icon={icon} />);

		const iconElement = rendered.container.querySelector('.ss__icon');

		expect(iconElement).toHaveClass(className);
		expect(iconElement?.classList.length).toBe(4);
	});
	it('renders with additional style using prop', () => {
		const icon = 'cog';
		const style = {
			padding: '20px',
		};

		const rendered = render(<Icon style={style} icon={icon} />);
		const iconElement = rendered.container.querySelector('.ss__icon')!;
		const styles = getComputedStyle(iconElement);

		expect(styles.padding).toBe(style.padding);
	});

	it('renders cog icon with default props', () => {
		const icon = 'cog';

		const rendered = render(<Icon icon={icon} />);
		expect(rendered.container).toBeInTheDocument();

		const svg = rendered.container.querySelector('svg')!;
		expect(svg).toHaveClass('ss__icon');
		expect(svg).toHaveAttribute('viewBox', defaultProps.viewBox);

		const styles = getComputedStyle(svg);
		expect(styles.width).toBe(defaultProps.size);
		expect(styles.height).toBe(defaultProps.size);
		expect(styles.fill).toBe(defaultProps.color);

		const path = svg.querySelector('path');
		expect(path).toHaveAttribute('d', iconPaths[icon]);
	});

	it('renders cog icon with sizing', () => {
		const icon = 'cog';

		const width = '10px';
		const height = '15px';

		const rendered = render(<Icon icon={icon} width={width} height={height} />);
		expect(rendered.container).toBeInTheDocument();

		const svg = rendered.container.querySelector('svg')!;

		const styles = getComputedStyle(svg);
		expect(styles.width).toBe(width);
		expect(styles.height).toBe(height);

		const path = svg!.querySelector('path');
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

		const svg = rendered.container.querySelector('svg')!;
		expect(svg).toHaveClass('ss__icon');
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

		const svg = rendered.container.querySelector('svg')!;
		expect(svg).toHaveClass('ss__icon');
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

		const svg = rendered.container.querySelector('svg')!;
		expect(svg).toHaveClass('ss__icon');
		expect(svg).toHaveClass(className);
		expect(svg).toHaveAttribute('viewBox', viewBox);

		const styles = getComputedStyle(svg);
		expect(styles.width).toBe(size);
		expect(styles.height).toBe(size);
		expect(styles.fill).toBe(color);

		const path = svg.querySelector('path');
		expect(path).toHaveAttribute('d', svgPath);
	});

	it('renders path array of elements', () => {
		const line1 = {
			type: 'line',
			attributes: {
				x1: '1',
				y1: '6',
				x2: '19',
				y2: '6',
				stroke: '#000000',
				'stroke-linecap': 'round',
				'stroke-linejoin': 'round',
			},
		};
		const line2 = {
			type: 'line',
			attributes: {
				x1: '1',
				y1: '14',
				x2: '19',
				y2: '14',
				stroke: '#000000',
				'stroke-linecap': 'round',
				'stroke-linejoin': 'round',
			},
		};
		const circle1 = {
			type: 'circle',
			attributes: {
				cx: '7',
				cy: '6',
				r: '3',
				fill: 'none',
				stroke: 'currentColor',
			},
		};
		const circle2 = {
			type: 'circle',
			attributes: {
				cx: '13',
				cy: '14',
				r: '3',
				fill: 'none',
				stroke: 'currentColor',
			},
		};
		const path = [{ ...line1 }, { ...line2 }, { ...circle1 }, { ...circle2 }];

		const otherProps = {
			'stroke-width': '1.25',
			fill: 'none',
			xmlns: 'http://www.w3.org/2000/svg',
		};
		const props = {
			color: '#ff0000',
			className: 'active',
			width: '23',
			height: '19',
			viewBox: '0 0 20 20',
			style: {
				transition: `transform .4s cubic-bezier(.11,.44,.03,1)`,
				'&.active': {
					'& circle:nth-child(3)': {
						transform: `translate(6px)`,
					},
					'& circle:nth-child(4)': {
						transform: `translate(-6px)`,
					},
				},
			},
			...otherProps,
		};

		const rendered = render(<Icon path={path} {...props} />);

		expect.assertions(
			Object.keys(line1.attributes).length +
				Object.keys(line2.attributes).length +
				Object.keys(circle1.attributes).length +
				Object.keys(circle2.attributes).length +
				Object.keys(otherProps).length +
				13
		);

		const svgLine1 = rendered.container.querySelector(`svg ${line1.type}:nth-of-type(1)`)!;
		expect(svgLine1).toBeInTheDocument();
		Object.keys(line1.attributes).forEach((key) => {
			expect(svgLine1).toHaveAttribute(key, line1.attributes[key as keyof typeof line1.attributes]);
		});

		const svgLine2 = rendered.container.querySelector(`svg ${line2.type}:nth-of-type(2)`)!;
		expect(svgLine2).toBeInTheDocument();
		Object.keys(line2.attributes).forEach((key) => {
			expect(svgLine2).toHaveAttribute(key, line2.attributes[key as keyof typeof line2.attributes]);
		});

		const svgCircle1 = rendered.container.querySelector(`svg ${circle1.type}:nth-of-type(1)`)!;
		expect(svgCircle1).toBeInTheDocument();
		Object.keys(circle1.attributes).forEach((key) => {
			expect(svgCircle1).toHaveAttribute(key, circle1.attributes[key as keyof typeof circle1.attributes]);
		});

		const svgCircle2 = rendered.container.querySelector(`svg ${circle2.type}:nth-of-type(2)`)!;
		expect(svgCircle2).toBeInTheDocument();
		Object.keys(circle2.attributes).forEach((key) => {
			expect(svgCircle2).toHaveAttribute(key, circle2.attributes[key as keyof typeof circle2.attributes]);
		});

		const svg = rendered.container.querySelector(`svg`)!;
		expect(svg).toBeInTheDocument();

		// svg attributes that aren't props to be added on the root element
		Object.keys(otherProps).forEach((key) => {
			expect(svg).toHaveAttribute(key, otherProps[key as keyof typeof otherProps]);
		});

		// props
		expect(svg).toHaveAttribute('viewBox', props.viewBox);
		const styles = getComputedStyle(svg);
		expect(styles.width).toBe(`${props.width}px`);
		expect(styles.height).toBe(`${props.height}px`);
		expect(styles.fill).toBe(props.color);

		// custom style script
		expect(styles.transition).toBe(props.style.transition);
		expect(svg).toHaveClass(props.className);
		const circle1Styles = getComputedStyle(svgCircle1);
		expect(circle1Styles.transform).toBe(props.style['&.active']['& circle:nth-child(3)'].transform);
		const circle2Styles = getComputedStyle(svgCircle2);
		expect(circle2Styles.transform).toBe(props.style['&.active']['& circle:nth-child(4)'].transform);
	});

	it('renders children elements', () => {
		const lineAttributes = {
			x1: '1',
			y1: '6',
			x2: '19',
			y2: '6',
			stroke: '#000000',
			'stroke-linecap': 'round',
			'stroke-linejoin': 'round',
		};

		const cicleAttributes = {
			cx: '7',
			cy: '6',
			r: '3',
			fill: 'none',
			stroke: 'currentColor',
		};

		expect.assertions(Object.keys(lineAttributes).length + Object.keys(cicleAttributes).length + 2);

		const rendered = render(
			<Icon>
				<line {...lineAttributes}></line>
				<circle {...cicleAttributes}></circle>
			</Icon>
		);

		const svgLine = rendered.container.querySelector('svg line')!;
		expect(svgLine).toBeInTheDocument();

		Object.keys(lineAttributes).forEach((key) => {
			expect(svgLine).toHaveAttribute(key, lineAttributes[key as keyof typeof lineAttributes]);
		});

		const svgCicle = rendered.container.querySelector('svg circle')!;
		expect(svgCicle).toBeInTheDocument();

		Object.keys(cicleAttributes).forEach((key) => {
			expect(svgCicle).toHaveAttribute(key, cicleAttributes[key as keyof typeof cicleAttributes]);
		});
	});

	it('can disable styles', () => {
		const icon = 'cog';
		const color = '#3a23ad';
		const size = '40px';

		const rendered = render(<Icon disableStyles icon={icon} color={color} size={size} />);
		expect(rendered.container).toBeInTheDocument();

		const svg = rendered.container.querySelector('svg');
		expect(svg).toHaveClass('ss__icon');

		expect(svg).toHaveAttribute('width', size);
		expect(svg).toHaveAttribute('height', size);

		const path = svg?.querySelector('path');
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

		const iconElement = rendered.container.querySelector('.ss__icon');
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

		const iconElement = rendered.container.querySelector('.ss__icon');
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

		const iconElement = rendered.container.querySelector('.ss__icon');
		expect(iconElement).toHaveClass(propTheme.components.icon.className);
		expect(iconElement).not.toHaveClass(globalTheme.components.icon.className);
	});
});
