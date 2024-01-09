import 'whatwg-fetch';
import { h } from 'preact';
import { Carousel } from '../../../../src/components/Molecules/Carousel';
import { Scrollbar } from 'swiper';
import { mount } from '@cypress/react';
import { ThemeProvider } from '../../../../src/providers';

const theme = {
	components: {
		carousel: {
			prevButton: 'Global Theme Prev',
			nextButton: 'Global Theme Next',
		},
	},
};

const children = ['red', 'blue', 'yellow', 'green', 'white', 'orange', 'black'];

describe('Carousel Component', async () => {
	it('renders with results', () => {
		mount(
			<Carousel>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);
		cy.get('.ss__carousel').should('exist');
		cy.get('.ss__carousel__prev').should('exist');
		cy.get('.ss__carousel__next').should('exist');
	});

	it('able to render child jsx', () => {
		mount(
			<Carousel>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);

		cy.get('.ss__carousel').should('exist');
		cy.get('.swiper-slide[data-swiper-slide-index="0"]').should('have.text', children[0]);
	});

	it('renders the correct amount of children', () => {
		mount(
			<Carousel>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);

		cy.get('.ss__carousel').should('exist');
		cy.get('.swiper-slide:not(.swiper-slide-duplicate) .findMe').should('have.length', children.length);
	});

	it('renders next & prev buttons', () => {
		mount(
			<Carousel>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);

		cy.get('.ss__carousel').should('exist');
		cy.get('.ss__carousel__prev').should('exist');
		cy.get('.ss__carousel__next').should('exist');
	});

	it('vertical prop works', () => {
		mount(
			<Carousel vertical={true}>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);
		cy.get('.ss__carousel-vertical').should('exist');
	});

	it('renders custom next & prev buttons', () => {
		const prevButtonText = 'Prev Button Yo';
		const nextButtonText = 'Next Button Yo';

		mount(
			<Carousel prevButton={prevButtonText} nextButton={nextButtonText}>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);

		cy.get('.ss__carousel__prev').should('exist').should('have.text', prevButtonText);
		cy.get('.ss__carousel__next').should('exist').should('have.text', nextButtonText);
	});

	it('can disable next & prev buttons', () => {
		mount(
			<Carousel hideButtons={true}>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);

		cy.get('.ss__carousel__prev-wrapper').should('exist').should('have.class', 'ss__carousel__prev-wrapper--hidden');
		cy.get('.ss__carousel__next-wrapper').should('exist').should('have.class', 'ss__carousel__next-wrapper--hidden');
	});

	it('has custom onClick functions', () => {
		mount(
			<Carousel
				pagination
				onNextButtonClick={cy.stub().as('onNextFunc')}
				onPrevButtonClick={cy.stub().as('onPrevFunc')}
				onClick={cy.stub().as('onClickFunc')}
			>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);
		cy.get('.ss__carousel').should('exist');
		cy.get('@onPrevFunc').its('callCount').should('eq', 0);
		cy.get('.ss__carousel__prev')
			.should('exist')
			.click()
			.then(() => {
				cy.get('@onPrevFunc').its('callCount').should('eq', 1);
			});

		cy.get('@onNextFunc').its('callCount').should('eq', 0);
		cy.get('.ss__carousel__next')
			.should('exist')
			.click()
			.then(() => {
				cy.get('@onNextFunc').its('callCount').should('eq', 1);
			});

		cy.get('.swiper-slide:first')
			.should('exist')
			.click()
			.then(() => {
				cy.get('@onClickFunc').its('callCount').should('eq', 1);
			});
	});

	it('can enable pagination dots', () => {
		mount(
			<Carousel pagination={true}>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);

		cy.get('.ss__carousel').should('exist');
		cy.get('.swiper-pagination-bullets').should('exist');
	});

	it('can add additional modules', () => {
		mount(
			<Carousel modules={[Scrollbar]} scrollbar>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);
		cy.get('.ss__carousel .swiper-scrollbar').should('exist');
	});

	it('can use breakpoints', () => {
		// Change the viewport to 1200px.
		cy.viewport(1200, 750);

		const customBreakpoints = {
			0: {
				hideButtons: true,
			},
			700: {
				hideButtons: false,
			},
		};

		mount(
			<Carousel breakpoints={customBreakpoints}>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);

		cy.get('.ss__carousel__prev-wrapper').should('exist').should('not.have.class', 'ss__carousel__prev-wrapper--hidden');
		cy.get('.ss__carousel__next-wrapper').should('exist').should('not.have.class', 'ss__carousel__next-wrapper--hidden');

		// Change the viewport to 500px.
		cy.viewport(500, 750).then(() => {
			cy.get('.ss__carousel__prev-wrapper').should('exist').should('have.class', 'ss__carousel__prev-wrapper--hidden');
			cy.get('.ss__carousel__next-wrapper').should('exist').should('have.class', 'ss__carousel__next-wrapper--hidden');
		});

		// reset the viewport to 1200px.
		cy.viewport(1200, 750);
	});

	it('can disable styling', () => {
		mount(
			<Carousel disableStyles={true}>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);

		cy.get('.ss__carousel').should('exist');
		cy.get('.ss__carousel').should('satisfy', ($el) => {
			const classList = Array.from($el[0].classList);
			return classList.length == 1;
		});
	});

	it('renders with classname', () => {
		const className = 'classy';

		mount(
			<Carousel className={className}>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);

		cy.get('.ss__carousel').should('exist');
		cy.get('.ss__carousel').should('have.class', className);
	});

	it('is themeable with ThemeProvider', () => {
		mount(
			<ThemeProvider theme={theme}>
				<Carousel>
					{children.map((child, idx) => (
						<div className={'findMe'} key={idx}>
							{child}
						</div>
					))}
				</Carousel>
			</ThemeProvider>
		);

		cy.get('.ss__carousel').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', theme.components.carousel.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', theme.components.carousel.nextButton);
	});

	it('is themeable with theme prop', () => {
		mount(
			<Carousel theme={theme}>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);

		cy.get('.ss__carousel').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', theme.components.carousel.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', theme.components.carousel.nextButton);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const themeOverride = {
			components: {
				carousel: {
					prevButton: 'Prev Button Yo',
					nextButton: 'Next Button Yo',
				},
			},
		};

		mount(
			<ThemeProvider theme={theme}>
				<Carousel theme={themeOverride}>
					{children.map((child, idx) => (
						<div className={'findMe'} key={idx}>
							{child}
						</div>
					))}
				</Carousel>
			</ThemeProvider>
		);

		cy.get('.ss__carousel').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', themeOverride.components.carousel.prevButton);
		prev.should('not.have.text', theme.components.carousel.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', themeOverride.components.carousel.nextButton);
		next.should('not.have.text', theme.components.carousel.nextButton);
	});

	it('breakpoints override theme prop', async () => {
		// Change the viewport to 1200px.
		cy.viewport(1200, 750);

		const componentTheme = {
			components: {
				icon: {
					icon: 'ban',
				},
			},
		};

		const customBreakpoints = {
			0: {
				theme: {
					components: {
						icon: {
							icon: 'eye',
						},
					},
				},
			},
			700: {
				hideButtons: false,
				theme: {
					components: {
						icon: {
							icon: 'check',
						},
					},
				},
			},
		};

		mount(
			<Carousel breakpoints={customBreakpoints} theme={componentTheme}>
				{children.map((child, idx) => (
					<div className={'findMe'} key={idx}>
						{child}
					</div>
				))}
			</Carousel>
		);

		cy.get('.ss__icon.ss__icon--ban').should('have.length', 0);
		cy.get('.ss__icon.ss__icon--check').should('have.length', 2);
		cy.get('.ss__icon.ss__icon--eye').should('have.length', 0);

		// Change the viewport to 500px.
		cy.viewport(500, 750);

		cy.get('.ss__icon.ss__icon--ban').should('have.length', 0);
		cy.get('.ss__icon.ss__icon--check').should('have.length', 0);
		cy.get('.ss__icon.ss__icon--eye').should('have.length', 2);

		// reset the viewport to 1200px.
		cy.viewport(1200, 750);
	});
});
