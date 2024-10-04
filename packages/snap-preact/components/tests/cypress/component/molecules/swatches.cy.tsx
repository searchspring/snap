import { Swatches } from '../../../../src/components/Molecules/Swatches';
import { mount } from '@cypress/react';
import { ThemeProvider } from '../../../../src/providers';

const theme = {
	components: {
		swatches: {
			className: 'classy',
		},
	},
};

const options = [
	{ value: 'Red', label: 'Red', disabled: false },
	{ value: 'Blue', label: 'Blue', disabled: false },
	{ value: 'Green', label: 'Green', disabled: false },
	{ value: 'Orange', label: 'Orange', disabled: false },
	{ value: 'Tan', label: 'Tan', disabled: false },
	{ value: 'Pink', label: 'Pink', disabled: false },
	{ value: 'Black', label: 'Black', disabled: false },
	{ value: 'White', label: 'White', disabled: false },
];

describe('Swatches Component', async () => {
	describe('carousel swatches', () => {
		it('renders as carousel by default', () => {
			mount(<Swatches options={options} />);
			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__carousel__prev').should('exist');
			cy.get('.ss__carousel__next').should('exist');
			cy.get('.ss__swatches__carousel__swatch').should('have.length', options.length);
		});

		it('renders swatch background colors', () => {
			mount(<Swatches options={options} />);
			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__carousel__prev').should('exist');
			cy.get('.ss__carousel__next').should('exist');
			cy.get('.ss__swatches__carousel__swatch').should('have.length', options.length);

			cy.get('.ss__swatches__carousel__swatch').should('satisfy', ($el) => {
				for (let i = 0; i < $el.length; i++) {
					const backgroundStyle = $el[i].style.background;
					return backgroundStyle == options[i].value.toLowerCase();
				}
			});
		});

		it('renders swatch css gradient background colors', () => {
			const optionsWithGradient = [
				{
					value: 'Rainbow',
					label: 'Rainbow',
					available: true,
					background: `linear-gradient(
                        90deg,
                        rgba(255, 0, 0, 1) 0%,
                        rgba(255, 154, 0, 1) 10%,
                        rgba(208, 222, 33, 1) 20%,
                        rgba(79, 220, 74, 1) 30%,
                        rgba(63, 218, 216, 1) 40%,
                        rgba(47, 201, 226, 1) 50%,
                        rgba(28, 127, 238, 1) 60%,
                        rgba(95, 21, 242, 1) 70%,
                        rgba(186, 12, 248, 1) 80%,
                        rgba(251, 7, 217, 1) 90%,
                        rgba(255, 0, 0, 1) 100%
                    )`,
				},
				{ value: 'Red', label: 'Red', disabled: false },
				{ value: 'Blue', label: 'Blue', disabled: false },
				{ value: 'Green', label: 'Green', disabled: false },
				{ value: 'Orange', label: 'Orange', disabled: false },
				{ value: 'Tan', label: 'Tan', disabled: false },
				{ value: 'Pink', label: 'Pink', disabled: false },
				{ value: 'Black', label: 'Black', disabled: false },
				{ value: 'White', label: 'White', disabled: false },
			];

			mount(<Swatches options={optionsWithGradient} />);
			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__carousel__prev').should('exist');
			cy.get('.ss__carousel__next').should('exist');
			cy.get('.ss__swatches__carousel__swatch').should('have.length', optionsWithGradient.length);

			cy.get('.ss__swatches__carousel__swatch:first').should('satisfy', ($el) => {
				const backgroundStyle = $el[0].style.background;
				return backgroundStyle.startsWith('linear-gradient');
			});
		});

		it('renders swatch image background', () => {
			const optionsWithGradient = [
				{
					value: 'red',
					label: 'red',
					available: true,
					backgroundImageUrl: 'https://htmlcolorcodes.com/assets/images/colors/dark-red-color-solid-background-1920x1080.png',
				},
				{ value: 'Blue', label: 'Blue', available: true },
				{ value: 'Green', label: 'Green', available: false },
				{ value: 'Orange', label: 'Orange', available: true },
				{ value: 'Tan', label: 'Tan', available: true },
			];

			mount(<Swatches options={optionsWithGradient} />);
			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__carousel__prev').should('exist');
			cy.get('.ss__carousel__next').should('exist');
			cy.get('.ss__swatches__carousel__swatch').should('have.length', optionsWithGradient.length);

			cy.get('.ss__swatches__carousel__swatch:first .ss__image').should('exist');
			cy.get('.ss__swatches__carousel__swatch:first .ss__image img').should('have.attr', 'src', optionsWithGradient[0].backgroundImageUrl);
		});

		it('renders without labels when using hideLabels', () => {
			mount(<Swatches options={options} hideLabels={true} />);
			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__carousel__prev').should('exist');
			cy.get('.ss__carousel__next').should('exist');
			cy.get('.ss__swatches__carousel__swatch').should('have.length', options.length);
			cy.get('.ss__swatches__carousel__swatch__value').should('not.exist');
		});

		it('renders as carousel with type', () => {
			mount(<Swatches options={options} type="carousel" />);
			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__carousel__prev').should('exist');
			cy.get('.ss__carousel__next').should('exist');
			cy.get('.ss__swatches__carousel__swatch').should('have.length', options.length);
		});

		it('can pass selected option', () => {
			mount(<Swatches options={options} selected={options[3]} />);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__carousel__prev').should('exist');
			cy.get('.ss__carousel__next').should('exist');
			cy.get('.ss__swatches__carousel__swatch').should('have.length', options.length);
			cy.get('.ss__swatches__carousel__swatch--selected')
				.should('exist')
				.should('satisfy', ($el) => {
					const backgroundStyle = $el[0].style.background;
					return backgroundStyle == options[3].value.toLowerCase();
				});
		});

		it('has custom onClick functions', () => {
			mount(<Swatches onSelect={cy.stub().as('onClickFunc')} options={options} />);
			cy.get('.ss__swatches').should('exist');
			cy.get('@onClickFunc').its('callCount').should('eq', 0);
			cy.get('.ss__swatches__carousel__swatch:first')
				.should('exist')
				.click()
				.then(() => {
					cy.get('@onClickFunc').its('callCount').should('eq', 1);
				});
		});

		it('can disable styling', () => {
			mount(<Swatches options={options} disableStyles={true} />);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__swatches').should('satisfy', ($el) => {
				const classList = Array.from($el[0].classList);
				return classList.length == 1;
			});
		});

		it('renders with classname', () => {
			const className = 'classy';

			mount(<Swatches options={options} className={className} />);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__swatches').should('have.class', className);
		});

		it('is themeable with ThemeProvider', () => {
			mount(
				<ThemeProvider theme={theme}>
					<Swatches options={options} />
				</ThemeProvider>
			);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__swatches').should('have.class', theme.components.swatches.className);
		});

		it('is themeable with theme prop', () => {
			mount(<Swatches options={options} theme={theme} />);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__swatches').should('have.class', theme.components.swatches.className);
		});

		it('is themeable with theme prop overrides ThemeProvider', () => {
			const themeOverride = {
				components: {
					swatches: {
						className: 'extraClassy',
					},
				},
			};

			mount(
				<ThemeProvider theme={theme}>
					<Swatches options={options} theme={themeOverride} />
				</ThemeProvider>
			);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__swatches').should('have.class', themeOverride.components.swatches.className);
			cy.get('.ss__swatches').should('not.have.class', theme.components.swatches.className);
		});

		it('breakpoints override theme prop', async () => {
			// Change the viewport to 1200px.
			cy.viewport(1200, 750);

			const componentTheme = {
				components: {
					swatches: {
						className: 'component theme',
					},
				},
			};

			const customBreakpoints = {
				0: {
					theme: {
						components: {
							swatches: {
								className: 'mobile',
							},
						},
					},
				},
				700: {
					hideButtons: false,
					theme: {
						components: {
							swatches: {
								className: 'tablet',
							},
						},
					},
				},
			};

			mount(<Swatches options={options} breakpoints={customBreakpoints} theme={componentTheme} />);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__swatches').should('have.class', customBreakpoints[700].theme.components.swatches.className);
			cy.get('.ss__swatches').should('not.have.class', customBreakpoints[0].theme.components.swatches.className);
			cy.get('.ss__swatches').should('not.have.class', componentTheme.components.swatches.className);

			// Change the viewport to 500px.
			cy.viewport(500, 750);

			cy.get('.ss__swatches').should('have.class', customBreakpoints[0].theme.components.swatches.className);
			cy.get('.ss__swatches').should('not.have.class', customBreakpoints[700].theme.components.swatches.className);
			cy.get('.ss__swatches').should('not.have.class', componentTheme.components.swatches.className);

			// reset the viewport to 1200px.
			cy.viewport(1200, 750);
		});
	});

	describe('grid swatches', () => {
		const defaultColumns = 6;

		it('renders as grid with type', () => {
			mount(<Swatches options={options} type="grid" />);
			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__carousel__prev').should('not.exist');
			cy.get('.ss__carousel__next').should('not.exist');
			cy.get('.ss__swatches__grid').should('exist');
			cy.get('.ss__grid__option').should('exist');
		});

		it('renders swatch background colors', () => {
			mount(<Swatches type="grid" options={options} />);
			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__carousel__prev').should('not.exist');
			cy.get('.ss__carousel__next').should('not.exist');
			cy.get('.ss__swatches__grid').should('exist');
			cy.get('.ss__grid__option').should('have.length', defaultColumns);

			cy.get('.ss__grid__option').should('satisfy', ($el) => {
				for (let i = 0; i < $el.length; i++) {
					const backgroundStyle = $el[i].style.background;
					return backgroundStyle == options[i].value.toLowerCase();
				}
			});
		});

		it('renders without labels when using hideLabels', () => {
			mount(<Swatches type="grid" options={options} hideLabels={true} />);
			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__carousel__prev').should('not.exist');
			cy.get('.ss__carousel__next').should('not.exist');
			cy.get('.ss__swatches__grid').should('exist');
			cy.get('.ss__grid__option').should('have.length', defaultColumns);
			cy.get('.ss__grid__option__label').should('not.exist');
		});

		it('can pass selected option', () => {
			mount(<Swatches type="grid" options={options} selected={options[3]} />);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__carousel__prev').should('not.exist');
			cy.get('.ss__carousel__next').should('not.exist');
			cy.get('.ss__swatches__grid').should('exist');
			cy.get('.ss__grid__option').should('have.length', defaultColumns);
			cy.get('.ss__grid__option--selected')
				.should('exist')
				.should('satisfy', ($el) => {
					const backgroundStyle = $el[0].style.background;
					return backgroundStyle == options[3].value.toLowerCase();
				});
		});

		it('has custom onClick functions', () => {
			mount(<Swatches type="grid" onSelect={cy.stub().as('onClickFunc')} options={options} />);
			cy.get('.ss__swatches').should('exist');
			cy.get('@onClickFunc').its('callCount').should('eq', 0);
			cy.get('.ss__grid__option:first')
				.should('exist')
				.click()
				.then(() => {
					cy.get('@onClickFunc').its('callCount').should('eq', 1);
				});
		});

		it('can disable styling', () => {
			mount(<Swatches type="grid" options={options} disableStyles={true} />);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__swatches').should('satisfy', ($el) => {
				const classList = Array.from($el[0].classList);
				return classList.length == 1;
			});
		});

		it('renders with classname', () => {
			const className = 'classy';

			mount(<Swatches type="grid" options={options} className={className} />);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__swatches').should('have.class', className);
		});

		it('is themeable with ThemeProvider', () => {
			mount(
				<ThemeProvider theme={theme}>
					<Swatches type="grid" options={options} />
				</ThemeProvider>
			);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__swatches').should('have.class', theme.components.swatches.className);
		});

		it('is themeable with theme prop', () => {
			mount(<Swatches type="grid" options={options} theme={theme} />);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__swatches').should('have.class', theme.components.swatches.className);
		});

		it('is themeable with theme prop overrides ThemeProvider', () => {
			const themeOverride = {
				components: {
					swatches: {
						className: 'extraClassy',
					},
				},
			};

			mount(
				<ThemeProvider theme={theme}>
					<Swatches type="grid" options={options} theme={themeOverride} />
				</ThemeProvider>
			);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__swatches').should('have.class', themeOverride.components.swatches.className);
			cy.get('.ss__swatches').should('not.have.class', theme.components.swatches.className);
		});

		it('breakpoints override theme prop', async () => {
			// Change the viewport to 1200px.
			cy.viewport(1200, 750);

			const componentTheme = {
				components: {
					swatches: {
						className: 'component theme',
					},
				},
			};

			const customBreakpoints = {
				0: {
					theme: {
						components: {
							swatches: {
								className: 'mobile',
							},
						},
					},
				},
				700: {
					hideButtons: false,
					theme: {
						components: {
							swatches: {
								className: 'tablet',
							},
						},
					},
				},
			};

			mount(<Swatches type="grid" options={options} breakpoints={customBreakpoints} theme={componentTheme} />);

			cy.get('.ss__swatches').should('exist');
			cy.get('.ss__swatches').should('have.class', customBreakpoints[700].theme.components.swatches.className);
			cy.get('.ss__swatches').should('not.have.class', customBreakpoints[0].theme.components.swatches.className);
			cy.get('.ss__swatches').should('not.have.class', componentTheme.components.swatches.className);

			// Change the viewport to 500px.
			cy.viewport(500, 750);

			cy.get('.ss__swatches').should('have.class', customBreakpoints[0].theme.components.swatches.className);
			cy.get('.ss__swatches').should('not.have.class', customBreakpoints[700].theme.components.swatches.className);
			cy.get('.ss__swatches').should('not.have.class', componentTheme.components.swatches.className);

			// reset the viewport to 1200px.
			cy.viewport(1200, 750);
		});
	});
});
