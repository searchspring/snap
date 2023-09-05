export function escapeHTML(unsafe: string) {
	if (typeof unsafe != 'string') throw new Error('parameter must be a string');

	// if there is a document on the window use textContent to encode string
	if (window?.document) {
		const textAreaDiv = window.document.createElement('textarea');
		textAreaDiv.textContent = unsafe;
		return textAreaDiv.innerHTML;
	}

	// otherwise replace significant characters
	return unsafe.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/'/g, '&#039;').replace(/"/g, '&quot;');
}
