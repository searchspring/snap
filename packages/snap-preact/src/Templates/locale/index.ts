export const localeMap = {
	language: {
		en: async () => {
			return (await import('./language/en')).en;
		},
	},
	currency: {
		usd: async () => {
			return (await import('./currency/usd')).usd;
		},
		eur: async () => {
			return (await import('./currency/eur')).eur;
		},
	},
};
