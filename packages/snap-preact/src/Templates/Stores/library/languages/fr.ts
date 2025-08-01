import type { ValueFacet } from '@searchspring/snap-store-mobx';
import { LangComponents } from '../../../../../components/src';

export const fr: LangComponents = {
	recommendation: {},
	autocompleteLayout: {
		facetsTitle: {},
		contentTitle: {},
		closeButton: {
			value: 'fermer la saisie semi-automatique',
			attributes: {
				'aria-label': 'fermer la saisie semi-automatique',
			},
		},
		noResultsText: {
			value: (data) =>
				`<p>Aucun résultat trouvé pour "${
					data.controller?.store?.search?.originalQuery?.string || data.controller?.store?.search?.query?.string
				}".</p><p>Veuillez essayer une autre recherche.</p>`,
		},
		seeMoreButton: {
			value: (data) =>
				`Voir ${data?.controller?.store?.pagination.totalResults} ${data?.controller?.store?.filters.length > 0 ? 'filtré' : ''} résultat${
					data?.controller?.store?.pagination?.totalResults == 1 ? '' : 's'
				} pour "${data?.controller?.store?.search?.query?.string}"`,
		},
	},
	'terms.history': {
		title: {
			value: 'Histoire',
		},
		term: {
			attributes: {
				'aria-label': (data) => `article ${data.index + 1} de ${data.numberOfTerms}, ${data.term.value}`,
			},
		},
	},
	'terms.suggestions': {
		title: {
			value: 'Suggestions',
		},
		term: {
			attributes: {
				'aria-label': (data) => `article ${data.index + 1} de ${data.numberOfTerms}, ${data.term.value}`,
			},
		},
	},
	'terms.trending': {
		title: {
			value: 'Tendance',
		},
		term: {
			attributes: {
				'aria-label': (data) => `article ${data.index + 1} de ${data.numberOfTerms}, ${data.term.value}`,
			},
		},
	},
	button: {},
	search: {},
	list: {},
	radioList: {},
	layoutSelector: {
		label: {},
	},
	sidebar: {
		titleText: {
			value: 'Filtres',
		},
	},
	searchInput: {
		placeholderText: {
			attributes: {
				placeholder: 'Recherche',
			},
		},
		closeSearchButton: {
			attributes: {
				'aria-label': 'Fermer la recherche',
			},
		},
		clearSearchButton: {
			attributes: {
				'aria-label': 'Effacer la recherche',
			},
		},
		submitSearchButton: {
			attributes: {
				'aria-label': 'Soumettre Rechercher',
			},
		},
	},
	recommendationBundle: {
		seedText: {
			value: 'Ce produit',
		},
		ctaButtonText: {
			value: 'Ajouter tout au panier',
		},
		ctaButtonSuccessText: {
			value: 'Offre groupée ajoutée!',
		},
	},
	mobileSidebar: {
		openButtonText: {
			value: 'Filtres',
		},
		clearButtonText: {
			value: 'Tout Effacer',
		},
		applyButtonText: {
			value: 'Appliquer',
		},
		titleText: {
			value: 'Options de Filtrage',
		},
		closeButtonText: {
			attributes: {
				'aria-label': `fermer le bouton Filtres`,
			},
		},
	},
	sortBy: {
		label: {
			value: 'Trier Par',
		},
	},
	perPage: {
		label: {
			value: 'par page',
		},
	},
	facetsHorizontal: {
		dropdownButton: {
			attributes: {
				'aria-label': (data) =>
					`actuellement ${data?.selectedFacet?.field === data?.facet?.field ? 'effondré' : 'ouvrir'} ${
						data?.facet?.field
					} liste déroulante des facettes ${
						(data?.facet as ValueFacet)?.values?.length ? (data?.facet as ValueFacet)?.values?.length + ' choix' : ''
					}`,
			},
		},
	},
	filterSummary: {
		title: {
			value: 'Filtres Actuels',
		},
		clearAllLabel: {
			value: 'Tout effacer',
		},
	},
	facet: {
		showMoreText: {
			value: 'Afficher Plus',
		},
		showLessText: {
			value: 'Montrer Moins',
		},
		clearAllText: {
			value: 'Tout Effacer',
		},
		dropdownButton: {
			attributes: {
				'aria-label': (data) =>
					`actuellement ${data?.facet?.collapsed ? 'effondré' : 'ouvrir'} ${data?.facet?.label} liste déroulante des facettes ${
						(data?.facet as ValueFacet)?.values?.length ? (data?.facet as ValueFacet)?.values?.length + ' choix' : ''
					}`,
			},
		},
	},
	select: {
		buttonLabel: {
			attributes: {
				'aria-label': (data) =>
					`${data?.label} dérouler, ${data?.options?.length} choix ${
						data?.selectedOptions?.length ? `, L'option actuellement sélectionnée est ${data?.selectedOptions[0].label}` : ''
					}`,
			},
		},
	},
	radio: {
		radio: {
			attributes: {
				'aria-label': (data) => `${data?.disabled ? 'désactivé' : ''} ${data?.checkedState ? 'à carreaux' : 'décoché'} bouton radio`,
			},
		},
	},
	pagination: {
		previous: {
			attributes: {
				'aria-label': 'aller à la page précédente',
			},
		},
		next: {
			attributes: {
				'aria-label': 'aller à la page suivante',
			},
		},
		first: {
			attributes: {
				'aria-label': 'aller à la première page',
			},
		},
		last: {
			attributes: {
				'aria-label': (data) => `aller à la dernière page ${data?.pagination?.last?.number}`,
			},
		},
		page: {
			attributes: {
				'aria-label': (data) => `aller à la page ${data?.page?.number}`,
			},
		},
	},
	paginationInfo: {
		infoText: {
			// TODO: add begin & end range here
			value: ({ pagination }) => `${pagination?.totalResults} produits`,
		},
	},
	loadMore: {
		loadMoreButton: {
			attributes: {
				'aria-label': 'Charger plus',
			},
		},
		progressText: {
			value: (data) => `Vous avez consulté ${data?.pagination?.end} de ${data?.pagination?.totalResults} produits`,
		},
	},
	grid: {
		showMoreText: {
			value: (data) => `+ ${data?.remainder}`,
		},
		showLessText: {
			value: 'Moins',
		},
	},
	filter: {
		filter: {
			attributes: {
				'aria-label': (data) => `${!data?.label ? data?.value || '' : `supprimer la sélection ${data?.label} filtre ${data?.value}`}`,
			},
		},
	},
	facetSlider: {
		sliderHandle: {
			attributes: {
				'aria-label': (data) =>
					`${data?.facet?.label} bouton curseur, valeur actuelle ${data?.value}, ${
						data?.facet?.range?.low ? `valeur minimale ${data?.facet?.range?.low},` : ``
					} ${data?.facet?.range?.high ? `valeur maximale ${data?.facet?.range?.high}` : ``}`,
			},
		},
	},
	facetPaletteOptions: {
		paletteOption: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value?.filtered
							? `supprimer le filtre sélectionné ${data?.facet?.label || ''} - ${data?.value?.label}`
							: data?.facet?.label
							? `filtrer par ${data?.facet?.label} - ${data?.value?.label}`
							: `filtrer par ${data?.value?.label}`
					}`,
			},
		},
	},
	facetListOptions: {
		listOption: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value?.filtered
							? `supprimer le filtre sélectionné ${data?.facet?.label || ''} - ${data?.value?.label}`
							: data?.facet?.label
							? `filtrer par ${data?.facet?.label} - ${data?.value?.label}`
							: `filtrer par ${data?.value?.label}`
					}`,
			},
		},
	},
	facetHierarchyOptions: {
		hierarchyOption: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value?.filtered
							? `supprimer le filtre sélectionné ${data?.facet?.label || ''} - ${data?.value?.label}`
							: data?.facet?.label
							? `filtrer par ${data?.facet?.label} - ${data?.value?.label}`
							: `filtrer par ${data?.value?.label}`
					}`,
			},
		},
	},
	facetGridOptions: {
		gridOption: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value?.filtered
							? `supprimer le filtre sélectionné ${data?.facet?.label || ''} - ${data?.value?.label}`
							: data?.facet?.label
							? `filtrer par ${data?.facet?.label} - ${data?.value?.label}`
							: `filtrer par ${data?.value?.label}`
					}`,
			},
		},
	},
	errorHandler: {
		warningText: {
			value: `<b>Avertissement:&nbsp;</b>`,
		},
		infoText: {
			value: `<b>Informations:&nbsp;</b>`,
		},
		errorText: {
			value: `<b>Erreur:&nbsp;</b>`,
		},
		reloadText: {
			value: `Recharger`,
		},
	},
	checkbox: {
		checkbox: {
			attributes: {
				'aria-label': (data) => `${data?.disabled ? 'désactivé' : ''} ${data?.checkedState ? 'à carreaux' : 'décoché'} case à cocher`,
			},
		},
	},
	// toggle: {
	// 	toggleSwitch: {
	// 		attributes: {
	// 			'aria-label': (data) =>
	// 				`currently ${data?.toggledState ? 'selected' : 'not selected'} toggle switch ${data?.label ? `for ${data?.label}` : ''} `,
	// 		},
	// 	},
	// },
	// terms: {
	// 	term: {
	// 		value: (data) => `${data?.term?.value}`,
	// 		attributes: {
	// 			'aria-label': (data) => `item ${(data?.index || 0) + 1} of ${data?.numberOfTerms}, ${data?.term?.value}`,
	// 		},
	// 	},
	// },
	searchHeader: {
		titleText: {
			value: (data) => {
				return `Montrant résultat${data?.pagination?.totalResults == 1 ? '' : 's'} 
                ${data?.search?.query ? `pour <span class="ss__search-header__results-query">"${data?.search?.query.string}"</span>` : ''}`;
			},
			attributes: {
				'aria-label': (data) => `Affichage maintenant de ${data?.pagination?.totalResults} éléments dans la grille de produits`,
			},
		},
		correctedQueryText: {
			value: (data) => {
				return `Aucun résultat trouvé pour <em>"${data?.search?.originalQuery?.string}"</em>, montrant les résultats pour <em>"${data?.search?.query?.string}"</em> plutôt.`;
			},
			attributes: {
				'aria-label': (data) =>
					`Aucun résultat trouvé pour ${data?.search?.originalQuery?.string}, safficher les résultats pour ${data?.search?.query?.string} à la place`,
			},
		},
		noResultsText: {
			value: (data) => {
				return `${
					data?.search?.query
						? `<span>
                    Aucun résultat pour <span class="ss__search-header__results-query">"${data?.search?.query?.string}"</span> trouvée.
                </span>`
						: `<span>Aucun résultat trouvé.</span>`
				}`;
			},
			attributes: {
				'aria-label': (data) => `Aucun résultat trouvé pour ${data?.search?.query?.string}`,
			},
		},
		didYouMeanText: {
			value: (data) => {
				return `Vouliez-vous dire <a href=${data?.search?.didYouMean?.url.href}>${data?.search?.didYouMean?.string}</a>?`;
			},
		},
		expandedSearchText: {
			value: (data) => {
				return `Nous n'avons pas pu trouver de correspondance exacte pour "<span className="ss__search-header__results-query">${data?.search?.query?.string}</span>", mais voici quelque chose de similaire:`;
			},
		},
	},
	noResults: {
		suggestionsTitleText: {
			value: `Suggestions`,
		},
		suggestionsList: {
			value:
				'<ul className="ss__no-results__suggestions__list"><li className="ss__no-results__suggestions__list__option">Vérifiez les fautes d’orthographe.</li><li className="ss__no-results__suggestions__list__option">Supprimez les éventuels mots-clés redondants (ie: "produits").</li><li className="ss__no-results__suggestions__list__option">Utilisez d\'autres mots pour décrire ce que vous recherchez.</li></ul>',
		},
		// contactsTitleText: {
		// 	value: `Vous ne trouvez toujours pas ce que vous cherchez? <a href="/contact-us">Contactez-nous</a>.`,
		// },
		// contactsList: {
		// 	value: `<div className='ss__no-results__contact__detail'>
		//                 <h4 className="ss__no-results__contact__detail__title">Adresse</h4>
		//                 <p className="ss__no-results__contact__detail__content">123 Adresse Ville, État, Code postal</p>
		//             </div>
		//             <div className='ss__no-results__contact__detail'>
		//                 <h4 className="ss__no-results__contact__detail__title">Heures</h4>
		//                 <p className="ss__no-results__contact__detail__content">Lundi - Samedi, 00:00am - 00:00pm Samedi, 00:00am - 00:00pm</p>
		//             </div>
		//             <div className='ss__no-results__contact__detail'>
		//                 <h4 className="ss__no-results__contact__detail__title">Téléphone</h4>
		//                 <p className="ss__no-results__contact__detail__content"><a href="tel:1234567890">123-456-7890</a></p>
		//             </div>
		//             <div className='ss__no-results__contact__detail'>
		//                 <h4 className="ss__no-results__contact__detail__title">Email</h4>
		//                 <p className="ss__no-results__contact__detail__content"><a href="mailto:email@site.com">email@site.com</a></p>
		//             </div>`,
		// },
	},
};
