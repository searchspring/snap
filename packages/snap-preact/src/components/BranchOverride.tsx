import { url, cookies } from '@searchspring/snap-toolbox';

export const BRANCH_COOKIE = 'ssBranch';

export const BranchOverride = (props: { branch: string }): JSX.Element => {
	return (
		props.branch && (
			<div
				class="ss__branch-override"
				style="width: 90%; max-width: 400px; height: 100px; overflow: hidden; transition: height ease 0.5s 0.5s, right ease 0.5s; font-size: 14px; position: fixed; z-index: 9999; bottom: 50px; right: -1px; background: rgba(255,255,255,0.8); border: 1px solid #ccc; padding: 10px; border-top-left-radius: 5px; border-bottom-left-radius: 5px; box-shadow: #51515170 -1px 0px 3px 0px;"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					const popup = document.querySelector('.ss__branch-override') as HTMLDivElement;
					popup.style.transition = 'height ease 0.2s, right ease 0.5s 0.2s';
					popup.style.right = '-1px';
					popup.style.height = '100px';
					popup.style.cursor = 'auto';
				}}
			>
				<div style="color: #515151;">
					<img src="https://snapui.searchspring.io/searchspring.svg" style="display: inline-block; height: 35px; vertical-align: middle;" />
					<div
						style="display: inline-block; float: right; padding: 5px;"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							const popup = document.querySelector('.ss__branch-override') as HTMLDivElement;
							popup.style.transition = 'height ease 0.5s 0.5s, right ease 0.5s';
							popup.style.right = '-375px';
							popup.style.height = '40px';
							popup.style.cursor = 'pointer';
						}}
					>
						<svg viewBox="0 0 56 56" width="18px" height="18px">
							<path
								fill="#515151"
								d="M56 5.638l-22.362 22.362 22.362 22.362-5.638 5.638-22.362-22.362-22.362 22.362-5.638-5.638 22.362-22.362-22.362-22.362 5.638-5.638 22.362 22.362 22.362-22.362z"
							></path>
						</svg>
					</div>
					<div
						style="border-radius: 5px; padding: 6px; height: 14px; text-align: center; cursor: pointer; font-size: 11px; text-transform: lowercase; border: 1px solid #515151; color: #515151; float: right; margin-right: 14px;"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							cookies.unset(BRANCH_COOKIE);
							const urlState = url(window.location.href);
							delete urlState.params.query['branch'];
							window.location.href = urlState.url();
						}}
					>
						Stop Preview
					</div>
				</div>

				<div style="padding: 5px 5px 0px 40px;">
					This is a preview of the <span style="font-weight: bold; font-style: italic; color: #3a23ad; font-size: 14px;">{props.branch}</span> branch
					build and may not be representative of the functionality in production.
				</div>
			</div>
		)
	);
};
