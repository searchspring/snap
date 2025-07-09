import { LangComponents } from '../../../../../components/src';
import type { ValueFacet } from '@searchspring/snap-store-mobx';

export const es: LangComponents = {
	recommendation: {},
	autocompleteLayout: {
		facetsTitle: {},
		contentTitle: {},
		closeButton: {
			value: 'Cerrar Autocompletar',
			attributes: {
				'aria-label': 'Cerrar Autocompletar',
			},
		},
		noResultsText: {
			value: (data) =>
				`<p>No se encontraron resultados para "${
					data.controller?.store?.search?.originalQuery?.string || data.controller?.store?.search?.query?.string
				}".</p><p>Por favor intenta otra búsqueda.</p>`,
		},
		seeMoreButton: {
			value: (data) =>
				`Ver ${data?.controller?.store?.pagination.totalResults} ${data?.controller?.store?.filters.length > 0 ? 'filtrado' : ''} resultado${
					data?.controller?.store?.pagination?.totalResults == 1 ? '' : 's'
				} para "${data?.controller?.store?.search?.query?.string}"`,
		},
	},
	'terms.history': {
		title: {
			value: 'Historia',
		},
		term: {
			value: (data) => `${data.term.value}`,
			attributes: {
				'aria-label': (data) => `artículo ${data.index + 1} de ${data.numberOfTerms}, ${data.term.value}`,
			},
		},
	},
	'terms.suggestions': {
		title: {
			value: 'Sugerido',
		},
		term: {
			value: (data) => `${data.term.value}`,
			attributes: {
				'aria-label': (data) => `artículo ${data.index + 1} de ${data.numberOfTerms}, ${data.term.value}`,
			},
		},
	},
	'terms.trending': {
		title: {
			value: 'Tendencia',
		},
		term: {
			value: (data) => `${data.term.value}`,
			attributes: {
				'aria-label': (data) => `artículo ${data.index + 1} de ${data.numberOfTerms}, ${data.term.value}`,
			},
		},
	},
	button: {},
	search: {},
	list: {},
	radioList: {},
	layoutSelector: {
		label: {
			value: 'Disposición',
		},
	},
	perPage: {
		label: {
			value: 'Por Página',
		},
	},
	sidebar: {
		titleText: {
			value: 'Filtros',
		},
	},
	searchInput: {
		placeholderText: {
			attributes: {
				placeholder: 'Buscar',
			},
		},
		closeSearchButton: {
			attributes: {
				'aria-label': 'Cerrar búsqueda',
			},
		},
		clearSearchButton: {
			attributes: {
				'aria-label': 'Borrar búsqueda',
			},
		},
		submitSearchButton: {
			attributes: {
				'aria-label': 'Enviar búsqueda',
			},
		},
	},
	recommendationBundle: {
		seedText: {
			value: 'Este producto',
		},
		ctaButtonText: {
			value: 'Agregar todo al carrito',
		},
		ctaButtonSuccessText: {
			value: '¡Paquete agregado!',
		},
	},
	mobileSidebar: {
		openButtonText: {
			value: 'Filtros',
		},
		clearButtonText: {
			value: 'Limpiar todo',
		},
		applyButtonText: {
			value: 'Aplicar',
		},
		titleText: {
			value: 'Opciones de filtro',
		},
		closeButtonText: {
			attributes: {
				'aria-label': 'cerrar botón de filtros',
			},
		},
	},
	sortBy: {
		label: {
			value: (data) => `${data}`,
		},
	},
	facetsHorizontal: {
		dropdownButton: {
			attributes: {
				'aria-label': (data) =>
					`actualmente ${data?.selectedFacet?.field === data?.facet.field ? 'colapsado' : 'abierto'} el menú desplegable del filtro ${
						data?.facet.field
					} ${(data?.facet as ValueFacet).values?.length ? (data?.facet as ValueFacet).values?.length + ' opciones' : ''}`,
			},
		},
	},
	filterSummary: {
		title: {
			value: 'Filtros actuales',
		},
		clearAllLabel: {
			value: 'Borrar Todo',
		},
	},
	facet: {
		showMoreText: {
			value: 'ver más',
		},
		showLessText: {
			value: 'ver menos',
		},
		clearAllText: {
			value: 'borrar todo',
		},
		dropdownButton: {
			attributes: {
				'aria-label': (data) =>
					`actualmente ${data?.facet?.collapsed ? 'colapsado' : 'abierto'} el menú desplegable del filtro ${data?.facet.label} ${
						(data?.facet as ValueFacet).values?.length ? (data?.facet as ValueFacet).values.length + ' opciones' : ''
					}`,
			},
		},
	},
	select: {
		buttonLabel: {
			attributes: {
				'aria-label': (data) =>
					`${data?.label} menú desplegable, ${data?.options.length} opciones ${
						data?.selectedOptions.length ? `, opción actualmente seleccionada: ${data?.selectedOptions[0].label}` : ''
					}`,
			},
		},
	},
	radio: {
		radio: {
			attributes: {
				'aria-label': (data) => `${data?.disabled ? 'deshabilitado' : ''} ${data?.checkedState ? 'seleccionado' : 'no seleccionado'} botón de radio`,
			},
		},
	},
	pagination: {
		previous: {
			attributes: {
				'aria-label': 'Página anterior',
			},
		},
		next: {
			attributes: {
				'aria-label': 'Siguiente página',
			},
		},
		first: {
			attributes: {
				'aria-label': 'Primera página',
			},
		},
		last: {
			attributes: {
				'aria-label': (data) => `Ir a la página anterior ${data?.pagination.last.number}`,
			},
		},
		page: {
			attributes: {
				'aria-label': (data) => `ir a la página ${data?.page.number}`,
			},
		},
	},
	paginationInfo: {
		infoText: {
			value: (data) =>
				`${data?.pagination?.multiplePages ? `${data?.pagination?.begin} - ${data?.pagination?.end} de` : ''} ${
					data?.pagination?.totalResults
				} resultado${data?.pagination?.totalResults == 1 ? '' : 's'}`,
			attributes: {
				'aria-label': (data) =>
					`mostrando ${data?.pagination?.multiplePages ? `${data?.pagination?.begin} - ${data?.pagination?.end} de` : ''} ${
						data?.pagination?.totalResults
					} resultado${data?.pagination?.totalResults == 1 ? '' : 's'}`,
			},
		},
	},
	loadMore: {
		loadMoreButton: {
			attributes: {
				'aria-label': 'Cargar más',
			},
		},
		progressText: {
			value: (data) => `Has visto ${data?.pagination?.end} de ${data?.pagination?.totalResults} productos`,
		},
	},
	grid: {
		showMoreText: {
			value: (data) => `+ ${data?.remainder}`,
		},
		showLessText: {
			value: 'Menos',
		},
	},
	filter: {
		filter: {
			attributes: {
				'aria-label': (data) => `${!data?.label ? data?.value || '' : `eliminar filtro seleccionado ${data?.label} ${data?.value}`}`,
			},
		},
	},
	facetSlider: {
		sliderHandle: {
			attributes: {
				'aria-label': (data) => `Deslizador de ${data?.facet.label}`,
				'aria-valuetext': (data) =>
					`Deslizador de ${data?.facet.label}, valor actual ${data?.value}, ${
						data?.facet.range?.low ? `valor mínimo ${data?.facet.range?.low},` : ''
					} ${data?.facet.range?.high ? `valor máximo ${data?.facet.range?.high}` : ''}`,
			},
		},
	},
	facetPaletteOptions: {
		paletteOption: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value.filtered
							? `eliminar filtro seleccionado ${data?.facet?.label || ''} - ${data?.value.label}`
							: data?.facet?.label
							? `filtrar por ${data?.facet?.label} - ${data?.value.label}`
							: `filtrar por ${data?.value.label}`
					}`,
			},
		},
	},
	facetListOptions: {
		listOption: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value.filtered
							? `eliminar filtro seleccionado ${data?.facet?.label || ''} - ${data?.value.label}`
							: data?.facet?.label
							? `filtrar por ${data?.facet?.label} - ${data?.value.label}`
							: `filtrar por ${data?.value.label}`
					}`,
			},
		},
		checkbox: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value.filtered
							? `eliminar filtro seleccionado ${data?.facet?.label || ''} - ${data?.value.label}`
							: data?.facet?.label
							? `filtrar por ${data?.facet?.label} - ${data?.value.label}`
							: `filtrar por ${data?.value.label}`
					}`,
			},
		},
	},
	facetHierarchyOptions: {
		hierarchyOption: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value.filtered
							? `eliminar filtro seleccionado ${data?.facet?.label || ''} - ${data?.value.label}`
							: data?.facet?.label
							? `filtrar por ${data?.facet?.label} - ${data?.value.label}`
							: `filtrar por ${data?.value.label}`
					}`,
			},
		},
	},
	facetGridOptions: {
		gridOption: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value.filtered
							? `eliminar filtro seleccionado ${data?.facet?.label || ''} - ${data?.value.label}`
							: data?.facet?.label
							? `filtrar por ${data?.facet?.label} - ${data?.value.label}`
							: `filtrar por ${data?.value.label}`
					}`,
			},
		},
	},
	errorHandler: {
		warningText: {
			value: `<b>Advertencia:&nbsp;</b>`,
		},
		infoText: {
			value: `<b>Información:&nbsp;</b>`,
		},
		errorText: {
			value: `<b>Error:&nbsp;</b>`,
		},
		reloadText: {
			value: `Recargar`,
		},
	},
	checkbox: {
		checkbox: {
			attributes: {
				'aria-label': (data) =>
					`${data?.disabled ? 'deshabilitado' : ''} ${data?.checkedState ? 'seleccionado' : 'no seleccionado'} casilla de verificación`,
			},
		},
	},
	// toggle: {
	// 	toggleSwitch: {
	// 		attributes: {
	// 			'aria-label': (data) =>
	// 				`actualmente ${data?.toggledState ? 'seleccionado' : 'no seleccionado'} interruptor ${
	// 					data?.label ? `para ${data?.label}` : ''
	// 				}`,
	// 		},
	// 	},
	// },
	// terms: {
	// 	term: {
	// 		value: (data) => `${data?.term.value}`,
	// 		attributes: {
	// 			'aria-label': (data) => `elemento ${(data?.index || 0) + 1} de ${data?.numberOfTerms}, ${data?.term.value}`,
	// 		},
	// 	},
	// },
	searchHeader: {
		titleText: {
			value: (data) => {
				return `Mostrando resultado${data?.pagination?.totalResults == 1 ? '' : 's'} 
                ${data?.search?.query ? `para <span class="ss__search-header__results-query">"${data?.search?.query?.string}"</span>` : ''}`;
			},
			attributes: {
				'aria-label': (data) => `Mostrando ahora ${data?.pagination?.totalResults} artículos en la cuadrícula de productos`,
			},
		},
		correctedQueryText: {
			value: (data) => {
				return `No se encontraron resultados para <em>"${data?.search?.originalQuery?.string}"</em>, mostrando resultados para <em>"${data?.search?.query?.string}"</em> en su lugar.`;
			},
			attributes: {
				'aria-label': (data) =>
					`No se encontraron resultados para ${data?.search?.originalQuery?.string}, mostrando resultados para ${data?.search?.query?.string} en su lugar`,
			},
		},
		noResultsText: {
			value: (data) => {
				return `${
					data?.search?.query
						? `<span>
                    No se encontraron resultados para <span class="ss__search-header__results-query">"${data?.search?.query?.string}"</span>.
                </span>`
						: `<span>No se encontraron resultados.</span>`
				}`;
			},
			attributes: {
				'aria-label': (data) => `No se encontraron resultados para ${data?.search?.query?.string}`,
			},
		},
		didYouMeanText: {
			value: (data) => {
				return `¿Quiso decir <a href=${data?.search?.didYouMean?.url.href}>${data?.search?.didYouMean?.string}</a>?`;
			},
		},
		expandedSearchText: {
			value: (data) => {
				return `No pudimos encontrar una coincidencia exacta para "<span className="ss__search-header__results-query">${data?.search?.query?.string}</span>", pero aquí hay algo similar:`;
			},
		},
	},
	noResults: {
		suggestionsTitleText: {
			value: `Sugerencias`,
		},
		suggestionsList: {
			value:
				'<ul className="ss__no-results__suggestions__list"><li className="ss__no-results__suggestions__list__option">Verifica si hay errores de ortografía.</li><li className="ss__no-results__suggestions__list__option">Elimina palabras clave redundantes (ej. "productos").</li><li className="ss__no-results__suggestions__list__option">Usa otros términos para describir lo que estás buscando.</li></ul>',
		},
		contactsTitleText: {
			value: `¿Aún no encuentras lo que buscas? <a href="/contact-us">Contáctanos</a>.`,
		},
		contactsList: {
			value: `<div className='ss__no-results__contact__detail'>
                        <h4 className="ss__no-results__contact__detail__title">Dirección</h4>
                        <p className="ss__no-results__contact__detail__content">123 Calle Dirección, Ciudad, Estado, Código Postal</p>
                    </div>
                    <div className='ss__no-results__contact__detail'>
                        <h4 className="ss__no-results__contact__detail__title">Horario</h4>
                        <p className="ss__no-results__contact__detail__content">Lunes a Sábado, 00:00am - 00:00pm Domingo, 00:00am - 00:00pm</p>
                    </div>
                    <div className='ss__no-results__contact__detail'>
                        <h4 className="ss__no-results__contact__detail__title">Teléfono</h4>
                        <p className="ss__no-results__contact__detail__content"><a href="tel:1234567890">123-456-7890</a></p>
                    </div>
                    <div className='ss__no-results__contact__detail'>
                        <h4 className="ss__no-results__contact__detail__title">Correo Electrónico</h4>
                        <p className="ss__no-results__contact__detail__content"><a href="mailto:email@site.com">email@site.com</a></p>
                    </div>`,
		},
	},
};
