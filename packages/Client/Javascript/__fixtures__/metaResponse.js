export default {
	data: {
		"facets": {
			"color_family": {
				"display": "palette",
				"label": "Color",
				"multiple": "multiple-union",
				"collapse": true
			},
			"ss_category_hierarchy": {
				"display": "hierarchy",
				"label": "Category",
				"multiple": "single",
				"collapse": false
			},
			"price": {
				"display": "list",
				"label": "Price",
				"multiple": "single",
				"collapse": true
			},
			"size": {
				"display": "grid",
				"label": "Size",
				"multiple": "multiple-intersect",
				"collapse": true
			},
			"on_sale": {
				"display": "list",
				"label": "On Sale",
				"multiple": "single",
				"collapse": true
			},
			"brand": {
				"display": "list",
				"label": "Brand",
				"multiple": "single",
				"collapse": true
			},
			"size_dress": {
				"display": "grid",
				"label": "Dress Size",
				"multiple": "single",
				"collapse": true
			},
			"material": {
				"display": "list",
				"label": "Material",
				"multiple": "single",
				"collapse": true
			},
			"season": {
				"display": "list",
				"label": "Season",
				"multiple": "single",
				"collapse": true
			},
			"pattern": {
				"display": "list",
				"label": "Pattern",
				"multiple": "single",
				"collapse": true
			},
			"dress_length_name": {
				"display": "list",
				"label": "Dress Length",
				"multiple": "multiple-union",
				"collapse": true
			},
			"saturation": {
				"display": "list",
				"label": "Color Intensity",
				"multiple": "single",
				"collapse": false
			},
			"size_pants": {
				"display": "list",
				"label": "Pant Size",
				"multiple": "single",
				"collapse": true
			}
		},
		"sortOptions": [{
			"field": "sales_rank",
			"direction": "desc",
			"label": "Most Popularz",
			"type": "field"
		}, {
			"field": "price",
			"direction": "desc",
			"label": "Price ($$$ - $)",
			"type": "field"
		}, {
			"field": "price",
			"direction": "asc",
			"label": "Price ($ - $S$)",
			"type": "field"
		}, {
			"field": "title",
			"direction": "asc",
			"label": "Name (A - Z)",
			"type": "field"
		}, {
			"field": "title",
			"direction": "desc",
			"label": "Name (Z - A)",
			"type": "field"
		}]
	}
}