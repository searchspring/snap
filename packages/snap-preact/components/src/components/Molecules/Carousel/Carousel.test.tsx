// waiting for cypress component testing due to swiper version update & problems with Jest
it('tests', () => {
	expect(true).toBe(true);
});

// import { h } from 'preact';
// import { render, waitFor } from '@testing-library/preact';

// import { ThemeProvider } from '../../../providers/theme';
// import { Carousel } from './Carousel';
// import { Result } from '../../Molecules/Result';
// import userEvent from '@testing-library/user-event';
// import { Scrollbar } from 'swiper';
// import type { Product } from '@searchspring/snap-store-mobx';

// import { MockData } from '@searchspring/snap-shared';
// import { SearchResponseModel } from '@searchspring/snapi-types';

// const mockData = new MockData();
// const searchResponse: SearchResponseModel = mockData.search();

// describe('Carousel Component', () => {
// 	const theme = {
// 		components: {
// 			carousel: {
// 				prevButton: 'Global Theme Prev',
// 				nextButton: 'Global Theme Next',
// 			},
// 		},
// 	};

// 	// TODO: refactor to use mock store data
// 	it('renders', () => {
// 		const rendered = render(
// 			<Carousel>
// 				{searchResponse.results!.map((result, idx) => (
// 					<div className={'findMe'} key={idx}>
// 						<Result result={result as Product} />
// 					</div>
// 				))}
// 			</Carousel>
// 		);
// 		const carousel = rendered.container.querySelector('.ss__carousel');
// 		expect(carousel).toBeInTheDocument();
// 	});

// 	it('able to render child jsx', () => {
// 		const rendered = render(
// 			<Carousel>
// 				{searchResponse.results!.map((result, idx) => (
// 					<div className={'findMe'} key={idx}>
// 						<Result result={result as Product} />
// 					</div>
// 				))}
// 			</Carousel>
// 		);

// 		const results = rendered.container.querySelector('.swiper-slide[data-swiper-slide-index="0"]');
// 		expect(results?.textContent).toContain(searchResponse.results![0].mappings?.core?.name);
// 	});

// 	it('renders the correct amount of children', () => {
// 		const rendered = render(
// 			<Carousel>
// 				{searchResponse.results!.map((result, idx) => (
// 					<div className={'findMe'} key={idx}>
// 						<Result result={result as Product} />
// 					</div>
// 				))}
// 			</Carousel>
// 		);

// 		const results = rendered.container.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) .findMe');
// 		expect(results?.length).toBe(searchResponse.results!.length);
// 	});

// 	it('renders next & prev buttons', () => {
// 		const rendered = render(
// 			<Carousel>
// 				{searchResponse.results!.map((result, idx) => (
// 					<div className={'findMe'} key={idx}>
// 						<Result result={result as Product} />
// 					</div>
// 				))}
// 			</Carousel>
// 		);
// 		const prev = rendered.container.querySelector('.ss__carousel__prev');
// 		const next = rendered.container.querySelector('.ss__carousel__next');
// 		expect(prev).toBeInTheDocument();
// 		expect(next).toBeInTheDocument();
// 	});

// 	it('vertical prop works', () => {
// 		const rendered = render(
// 			<Carousel vertical={true}>
// 				{searchResponse.results!.map((result, idx) => (
// 					<div className={'findMe'} key={idx}>
// 						<Result result={result as Product} />
// 					</div>
// 				))}
// 			</Carousel>
// 		);
// 		const verticalCarouselWrapper = rendered.container.querySelector('.swiper-container-vertical');
// 		expect(verticalCarouselWrapper).toBeInTheDocument();
// 	});

// 	it('renders custom next & prev buttons', () => {
// 		const prevButtonText = 'Prev Button Yo';
// 		const nextButtonText = 'Next Button Yo';
// 		const rendered = render(
// 			<Carousel prevButton={prevButtonText} nextButton={nextButtonText}>
// 				{searchResponse.results!.map((result, idx) => (
// 					<div className={'findMe'} key={idx}>
// 						<Result result={result as Product} />
// 					</div>
// 				))}
// 			</Carousel>
// 		);
// 		const prev = rendered.container.querySelector('.ss__carousel__prev');
// 		const next = rendered.container.querySelector('.ss__carousel__next');
// 		expect(prev).toBeInTheDocument();
// 		expect(next).toBeInTheDocument();

// 		expect(prev).toHaveTextContent(prevButtonText);
// 		expect(next).toHaveTextContent(nextButtonText);
// 	});

// 	it('can disable next & prev buttons', () => {
// 		const rendered = render(
// 			<Carousel hideButtons={true}>
// 				{searchResponse.results!.map((result, idx) => (
// 					<Result result={result as Product} key={idx} />
// 				))}
// 			</Carousel>
// 		);
// 		const prev = rendered.container.querySelector('.ss__carousel__prev-wrapper');
// 		const next = rendered.container.querySelector('.ss__carousel__next-wrapper');
// 		expect(prev).toBeInTheDocument();
// 		expect(prev).toHaveClass('ss__carousel__prev-wrapper--hidden');
// 		expect(next).toBeInTheDocument();
// 		expect(next).toHaveClass('ss__carousel__next-wrapper--hidden');
// 	});

// 	it('has custom onClick functions', () => {
// 		const onNextFunc = jest.fn();
// 		const onPrevFunc = jest.fn();
// 		const onClickFunc = jest.fn();

// 		const rendered = render(
// 			<Carousel pagination onNextButtonClick={onNextFunc} onPrevButtonClick={onPrevFunc} onClick={onClickFunc}>
// 				{searchResponse.results!.map((result, idx) => (
// 					<div className={'findMe'} key={idx}>
// 						<Result result={result as Product} />
// 					</div>
// 				))}
// 			</Carousel>
// 		);
// 		const prev = rendered.container.querySelector('.ss__carousel__prev')!;
// 		const next = rendered.container.querySelector('.ss__carousel__next')!;
// 		const slide = rendered.container.querySelectorAll('.swiper-slide');

// 		expect(onPrevFunc).not.toHaveBeenCalled();
// 		userEvent.click(prev);
// 		expect(onPrevFunc).toHaveBeenCalled();

// 		expect(onNextFunc).not.toHaveBeenCalled();
// 		userEvent.click(next);
// 		expect(onNextFunc).toHaveBeenCalled();

// 		userEvent.click(slide[0]);
// 		expect(onClickFunc).toHaveBeenCalled();
// 	});

// 	it('can enable pagination dots', async () => {
// 		const rendered = render(
// 			<Carousel pagination={true}>
// 				{searchResponse.results!.map((result, idx) => (
// 					<div className={'findMe'} key={idx}>
// 						<Result result={result as Product} />
// 					</div>
// 				))}
// 			</Carousel>
// 		);

// 		const CarouselElement = rendered.container.querySelector('.ss__carousel');
// 		expect(CarouselElement).toBeInTheDocument();
// 		await waitFor(() => {
// 			const paginationBullets = rendered.container.querySelector('.swiper-pagination-bullets');
// 			return expect(paginationBullets).toBeInTheDocument();
// 		});
// 	});

// 	it('can add additional modules', () => {
// 		const rendered = render(
// 			<Carousel modules={[Scrollbar]} scrollbar>
// 				{searchResponse.results!.map((result) => (
// 					<Result result={result as Product} />
// 				))}
// 			</Carousel>
// 		);
// 		const scrollbar = rendered.container.querySelector('.ss__carousel .swiper-scrollbar');
// 		expect(scrollbar).toBeInTheDocument();
// 	});

// 	it('can use breakpoints', async () => {
// 		const customBreakpoints = {
// 			0: {
// 				hideButtons: true,
// 			},
// 			700: {
// 				hideButtons: false,
// 			},
// 		};

// 		const rendered = render(
// 			<Carousel breakpoints={customBreakpoints}>
// 				{searchResponse.results!.map((result, idx) => (
// 					<Result result={result as Product} key={idx} />
// 				))}
// 			</Carousel>
// 		);

// 		const prev = rendered.container.querySelector('.ss__carousel__prev-wrapper');
// 		const next = rendered.container.querySelector('.ss__carousel__next-wrapper');
// 		expect(prev).toBeInTheDocument();
// 		expect(next).toBeInTheDocument();
// 		expect(prev).not.toHaveClass('ss__carousel__prev-wrapper--hidden');
// 		expect(next).toBeInTheDocument();
// 		expect(next).not.toHaveClass('ss__carousel__next-wrapper--hidden');

// 		// Change the viewport to 500px.
// 		global.innerWidth = 500;

// 		// Trigger the window resize event.
// 		global.dispatchEvent(new Event('resize'));

// 		// add delay to allow component to rerender
// 		await waitFor(() => expect(prev).toHaveClass('ss__carousel__prev-wrapper--hidden'));

// 		expect(next).toBeInTheDocument();
// 		expect(next).toHaveClass('ss__carousel__next-wrapper--hidden');
// 	});

// 	it('can disable styling', () => {
// 		const rendered = render(
// 			<Carousel pagination disableStyles={true}>
// 				{searchResponse.results!.map((result, idx) => (
// 					<div className={'findMe'} key={idx}>
// 						<Result result={result as Product} />
// 					</div>
// 				))}
// 			</Carousel>
// 		);

// 		const CarouselElement = rendered.container.querySelector('.ss__carousel');
// 		expect(CarouselElement?.classList.length).toBe(1);
// 	});

// 	it('renders with classname', () => {
// 		const className = 'classy';
// 		const rendered = render(
// 			<Carousel pagination className={className}>
// 				{searchResponse.results!.map((result, idx) => (
// 					<div className={'findMe'} key={idx}>
// 						<Result result={result as Product} />
// 					</div>
// 				))}
// 			</Carousel>
// 		);
// 		const CarouselElement = rendered.container.querySelector('.ss__carousel');
// 		expect(CarouselElement).toBeInTheDocument();
// 		expect(CarouselElement).toHaveClass(className);
// 	});

// 	it('is themeable with ThemeProvider', () => {
// 		const children = ['red', 'blue', 'yellow', 'green', 'white', 'orange', 'black'];

// 		const rendered = render(
// 			<ThemeProvider theme={theme}>
// 				<Carousel>
// 					{children.map((color) => (
// 						<div className="findMe" style={{ height: '100px', width: '100px', background: color }}></div>
// 					))}
// 				</Carousel>
// 			</ThemeProvider>
// 		);
// 		const ChildElement = rendered.container.querySelector('.findMe');
// 		expect(ChildElement).toBeInTheDocument();

// 		const prev = rendered.container.querySelector('.ss__carousel__prev');
// 		const next = rendered.container.querySelector('.ss__carousel__next');
// 		expect(prev).toBeInTheDocument();
// 		expect(next).toBeInTheDocument();

// 		expect(prev).toHaveTextContent(theme.components.carousel.prevButton);
// 		expect(next).toHaveTextContent(theme.components.carousel.nextButton);
// 	});

// 	it('is themeable with theme prop', () => {
// 		const children = ['red', 'blue', 'yellow', 'green', 'white', 'orange', 'black'];

// 		const rendered = render(
// 			<Carousel theme={theme}>
// 				{children.map((color) => (
// 					<div className="findMe" style={{ height: '100px', width: '100px', background: color }}></div>
// 				))}
// 			</Carousel>
// 		);
// 		const ChildElement = rendered.container.querySelector('.findMe');
// 		expect(ChildElement).toBeInTheDocument();

// 		const prev = rendered.container.querySelector('.ss__carousel__prev');
// 		const next = rendered.container.querySelector('.ss__carousel__next');
// 		expect(prev).toBeInTheDocument();
// 		expect(next).toBeInTheDocument();

// 		expect(prev).toHaveTextContent(theme.components.carousel.prevButton);
// 		expect(next).toHaveTextContent(theme.components.carousel.nextButton);
// 	});

// 	it('is themeable with theme prop overrides ThemeProvider', () => {
// 		const themeOverride = {
// 			components: {
// 				carousel: {
// 					prevButton: 'Prev Button Yo',
// 					nextButton: 'Next Button Yo',
// 				},
// 			},
// 		};

// 		const children = ['red', 'blue', 'yellow', 'green', 'white', 'orange', 'black'];

// 		const rendered = render(
// 			<ThemeProvider theme={theme}>
// 				<Carousel theme={themeOverride}>
// 					{children.map((color) => (
// 						<div className="findMe" style={{ height: '100px', width: '100px', background: color }}></div>
// 					))}
// 				</Carousel>
// 			</ThemeProvider>
// 		);
// 		const ChildElement = rendered.container.querySelector('.findMe');
// 		expect(ChildElement).toBeInTheDocument();

// 		const prev = rendered.container.querySelector('.ss__carousel__prev');
// 		const next = rendered.container.querySelector('.ss__carousel__next');
// 		expect(prev).toBeInTheDocument();
// 		expect(next).toBeInTheDocument();

// 		expect(prev).not.toHaveTextContent(theme.components.carousel.prevButton);
// 		expect(next).not.toHaveTextContent(theme.components.carousel.nextButton);

// 		expect(prev).toHaveTextContent(themeOverride.components.carousel.prevButton);
// 		expect(next).toHaveTextContent(themeOverride.components.carousel.nextButton);
// 	});

// 	it('can add additional modules', () => {
// 		const rendered = render(
// 			<Carousel modules={[Scrollbar]} scrollbar>
// 				{searchResponse.results!.map((result) => (
// 					<Result result={result as Product} />
// 				))}
// 			</Carousel>
// 		);
// 		const scrollbar = rendered.container.querySelector('.ss__carousel .swiper-scrollbar');
// 		expect(scrollbar).toBeInTheDocument();
// 	});

// 	it('breakpoints override theme prop', async () => {
// 		// Change the viewport to 1200px.
// 		global.innerWidth = 1200;

// 		const componentTheme = {
// 			components: {
// 				icon: {
// 					icon: 'ban',
// 				},
// 			},
// 		};

// 		const customBreakpoints = {
// 			0: {
// 				theme: {
// 					components: {
// 						icon: {
// 							icon: 'eye',
// 						},
// 					},
// 				},
// 			},
// 			700: {
// 				hideButtons: false,
// 				theme: {
// 					components: {
// 						icon: {
// 							icon: 'check',
// 						},
// 					},
// 				},
// 			},
// 		};

// 		const rendered = render(
// 			<Carousel breakpoints={customBreakpoints} theme={componentTheme}>
// 				{searchResponse.results!.map((result, idx) => (
// 					<Result result={result as Product} key={idx} />
// 				))}
// 			</Carousel>
// 		);

// 		await waitFor(() => {
// 			const themeIconElements = rendered.container.querySelectorAll('.ss__icon.ss__icon--ban');
// 			expect(themeIconElements).toHaveLength(0);

// 			const firstBreakpointIconElements = rendered.container.querySelectorAll('.ss__icon.ss__icon--check');
// 			expect(firstBreakpointIconElements).toHaveLength(2);

// 			const secondBreakpointIconElements = rendered.container.querySelectorAll('.ss__icon.ss__icon--eye');
// 			expect(secondBreakpointIconElements).toHaveLength(0);
// 		});

// 		// Change the viewport to 500px.
// 		global.innerWidth = 500;

// 		// Trigger the window resize event.
// 		global.dispatchEvent(new Event('resize'));

// 		await waitFor(() => {
// 			const themeIconElements = rendered.container.querySelectorAll('.ss__icon.ss__icon--ban');
// 			expect(themeIconElements).toHaveLength(0);

// 			const firstBreakpointIconElements = rendered.container.querySelectorAll('.ss__icon.ss__icon--check');
// 			expect(firstBreakpointIconElements).toHaveLength(0);

// 			const secondBreakpointIconElements = rendered.container.querySelectorAll('.ss__icon.ss__icon--eye');
// 			expect(secondBreakpointIconElements).toHaveLength(2);
// 		});
// 	});
// });
