import { h } from 'preact';

import { render, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { BranchOverride } from './BranchOverride';
import { ThemeProvider } from '../../../providers';

describe('BranchOverride Component', () => {
	const branch = 'branch';
	const url = 'https://snapui.searchspring.io/y56s6x/branch/bundle.js';
	const lastModified = '07 Jan 2022 22:42:39 GMT';

	const props = {
		name: branch,
		details: {
			url,
			lastModified,
		},
	};

	it('displays branch bundle details', async () => {
		const rendered = render(<BranchOverride {...props} />);

		// wait for rendering of component
		await waitFor(() => {
			const overrideElement = rendered.container.querySelector('.ss__branch-override')!;
			expect(overrideElement).toBeInTheDocument();
			expect(overrideElement.classList).toHaveLength(3);

			const styles = getComputedStyle(overrideElement);
			expect(styles.background).toBe('rgba(255, 255, 255, 0.95)');
		});

		// branch name
		const bottomLeftElement = rendered.container.querySelector('.ss__branch-override .ss__branch-override__bottom__left')!;
		expect(bottomLeftElement).toBeInTheDocument();
		expect(bottomLeftElement.innerHTML).toContain(branch);

		// branch modified date
		const bottomRightElement = rendered.container.querySelector('.ss__branch-override .ss__branch-override__bottom__right')!;
		expect(bottomRightElement).toBeInTheDocument();
		expect(bottomRightElement.innerHTML).toContain(lastModified);
	});

	it('can set dark mode', async () => {
		const rendered = render(<BranchOverride {...props} darkMode />);

		// wait for rendering of component
		await waitFor(() => {
			const overrideElement = rendered.container.querySelector('.ss__branch-override')!;
			expect(overrideElement).toBeInTheDocument();
			const styles = getComputedStyle(overrideElement);
			expect(styles.background).toBe('rgba(59, 35, 173, 0.9)');
		});
	});

	it('can be collapsed and uncollapsed', async () => {
		const rendered = render(<BranchOverride {...props} />);

		// wait for rendering of component
		let overrideElement;
		await waitFor(() => {
			overrideElement = rendered.container.querySelector('.ss__branch-override');
			expect(overrideElement).toBeInTheDocument();
			expect(overrideElement).not.toHaveClass('ss__branch-override--collapsed');
		});

		const collapseButton = overrideElement.querySelector('.ss__branch-override__top__collapse');
		expect(collapseButton).toBeInTheDocument();
		userEvent.click(collapseButton);
		await waitFor(() => expect(overrideElement).toHaveClass('ss__branch-override--collapsed'));

		userEvent.click(overrideElement);
		await waitFor(() => expect(overrideElement).not.toHaveClass('ss__branch-override--collapsed'));
	});

	it(`has a remove button that calls 'onRemove'`, async () => {
		const removeFn = jest.fn();
		const rendered = render(<BranchOverride {...props} onRemoveClick={removeFn} />);

		// wait for rendering of component
		let overrideElement;
		await waitFor(() => {
			overrideElement = rendered.container.querySelector('.ss__branch-override');
			expect(overrideElement).toBeInTheDocument();
		});

		const closeButton = overrideElement.querySelector('.ss__branch-override__top__button');
		expect(closeButton).toBeInTheDocument();
		userEvent.click(closeButton);
		expect(removeFn).toHaveBeenCalledTimes(1);
	});

	it('displays branch failure on bad branch', async () => {
		const name = 'badBranch';
		const error = {
			message: 'Branch not found...',
			description: 'Unable to find the branch.',
		};

		const rendered = render(<BranchOverride name={name} error={error} />);

		// wait for rendering of component
		await waitFor(() => {
			const overrideElement = rendered.container.querySelector('.ss__branch-override')!;
			expect(overrideElement).toBeInTheDocument();
			const styles = getComputedStyle(overrideElement);
			expect(styles.background).toBe('rgba(130, 6, 6, 0.9)');
		});

		// branch name
		const bottomRightElement = rendered.container.querySelector('.ss__branch-override .ss__branch-override__bottom__right');
		expect(bottomRightElement).toBeInTheDocument();
		expect(bottomRightElement?.innerHTML).toContain(name);

		// error message
		const bottomLeftElement = rendered.container.querySelector('.ss__branch-override .ss__branch-override__bottom__left');
		expect(bottomLeftElement).toBeInTheDocument();
		expect(bottomLeftElement?.textContent).toContain(error.message);

		// error description
		const bottomContentElement = rendered.container.querySelector('.ss__branch-override .ss__branch-override__bottom__content');
		expect(bottomContentElement).toBeInTheDocument();
		expect(bottomContentElement?.textContent).toContain(error.description);
	});

	it(`displays branch failure when both 'error' and 'details' props are provided`, async () => {
		const error = {
			message: 'Branch not found...',
			description: 'Unable to find the branch.',
		};

		const rendered = render(<BranchOverride {...props} error={error} />);

		// wait for rendering of component
		await waitFor(() => {
			const overrideElement = rendered.container.querySelector('.ss__branch-override')!;
			expect(overrideElement).toBeInTheDocument();
			const styles = getComputedStyle(overrideElement);
			expect(styles.background).toBe('rgba(130, 6, 6, 0.9)');
		});

		// branch name
		const bottomRightElement = rendered.container.querySelector('.ss__branch-override .ss__branch-override__bottom__right');
		expect(bottomRightElement).toBeInTheDocument();
		expect(bottomRightElement?.innerHTML).toContain(props.name);

		// error message
		const bottomLeftElement = rendered.container.querySelector('.ss__branch-override .ss__branch-override__bottom__left');
		expect(bottomLeftElement).toBeInTheDocument();
		expect(bottomLeftElement?.textContent).toContain(error.message);

		// error description
		const bottomContentElement = rendered.container.querySelector('.ss__branch-override .ss__branch-override__bottom__content');
		expect(bottomContentElement).toBeInTheDocument();
		expect(bottomContentElement?.textContent).toContain(error.description);
	});

	it('can disable styles', async () => {
		const rendered = render(<BranchOverride {...props} disableStyles />);

		// wait for rendering of component
		await waitFor(() => {
			const overrideElement = rendered.container.querySelector('.ss__branch-override');
			expect(overrideElement).toBeInTheDocument();
			expect(overrideElement?.classList).toHaveLength(2);
		});
	});

	it('can add additional styles', async () => {
		const rendered = render(<BranchOverride {...props} style={{ background: 'blue' }} />);

		// wait for rendering of component
		await waitFor(() => {
			const overrideElement = rendered.container.querySelector('.ss__branch-override')!;
			expect(overrideElement).toBeInTheDocument();
			const styles = getComputedStyle(overrideElement);
			expect(styles.background).toBe('blue');
		});
	});

	it('can add additional styles when default styles are disabled', async () => {
		const rendered = render(<BranchOverride {...props} disableStyles style={{ background: 'blue' }} />);

		// wait for rendering of component
		await waitFor(() => {
			const overrideElement = rendered.container.querySelector('.ss__branch-override')!;
			expect(overrideElement).toBeInTheDocument();
			const styles = getComputedStyle(overrideElement);
			expect(styles.background).toBe('blue');
		});
	});

	it('renders with classname', async () => {
		const className = 'classy';
		const rendered = render(<BranchOverride {...props} className={className} />);

		// wait for rendering of component
		await waitFor(() => {
			const overrideElement = rendered.container.querySelector('.ss__branch-override');
			expect(overrideElement).toBeInTheDocument();
			expect(overrideElement).toHaveClass(className);
		});
	});

	describe('component theming works', () => {
		it('is themeable with ThemeProvider', async () => {
			const globalTheme = {
				components: {
					branchOverride: {
						className: 'classy',
					},
				},
			};

			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<BranchOverride {...props} />
				</ThemeProvider>
			);

			// wait for rendering of component
			await waitFor(() => {
				const overrideElement = rendered.container.querySelector('.ss__branch-override');
				expect(overrideElement).toBeInTheDocument();
				expect(overrideElement).toHaveClass(globalTheme.components.branchOverride.className);
			});
		});

		it('is themeable with theme prop', async () => {
			const propTheme = {
				components: {
					branchOverride: {
						className: 'classy',
					},
				},
			};

			const rendered = render(<BranchOverride {...props} theme={propTheme} />);

			// wait for rendering of component
			await waitFor(() => {
				const overrideElement = rendered.container.querySelector('.ss__branch-override');
				expect(overrideElement).toBeInTheDocument();
				expect(overrideElement).toHaveClass(propTheme.components.branchOverride.className);
			});
		});

		it('the theme prop overrides ThemeProvider', async () => {
			const globalTheme = {
				components: {
					branchOverride: {
						className: 'not classy',
					},
				},
			};
			const propTheme = {
				components: {
					branchOverride: {
						className: 'classy',
					},
				},
			};

			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<BranchOverride {...props} theme={propTheme} />
				</ThemeProvider>
			);

			// wait for rendering of component
			await waitFor(() => {
				const overrideElement = rendered.container.querySelector('.ss__branch-override');
				expect(overrideElement).toBeInTheDocument();
				expect(overrideElement).toHaveClass(propTheme.components.branchOverride.className);
				expect(overrideElement).not.toHaveClass(globalTheme.components.branchOverride.className);
			});
		});
	});
});
