import { h } from 'preact';
import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';
import { NoResults } from '../NoResults';

describe('NoResults  Component', () => {
	it('renders', () => {
		const rendered = render(<NoResults />);
		const element = rendered.container.querySelector('.ss__no-results');
		expect(element).toBeInTheDocument();
	});

	it('renders jsx with custom static slot', () => {
		const slot = <div className="findMe">custom</div>;
		const rendered = render(<NoResults contentSlot={slot} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const slotElem = rendered.container.querySelector('.findMe');
		expect(element).toBeInTheDocument();
		expect(slotElem).toBeInTheDocument();
	});

	it('renders string with custom static slot', () => {
		const slot = 'findMe';
		const rendered = render(<NoResults contentSlot={slot} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const slotElem = rendered.container.querySelector('.ss__no-results__slot');
		expect(element).toBeInTheDocument();
		expect(slotElem).toBeInTheDocument();
		expect(slotElem?.innerHTML).toBe(slot);
	});

	it('renders string with HTML with custom static slot', () => {
		const slot = `<div class="findMe">custom</div>`;
		const rendered = render(<NoResults contentSlot={slot} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const slotElem = rendered.container.querySelector('.ss__no-results__slot');
		expect(element).toBeInTheDocument();
		expect(slotElem).toBeInTheDocument();
		expect(slotElem?.innerHTML).toBe(slot);
	});

	it('renders with custom suggestionsList', () => {
		const suggestions = ['suggestion1', 'suggestion2', 'suggestion3', 'suggestion4'];

		const rendered = render(<NoResults suggestionsList={suggestions} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const suggestionElems = rendered.container.querySelectorAll('.ss__no-results__suggestions__list__option');
		expect(element).toBeInTheDocument();
		expect(suggestionElems).toHaveLength(suggestions.length);
		suggestionElems.forEach((elem, idx) => expect(elem.innerHTML).toBe(suggestions[idx]));
	});

	it('renders with custom contactsList', () => {
		const contacts = [
			{
				title: 'contact1',
				content: 'content1',
			},
			{
				title: 'contact2',
				content: 'content2',
			},
			{
				title: 'contact3',
				content: 'content3',
			},
			{
				title: 'contact4',
				content: 'content4',
			},
			{
				title: 'contact5',
				content: 'content5',
			},
		];

		const rendered = render(<NoResults contactsList={contacts} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const contactElems = rendered.container.querySelectorAll('.ss__no-results__contact__detail');
		expect(element).toBeInTheDocument();
		expect(contactElems).toHaveLength(contacts.length);
		contactElems.forEach((elem, idx) => {
			expect(elem).toContainHTML(
				`<div class="ss__no-results__contact__detail ss__no-results__contact__detail--${contacts[idx].title}"><h4 class="ss__no-results__contact__detail__title">${contacts[idx].title}</h4><p class="ss__no-results__contact__detail__content">${contacts[idx].content}</p></div>`
			);
		});
	});

	it('renders expected defaults', () => {
		const rendered = render(<NoResults />);

		const element = rendered.container.querySelector('.ss__no-results');
		const suggestionTitle = rendered.container.querySelector('.ss__no-results__suggestions__title');
		const suggestionsList = rendered.container.querySelectorAll('.ss__no-results__suggestions__list__option');
		const contactsTitle = rendered.container.querySelector('.ss__no-results__contact__title');
		const contactList = rendered.container.querySelectorAll('.ss__no-results__contact__detail');

		expect(element).toBeInTheDocument();
		expect(suggestionTitle?.innerHTML).toBe('Suggestions');
		expect(suggestionsList).toHaveLength(3);
		expect(contactsTitle?.innerHTML).toBe('Still can\'t find what you\'re looking for? <a href="/contact-us">Contact us</a>.');
		expect(contactList).toHaveLength(4);
	});

	it('can change the suggestion title', () => {
		const title = 'title';
		const rendered = render(<NoResults suggestionsTitleText={title} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const suggestionTitle = rendered.container.querySelector('.ss__no-results__suggestions__title');

		expect(element).toBeInTheDocument();
		expect(suggestionTitle?.innerHTML).toBe(title);
	});

	it('can change the contact title', () => {
		const title = 'title';
		const rendered = render(<NoResults contactsTitleText={title} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const contactsTitle = rendered.container.querySelector('.ss__no-results__contact__title');

		expect(element).toBeInTheDocument();
		expect(contactsTitle?.innerHTML).toBe(title);
	});

	it('can hide the contact section', () => {
		const rendered = render(<NoResults hideContact={true} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const contactsElem = rendered.container.querySelector('.ss__no-results__contact');

		expect(element).toBeInTheDocument();
		expect(contactsElem).not.toBeInTheDocument();
	});

	it('can hide the suggestions section', () => {
		const rendered = render(<NoResults hideSuggestions={true} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const suggestionElem = rendered.container.querySelector('.ss__no-results__suggestions');

		expect(element).toBeInTheDocument();
		expect(suggestionElem).not.toBeInTheDocument();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<NoResults className={className} />);

		const element = rendered.container.querySelector('.ss__no-results');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};
		const rendered = render(<NoResults style={style} />);

		const element = rendered.container.querySelector('.ss__no-results');
		const styles = getComputedStyle(element!);

		expect(styles.padding).toBe(style.padding);
	});

	it('can disable styles', () => {
		const rendered = render(<NoResults disableStyles />);

		const element = rendered.container.querySelector('.ss__no-results');

		expect(element?.classList).toHaveLength(1);
	});

	describe('NoResults lang works', () => {
		const selector = '.ss__no-results';

		it('immediately available lang options', async () => {
			const langOptions = ['suggestionsTitleText', 'contactsTitleText', 'contactsList', 'suggestionsList'];

			//text attributes/values
			const value = 'custom value';
			const altText = 'custom alt';
			const ariaLabel = 'custom label';
			const ariaValueText = 'custom value text';
			const title = 'custom title';

			const valueMock = jest.fn(() => value);
			const altMock = jest.fn(() => altText);
			const labelMock = jest.fn(() => ariaLabel);
			const valueTextMock = jest.fn(() => ariaValueText);
			const titleMock = jest.fn(() => title);

			const langObjs = [
				{
					value: value,
					attributes: {
						alt: altText,
						'aria-label': ariaLabel,
						'aria-valuetext': ariaValueText,
						title: title,
					},
				},
				{
					value: valueMock,
					attributes: {
						alt: altMock,
						'aria-label': labelMock,
						'aria-valuetext': valueTextMock,
						title: titleMock,
					},
				},
				{
					value: `<div>${value}</div>`,
					attributes: {
						alt: altText,
						'aria-label': ariaLabel,
						'aria-valuetext': ariaValueText,
						title: title,
					},
				},
			];

			langOptions.forEach((option) => {
				langObjs.forEach((langObj) => {
					const lang = {
						[`${option}`]: langObj,
					};

					// @ts-ignore
					const rendered = render(<NoResults lang={lang} />);

					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();
					const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);

					expect(langElem).toBeInTheDocument();
					if (typeof langObj.value == 'function') {
						expect(valueMock).toHaveBeenLastCalledWith({});
						expect(langElem?.innerHTML).toBe(value);
					} else {
						expect(valueMock).not.toHaveBeenCalled();
						expect(langElem?.innerHTML).toBe(langObj.value);
					}

					expect(langElem).toHaveAttribute('alt', altText);
					expect(langElem).toHaveAttribute('aria-label', ariaLabel);
					expect(langElem).toHaveAttribute('aria-valuetext', ariaValueText);
					expect(langElem).toHaveAttribute('title', title);

					jest.clearAllMocks();
				});
			});
		});
	});
});

describe('NoResult theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				noResults: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<NoResults />
			</ThemeProvider>
		);
		const elem = rendered.container.querySelector('.ss__no-results');
		expect(elem).toHaveClass(globalTheme.components.noResults.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				noResults: {
					className: 'classy',
				},
			},
		};
		const rendered = render(<NoResults theme={propTheme} />);
		const elem = rendered.container.querySelector('.ss__no-results');
		expect(elem).toHaveClass(propTheme.components.noResults.className);
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				noResults: {
					className: 'notclassy',
				},
			},
		};
		const propTheme = {
			components: {
				noResults: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<NoResults theme={propTheme} />
			</ThemeProvider>
		);

		const elem = rendered.container.querySelector('.ss__no-results');
		expect(elem).toHaveClass(propTheme.components.noResults.className);
		expect(elem).not.toHaveClass(globalTheme.components.noResults.className);
	});
});
