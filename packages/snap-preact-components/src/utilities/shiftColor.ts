export function shiftColor(base: string, change: string) {
	const colorRegEx = /^\#?[A-Fa-f0-9]{6}$/;

	if (!base || !change) {
		return '#000000';
	}

	if (!base.match(colorRegEx) || !change.match(colorRegEx)) {
		return '#000000';
	}

	// remove '#'s
	base = base.replace(/\#/g, '');
	change = change.replace(/\#/g, '');

	let newColor = '';
	for (let i = 0; i < 3; i++) {
		const basePiece = parseInt(base.substring(i * 2, i * 2 + 2), 16);
		const changePiece = parseInt(change.substring(i * 2, i * 2 + 2), 16);
		let newPiece: string | number;

		newPiece = basePiece + changePiece;
		newPiece = newPiece > 255 ? 255 : newPiece;

		newPiece = newPiece.toString(16);
		newPiece = newPiece.length < 2 ? '0' + newPiece : newPiece;
		newColor += newPiece;
	}

	return `#${newColor}`;
}
