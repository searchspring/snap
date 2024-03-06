export function afterSearch(controller: AbstractController) {
	controller.on('afterSearch', async ({ response }: any, next) => {
		mutateResults(response.results);
		await next();
	});
}

function mutateResults(results: SearchResultsStore) {
	for (const result of results) {
		result.attributes['ss_variants'] = `[
			{
				"mappings": {
					"core": {
						"price": 200,
						"sku": "172772-blue-l",
						"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/208_9029_copyright_reddressboutique_2016_large.jpg"
					}
				},
				"attributes": {
					"other_thing": "here",
					"available": true
				},
				"options": {
					"size": "small",
					"color": "blue",
					"height": "22"
				}
			},
			{
				"mappings": {
					"core": {
						"price": 2200,
						"sku": "172772-blue-l-12",
						"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/208_9029_copyright_reddressboutique_2016_large.jpg"
					}
				},
				"attributes": {
					"length": "12",
					"other_thing": "here",
					"available": true
				},
				"options": {
					"size": "medium",
					"color": "blue",
					"height": "22"
				}
			},
			{
				"mappings": {
					"core": {
						"price": 22200,
						"sku": "172772-blue-l-15",
						"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/208_9029_copyright_reddressboutique_2016_large.jpg"
					}
				},
				"attributes": {
					"length": "15",
					"other_thing": "here",
					"available": true
				},
				"options": {
					"size": "medium",
					"color": "blue",
					"height": "25"
				}
			},
			{
				"mappings": {
					"core": {
						"price": 230,
						"sku": "172772-blue-m",
						"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/208_9029_copyright_reddressboutique_2016_large.jpg"
					}
				},
				"attributes": {
					"other_thing": "here",
					"available": true
				},
				"options": {
					"size": "medium",
					"color": "blue",
					"height": "21"
				}
			},
			{
				"mappings": {
					"core": {
						"price": 2040,
						"sku": "172772-blue-s",
						"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/208_9029_copyright_reddressboutique_2016_large.jpg"
					}
				},
				"attributes": {
					"other_thing": "here",
					"available": true
				},
				"options": {
					"size": "small",
					"color": "blue",
					"height": "21"
				}
			},
			{
				"mappings": {
					"core": {
						"price": 100,
						"sku": "172772-red-s",
						"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/46_8189_copyright_reddressboutique_2016_copy_large.jpg"
					}
				},
				"attributes": {
					"other_thing": "here",
					"available": false
				},
				"options": {
					"size": "small",
					"color": "red",
					"height": "11"
				}
			},
			{
				"mappings": {
					"core": {
						"price": 120,
						"sku": "172772-red-m",
						"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/46_8189_copyright_reddressboutique_2016_copy_large.jpg"
					}
				},
		
				"attributes": {
					"other_thing": "here",
					"available": false
				},
				"options": {
					"size": "medium",
					"color": "red",
					"height": "222"
				}
			},
			{
				"mappings": {
					"core": {
						"price": 130,
						"sku": "172772-red-l",
						"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/46_8189_copyright_reddressboutique_2016_copy_large.jpg"
					}
				},
		
				"attributes": {
					"other_thing": "here",
					"available": false
				},
				"options": {
					"size": "large",
					"color": "red",
					"height": "10"
				}
			},
			{
				"mappings": {
					"core": {
						"price": 120,
						"sku": "172772-black-m",
						"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/844a0547_1_large.jpg"
					}
				},
		
				"attributes": {
					"other_thing": "here",
					"available": true
				},
				"options": {
					"height": "21",
					"size": "medium",
					"color": "black"
				}
			},
			{
				"mappings": {
					"core": {
						"price": 120,
						"sku": "172772-black-m",
						"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/844a0547_1_large.jpg"
					}
				},
		
				"attributes": {
					"other_thing": "here",
					"available": true
				},
				"options": {
					"height": "22",
					"size": "small",
					"color": "black"
				}
			},
			{
				"mappings": {
					"core": {
						"price": 130,
						"sku": "172772-black-l",
						"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/844a0547_1_large.jpg"
					}
				},
		
				"attributes": {
					"other_thing": "here",
					"available": true
				},
				"options": {
					"height": "21",
					"size": "large",
					"color": "black"
				} 
			},
			{
				"mappings": {
					"core": {
						"price": 130,
						"sku": "172772-black-l",
						"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/844a0547_1_large.jpg"
					}
				},
		
				"attributes": {
					"other_thing": "here",
					"available": true
				},
				"options": {
					"height": "22",
					"size": "large",
					"color": "black"
				} 
			}
		]`;
	}
}
