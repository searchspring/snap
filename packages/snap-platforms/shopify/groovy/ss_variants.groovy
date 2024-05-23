/* 
  Snap variants script for Shopify
  
  Generates a JSON string with format:
  ss_variants = [
    {
        attributes: { ... },
        mappings: { core: { ... } },
        options: {
            [optionName]: { value: '', ... }
        }
    }
  ]
  
  Each object (variant) in the array represents a variation of the product and each of the `options` should reflect that configuration.
  When using this in Snap any properties found in `mappings.core` and `attributes` will be "masked" when the variant is selected.
  See Snap documentation for more details.
  
*/

import groovy.json.JsonSlurper
import groovy.json.JsonOutput

/* CONFIGURATION */

// optional image to use if no variant image is found
def fallback_image = ''

// dimension modification for variant images
def shopify_image_dimension_suffix = ''
def shopify_thumbnail_dimension_suffix = ''


/* CODE */

// helper function to add a suffix to the Shopify images
def addImageSuffix = { img, suffix ->
	matcher = (img =~ /(.+)(\.(?:(?i)jpg|jpeg|gif|png|svg|webp|avif|heic).+)/)
	if (matcher) {
		return matcher[0][1] + "_" + suffix + matcher[0][2]
	} else {
		return img
	}
}

// JSON slurper
def slurper = new JsonSlurper()
def variants_json = slurper.parseText(doc.variants)
def options_json = slurper.parseText(doc.options)
def variant_images_json
try{
	variant_images_json = slurper.parseText(doc.variant_images_json)
} catch (err) {
	variant_images_json = []
}

/* create an options map and array from options_json */
def options_map = [:]

options_json.each { option ->
	def option_position_string = 'option' + option.position
	def option_name = option.name.toLowerCase().replace(' ', '_')
	options_map[option_position_string] = option_name
}

/* create an options_image_map from variant_images_json*/
def options_image_map = [:]

variant_images_json.each { variant_image ->
	def option_map_reference = options_image_map
	
	options_map.eachWithIndex { option_key, option, idx -> 
		def option_value = variant_image[option]
		if (idx + 1 == options_map.size()) {
			if ( option_value ) {
				option_map_reference[option_value] = variant_image.img
			}
		} else {
			if (!option_map_reference[option_value] && option_value) {
				option_map_reference[option_value] = [:]
			}
			if (option_value) {
				option_map_reference = option_map_reference[option_value]
			}
		}
	}
}

/* map variants_json -> variants structure and put into array */
def variant_array = []

// variant data to put into core fields
def core_fields_mapping = [
	uid: "id",
	msrp: "compare_at_price",
	price: "price",
	sku: "sku",
]

// attributes outside of the options
def attributes_fields_mapping = [
	quantity: "inventory_quantity",  // property must be named "quantity" for proper functionality
	title: "title",
]

variants_json.each { variant ->
	def variant_object = [:]
	variant_object.mappings = [:]
	variant_object.mappings.core = [:]
	variant_object.attributes = [:]
	variant_object.options = [:]

	// convert into a variant object
	/*
		{
			"mappings": {
				"core": { ... }
			},
			"attributes": {
				...
			}
		}
	*/

	/* populate core mappings */
	core_fields_mapping.each { core_field_name, variant_field_name ->
		variant_object.mappings.core[core_field_name] = variant[variant_field_name]
	}
	// add variant URL to core fields
	variant_object.mappings.core.url = "/products/" + doc.handle + "?variant=" + variant.id
	// add image core fields if an image if found for the variant
	def option_path = [variant.option1, variant.option2, variant.option3]

	def variant_image_reference = options_image_map
	option_path.each { option ->
		try { 
			if (option && variant_image_reference[option]) {
				variant_image_reference = variant_image_reference[option]
			}
		} catch (err) {
			variant_image_reference = variant_image_reference
		}
	}

	// image found in mapping
	if (variant_image_reference && variant_image_reference instanceof String) {
		variant_object.mappings.core.imageUrl = variant_image_reference
		variant_object.mappings.core.thumbnailImageUrl = variant_image_reference

		// add image suffix
		if (shopify_image_dimension_suffix) {
			variant_object.mappings.core.imageUrl = addImageSuffix(variant_image_reference, shopify_image_dimension_suffix)
		}
		// add thumbnail image suffix
		if (shopify_thumbnail_dimension_suffix) {
			variant_object.mappings.core.thumbnailImageUrl = addImageSuffix(variant_image_reference, shopify_thumbnail_dimension_suffix)
		}
	} else if (fallback_image) {
		variant_object.mappings.core.imageUrl = fallback_image
		variant_object.mappings.core.thumbnailImageUrl = fallback_image
	}

	/* populate attributes */
	attributes_fields_mapping.each { attribute_field_name, variant_field_name ->
		variant_object.attributes[attribute_field_name] = variant[variant_field_name]
	}

	// determine availability
	if (variant.inventory_policy == "continue" || variant.inventory_management == "null" || (variant.inventory_policy == "deny" && variant.inventory_quantity > 0)) {
		variant_object.attributes.available = true
	} else {
		variant_object.attributes.available = false
	}
	
	/* populate options */
	options_map.each { option_number, option_name ->
		if(variant[option_number]) {
			variant_object.options[option_name] = [
			    value: variant[option_number]
		    ]
		}
	}

	// add variant object to the array
	variant_array.push(variant_object)
}

index.ss_variants = JsonOutput.toJson(variant_array)