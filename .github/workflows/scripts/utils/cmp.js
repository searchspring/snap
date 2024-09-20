export const cmp = (a, b) => {
	const pa = a.split('.');
	const pb = b.split('.');
	for (let i = 0; i < 3; i++) {
		const na = Number(pa[i]);
		const nb = Number(pb[i]);

		if (i === 2) {
			// last digit & has additional versioning (eg 0.33.0-1)
			const [fa, la] = pa[i].split('-');
			const [fb, lb] = pb[i].split('-');
			const nfa = Number(fa);
			const nfb = Number(fb);
			const nla = Number(la) || -9999999;
			const nlb = Number(lb) || -9999999;

			if (nfa != nfb) {
				return nfa - nfb;
			}

			return nla - nlb;
		}

		if (na > nb) return 1;
		if (nb > na) return -1;
	}
};
