import { useState, useEffect } from 'preact/hooks';
import { url, cookies } from '@searchspring/snap-toolbox';
import { useMediaQuery, Icon } from '@searchspring/snap-preact-components';

type FileHeaderDetails = {
	lastModified: string;
};
const fetchBundleDetails = async (url: string): Promise<FileHeaderDetails> => {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.open('HEAD', url, true);

		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE) {
				const status = request.status;
				if (status === 0 || (status >= 200 && status < 400)) {
					console.log('status', status, request);
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
	const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
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
						<Icon icon="close-thin" size="18px" color={themes[themeName].top.close.fill} />
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
								<Icon icon="warn" size="14px" color={themes[themeName].details.branch.color} style="margin-right: 10px;" />
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
