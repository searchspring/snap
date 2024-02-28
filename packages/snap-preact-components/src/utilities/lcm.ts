const gcd = (a: number, b: number): number => {
	if (!b) {
		return a;
	}
	return gcd(b, a % b);
};

export const lcm = (a: number, b: number): number => {
	const gcdValue = gcd(a, b);
	return (a * b) / gcdValue;
};
