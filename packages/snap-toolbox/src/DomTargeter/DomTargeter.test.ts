import { Target } from './DomTargeter';
import { DomTargeter } from './DomTargeter';

import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

import { JSDOM } from 'jsdom';

const wait = (time?: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

let document: Document;

const createDocument = (contents: string) =>
	new JSDOM(`
		<!DOCTYPE html>
		<html>
			<head></head>
			<body>${contents}</body>
		</html>
`).window.document;

describe('DomTargeter', () => {
	it('calls render function with each selected', () => {
		document = createDocument(`
			<div id="content">
				<div class="a">
				</div>
				<div class="b">
					<div class="d">
					</div>
				</div>
				<div class="c">
				</div>
			</div>
		`);

		type CalledTarget = {
			target: Target;
			class: string;
		};

		const calledTargets: Array<CalledTarget> = [];

		const selectors = [
			{
				selector: '#content .a',
				extraValueClassNameTwice: 'aa',
			},
			{
				selector: '.b',
				extraValueClassNameTwice: 'bb',
			},
			{
				selector: '.c',
				extraValueClassNameTwice: 'cc',
			},
			{
				selector: 'body #content .d',
				extraValueClassNameTwice: 'dd',
			},
		];

		new DomTargeter(
			selectors,
			(target: Target, elem: Element) => {
				calledTargets.push({ target, class: elem.className });
				expect(target.extraValueClassNameTwice).toBe(elem.className + elem.className);
			},
			document
		);

		expect(calledTargets.length).toBe(selectors.length);

		calledTargets.forEach((ct) => {
			expect(ct.class).toBe(ct.target.selector.slice(-1));
		});
		expect(document.querySelector('.b')?.firstChild).toBeNull();
		expect(document.querySelector('.d')).toBeNull();
	});

	it('injects elements', () => {
		document = createDocument(`
			<div id="content">
				<div class="a">
				</div>
				<div class="b">
					<div class="d">
						<div id="list-d-1"></div>
						<div id="list-d-2"></div>
						<div id="list-d-3"></div>
					</div>
				</div>
				<div class="c">
					<div id="list-c-1"></div>
					<div id="list-c-2"></div>
					<div id="list-c-3"></div>
				</div>
				<div class="e">
				</div>
				<div class="f">
				</div>
				<div class="g">
				</div>
			</div>
		`);

		const staticElem = document.createElement('input');
		staticElem.className = 'after-2';

		const firstSelector: Target = {
			selector: '#content .a',
			inject: {
				action: 'before',
				element: (target, element) => {
					const div = document.createElement('div');

					div.className = 'before-1';

					expect(element.className).toBe('a');

					div.innerHTML = 'blah';

					return div;
				},
			},
		};

		const selectors: Array<Target> = [
			firstSelector,
			{
				selector: '.b',
				inject: {
					action: 'after',
					element: staticElem,
				},
			},
			{
				selector: '.c',
				extraValueForC: 'the_value',
				inject: {
					action: 'prepend',
					element: (target, element) => {
						const div = document.createElement('div');

						div.className = 'prepend-3';

						expect(element.className).toBe('c');

						expect(target.extraValueForC).toBe('the_value');

						return div;
					},
				},
			},
			{
				selector: 'body #content .d',
				inject: {
					action: 'append',
					element: (target, element) => {
						const div = document.createElement('div');

						div.className = 'append-4';

						expect(element.className).toBe('d');

						return div;
					},
				},
			},
			{
				selector: '.e',
				inject: {
					action: 'prepend',
					element: (target, element) => {
						const div = document.createElement('div');

						div.className = 'prepend-5';

						expect(element.className).toBe('e');

						return div;
					},
				},
			},
			{
				selector: 'body #content .f',
				inject: {
					action: 'append',
					element: (target, element) => {
						const div = document.createElement('div');

						div.className = 'append-6';

						expect(element.className).toBe('f');

						return div;
					},
				},
			},
			{
				selector: '#content .g',
				inject: {
					action: 'replace',
					element: (target, element) => {
						const div = document.createElement('div');
						div.className = 'replaced';
						expect(element.className).toBe('g');
						return div;
					},
				},
			},
		];

		const classNames: Array<string> = [];

		new DomTargeter(
			selectors,
			(target: Target, elem: Element) => {
				classNames.push(elem.className);
			},
			document
		);

		expect(document.querySelector('.a')?.previousElementSibling?.className).toBe('before-1');
		expect(document.querySelector('.b')?.nextElementSibling?.className).toBe('after-2');
		expect(document.querySelector('.c')?.firstElementChild?.className).toBe('prepend-3');
		expect(document.querySelector('.d')?.lastElementChild?.className).toBe('append-4');
		expect(document.querySelector('.e')?.firstElementChild?.className).toBe('prepend-5');
		expect(document.querySelector('.f')?.lastElementChild?.className).toBe('append-6');
		expect(document.querySelector('.g')).toBeNull();
		expect(document.querySelector('.replaced')).not.toBeNull();
		expect(document.querySelector('.h')).toBeNull();
		expect(classNames).toEqual(['before-1', 'after-2', 'prepend-3', 'append-4', 'prepend-5', 'append-6', 'replaced']);
	});

	it('injects into dynamically added elements with autoRetarget', async () => {
		document = createDocument(`
			<div id="content"></div>
		`);

		const selector: Target = {
			selector: '.classToLookFor',
			inject: {
				action: 'append',
				element: (target, element) => {
					const div = document.createElement('div');

					div.className = 'newThing';

					expect(element.className).toBe('classToLookFor');

					div.innerHTML = 'blah';

					return div;
				},
			},
			autoRetarget: true,
		};

		new DomTargeter([selector], (target: Target, elem: Element) => {}, document);

		expect(document.querySelector('.classToLookFor')).toBe(null);

		await wait(200);

		document.getElementById('content')?.classList.add('classToLookFor');

		await wait(200);

		expect(document.querySelector('.classToLookFor')).not.toBe(null);
		expect(document.querySelector('.newThing')?.innerHTML).toBe('blah');
	});

	it('injects into dynamically added elements with autoRetarget at different times.', async () => {
		document = createDocument(`
			<div id="content"></div>
		`);

		const selectors: Target[] = [
			{
				selector: '.classToLookFor',
				inject: {
					action: 'append',
					element: (target, element) => {
						const div = document.createElement('div');

						div.id = 'newThing';

						expect(element.className).toBe('classToLookFor');

						div.innerHTML = 'blah';

						return div;
					},
				},
				autoRetarget: true,
			},
			{
				selector: '.classToLookFor2',
				inject: {
					action: 'append',
					element: (target, element) => {
						const div = document.createElement('div');

						expect(element.className).toBe('classToLookFor2');

						div.innerHTML = 'tada';

						return div;
					},
				},
				autoRetarget: true,
			},
		];

		new DomTargeter(selectors, (target: Target, elem: Element) => {}, document);

		expect(document.querySelector('.classToLookFor')).toBe(null);

		await wait(100);
		document.getElementById('content')?.classList.add('classToLookFor');

		await wait(200);
		expect(document.querySelector('.classToLookFor')).not.toBe(null);
		expect(document.querySelector('#newThing')?.innerHTML).toBe('blah');

		await wait(100);
		document.getElementById('newThing')?.classList.add('classToLookFor2');

		await wait(100);
		expect(document.querySelector('#newThing')?.innerHTML).toBe('blah');

		await wait(300);
		expect(document.querySelector('.classToLookFor2')).not.toBe(null);
		expect(document.querySelector('#content')?.innerHTML).toBe('<div id="newThing" class="classToLookFor2">blah<div>tada</div></div>');
	});

	it('injects into same elements from multiple targets', async () => {
		document = createDocument(`
			<div id="content"></div>
		`);

		new DomTargeter(
			[
				{
					selector: '#content',
					inject: {
						action: 'append',
						element: (target, element) => {
							const div = document.createElement('div');
							div.id = 'newThing';
							div.innerHTML = 'blah';
							return div;
						},
					},
				},
			],
			(target: Target, elem: Element) => {},
			document
		);

		new DomTargeter(
			[
				{
					selector: '#content',
					inject: {
						action: 'append',
						element: (target, element) => {
							const div = document.createElement('div');
							div.id = 'newThing2';
							div.innerHTML = 'tada';
							return div;
						},
					},
				},
			],
			(target: Target, elem: Element) => {},
			document
		);

		new DomTargeter(
			[
				{
					selector: '#content',
					inject: {
						action: 'prepend',
						element: (target, element) => {
							const div = document.createElement('div');
							div.id = 'newThing0';
							div.innerHTML = 'first';
							return div;
						},
					},
				},
			],
			(target: Target, elem: Element) => {},
			document
		);

		expect(document.querySelector('#content')?.innerHTML).toBe(
			'<div id="newThing0">first</div><div id="newThing">blah</div><div id="newThing2">tada</div>'
		);
	});

	it('injects elements before and after the same selector', async () => {
		document = createDocument(`<div id="findMe"><div id="content"></div></div>`);

		new DomTargeter(
			[
				{
					selector: '#content',
					inject: {
						action: 'before',
						element: (target, element) => {
							const div = document.createElement('div');
							div.id = 'newThing';
							div.innerHTML = 'blah';
							return div;
						},
					},
				},
			],
			(target: Target, elem: Element) => {},
			document
		);

		new DomTargeter(
			[
				{
					selector: '#content',
					inject: {
						action: 'after',
						element: (target, element) => {
							const div = document.createElement('div');
							div.id = 'newThing2';
							div.innerHTML = 'tada';
							return div;
						},
					},
				},
			],
			(target: Target, elem: Element) => {},
			document
		);

		expect(document.querySelector('#findMe')?.innerHTML).toBe('<div id="newThing">blah</div><div id="content"></div><div id="newThing2">tada</div>');
	});

	it('replaces content using inject, but does not allow retargeting of that element', async () => {
		document = createDocument(`<div id="findMe"><div id="content"></div></div>`);

		new DomTargeter(
			[
				{
					selector: '#content',
					inject: {
						action: 'replace',
						element: (target, element) => {
							const div = document.createElement('div');
							div.id = 'content';
							div.innerHTML = 'blah';
							return div;
						},
					},
				},
			],
			(target: Target, elem: Element) => {},
			document
		);

		new DomTargeter(
			[
				{
					selector: '#content',
					inject: {
						action: 'after',
						element: (target, element) => {
							const div = document.createElement('div');
							div.id = 'newThing';
							div.innerHTML = 'tada';
							return div;
						},
					},
				},
			],
			(target: Target, elem: Element) => {},
			document
		);

		expect(document.querySelector('#findMe')?.innerHTML).toBe('<div id="content">blah</div><div id="newThing">tada</div>');

		new DomTargeter(
			[
				{
					selector: '#content',
					inject: {
						action: 'replace',
						element: (target, element) => {
							const div = document.createElement('div');
							div.id = 'lastThing';
							div.innerHTML = 'tada';
							return div;
						},
					},
				},
			],
			(target: Target, elem: Element) => {},
			document
		);

		expect(document.querySelector('#findMe')?.innerHTML).toBe('<div id="lastThing">tada</div><div id="newThing">tada</div>');
	});
});
