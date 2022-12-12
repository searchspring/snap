type BundleDetails = {
	url: string;
	lastModified: string;
};

export const getBundleDetails = async (url: string): Promise<BundleDetails> => {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.open('HEAD', url, true);

		request.onreadystatechange = () => {
			if (request.readyState === request.DONE) {
				const status = request.status;
				const lastModified = request.getResponseHeader('Last-Modified');

				if ((lastModified && status === 0) || (status >= 200 && status < 400)) {
					resolve({
						url,
						lastModified: lastModified?.split(',')[1]?.trim() || '',
					});
				} else {
					reject({ message: 'Branch not found!', description: 'Incorrect branch name or branch no longer exists.' });
				}
			}
		};

		request.onerror = () => reject({ message: 'Branch load fail!', description: 'There was an error with the request.' });

		request.send();
	});
};
