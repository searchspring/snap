import { useState, useEffect } from 'preact/hooks';
import { url, cookies } from '@searchspring/snap-toolbox';

type FileHeaderDetails = {
	lastModified: string;
};

const icons = {
	'close-thin':
		'M56 5.638l-22.362 22.362 22.362 22.362-5.638 5.638-22.362-22.362-22.362 22.362-5.638-5.638 22.362-22.362-22.362-22.362 5.638-5.638 22.362 22.362 22.362-22.362z',
	warn: 'M31.2981 5.28228C29.8323 2.74341 26.1677 2.74341 24.7019 5.28228L0.515899 47.1737C-0.94992 49.7126 0.88235 52.8861 3.81399 52.8861H52.186C55.1176 52.8861 56.9499 49.7126 55.4841 47.1737L31.2981 5.28228ZM25.2229 35.0037L24.8264 18.837C24.8264 18.655 24.8923 18.4729 25.047 18.3686C25.1794 18.2387 25.3776 18.1601 25.5759 18.1601H30.4241C30.6223 18.1601 30.8206 18.238 30.953 18.3686C31.1071 18.4729 31.1736 18.655 31.1736 18.837L30.7988 35.0037C30.7988 35.3679 30.4682 35.6542 30.0493 35.6542H25.9724C25.5759 35.6542 25.2453 35.3679 25.2229 35.0037ZM25.1788 43.9593V39.0131C25.1788 38.5447 25.487 38.1541 25.8618 38.1541H30.0929C30.4894 38.1541 30.82 38.5447 30.82 39.0131V43.9593C30.82 44.4277 30.4894 44.8183 30.0929 44.8183H25.8618C25.487 44.8183 25.1788 44.4277 25.1788 43.9593Z',
};

const fetchBundleDetails = async (url: string): Promise<FileHeaderDetails> => {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.open('HEAD', url, true);

		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE) {
				const status = request.status;
				if (status === 0 || (status >= 200 && status < 400)) {
					resolve({
						lastModified: request.getResponseHeader('Last-Modified').split(',')[1],
					});
				} else {
					reject();
				}
			}
		};

		request.onerror = () => reject();

		request.send();
	});
};

const darkTheme = {
	main: {
		border: '0',
		background: 'rgba(59, 35, 173, 0.9)',
		color: '#fff',
		boxShadow: '#4c3ce2 1px 1px 3px 0px',
	},
	top: {
		background: 'rgba(59, 35, 173, 0.3)',
		border: '1px solid #4c3de1',
		logo: {
			src: 'https://snapui.searchspring.io/searchspring_light.svg',
		},
		button: {
			border: '1px solid #fff',
			content: 'STOP PREVIEW',
		},
		close: {
			fill: '#fff',
		},
	},
	details: {
		content: 'Preview functionality may differ from production.',
		branch: {
			color: '#03cee1',
			style: 'italic',
		},
		additional: {
			color: '#03cee1',
		},
	},
};

const lightTheme = {
	main: {
		border: '1px solid #ccc',
		background: 'rgba(255, 255, 255, 0.9)',
		color: '#515151',
		boxShadow: 'rgba(81, 81, 81, 0.5) 1px 1px 3px 0px',
	},
	top: {
		background: 'rgba(255, 255, 255, 0.3)',
		border: '1px solid #ccc',
		logo: {
			src: 'https://snapui.searchspring.io/searchspring.svg',
		},
		button: {
			border: '1px solid #515151',
			content: 'STOP PREVIEW',
		},
		close: {
			fill: '#515151',
		},
	},
	details: {
		content: 'Preview functionality may differ from production.',
		branch: {
			color: '#3a23ad',
			style: 'italic',
		},
		additional: {
			color: '#3a23ad',
		},
	},
};

const failureTheme = {
	main: {
		border: '0',
		background: 'rgba(130, 6, 6, 0.9)',
		color: '#fff',
		boxShadow: 'rgba(130, 6, 6, 0.4) 1px 1px 3px 0px',
	},
	top: {
		background: 'rgba(130, 6, 6, 0.3)',
		border: '1px solid #760000',
		logo: {
			src: 'https://snapui.searchspring.io/searchspring_light.svg',
		},
		button: {
			border: '1px solid #fff',
			content: 'REMOVE',
		},
		close: {
			fill: '#fff',
		},
	},
	details: {
		content: 'Incorrect branch name or branch no longer exists.',
		branch: {
			color: '#be9628',
			style: 'none',
		},
		additional: {
			color: '#be9628',
		},
	},
};

const themes = {
	darkTheme,
	lightTheme,
	failureTheme,
};

export const BranchOverride = (props: { branch: string; cookieName: string; bundleUrl: string }): JSX.Element => {
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const [themeName, setThemeName] = useState(prefersDark ? 'darkTheme' : 'lightTheme');
	const [details, setDetails] = useState(null);
	useEffect(() => {
		async function getDetails() {
			try {
				const details = await fetchBundleDetails(props.bundleUrl);
				setDetails(details);
			} catch (err) {
				setThemeName('failureTheme');
				setDetails('failure');
			}
		}
		getDetails();
	}, []);

	return (
		props.branch &&
		details && (
			<div
				class="ss__branch-override"
				style={`width: 360px; height: 120px; overflow: hidden; transition: height ease 0.5s 0.5s, right ease 0.5s; font-size: 14px; position: fixed; z-index: 9999; bottom: 50px; right: 0; background: ${themes[themeName].main.background}; color: ${themes[themeName].main.color}; border: ${themes[themeName].main.border}; border-right: 0; border-top-left-radius: 5px; border-bottom-left-radius: 5px; box-shadow: ${themes[themeName].main.boxShadow};`}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					const popup = document.querySelector('.ss__branch-override') as HTMLDivElement;
					popup.style.transition = 'height ease 0.2s, right ease 0.5s 0.2s';
					popup.style.right = '-1px';
					popup.style.height = '120px';
					popup.style.cursor = 'auto';
				}}
			>
				<div
					style={`padding: 10px; position: relative; background: ${themes[themeName].top.background}; border-bottom: ${themes[themeName].top.border}; margin-bottom: 10px;`}
				>
					<img src={themes[themeName].top.logo.src} style={`display: inline-block; height: 30px; vertical-align: middle;`} />

					<div
						style="display: inline-block; float: right; padding: 5px; cursor: pointer;"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							const popup = document.querySelector('.ss__branch-override') as HTMLDivElement;
							popup.style.transition = 'height ease 0.5s 0.5s, right ease 0.5s';
							popup.style.right = '-316px';
							popup.style.height = '50px';
							popup.style.cursor = 'pointer';
						}}
					>
						<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px">
							<path fill={themes[themeName].top.close.fill} d={icons['close-thin']} />
						</svg>
					</div>

					<div
						style={`border-radius: 5px; padding: 6px; height: 100%; line-height: 14px; text-align: center; cursor: pointer; font-size: 11px; border: ${themes[themeName].top.button.border}; float: right; margin-right: 14px;`}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							cookies.unset(props.cookieName);
							const urlState = url(window.location.href);
							delete urlState.params.query['branch'];
							window.location.href = urlState.url();
						}}
					>
						{themes[themeName].top.button.content}
					</div>
				</div>

				<div style="padding: 0px 15px;">
					<span
						style={`font-weight: bold; font-style: ${themes[themeName].details.branch.style}; color: ${themes[themeName].details.branch.color}; font-size: 16px; line-height: 20px; display: inline-block; max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`}
					>
						{details == 'failure' ? (
							<>
								<svg style="margin-right: 10px;" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px">
									<path fill={themes[themeName].details.branch.color} d={icons['warn']} />
								</svg>
								Branch not found!
							</>
						) : (
							props.branch
						)}
					</span>

					<span style={`float: right; font-style: italic; color: ${themes[themeName].details.additional.color}; font-size: 12px; line-height: 20px;`}>
						{details?.lastModified || props.branch}
					</span>
					<br />
					{themes[themeName].details.content}
				</div>
			</div>
		)
	);
};
