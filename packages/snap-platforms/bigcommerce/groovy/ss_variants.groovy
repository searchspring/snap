/*
  Snap variants script for BigCommerce
  
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
  When using this in Snap any properties found in `mappings.core` and `attributes` will be "masked" via result.display when the variant is selected.
  See Snap documentation for more details.
  
*/

import groovy.json.JsonOutput
import groovy.json.JsonSlurper

def slurper = new JsonSlurper()

/* map variants_json -> variants structure and put into array */
def variant_array = []

// variant data to put into core fields
def core_fields_mapping = [
  uid: "product_id",
  price: "calculated_price",
  msrp: "retail_price",
  sku: "child_sku",
  imageUrl: 'image_url',
  thumbnailImageUrl: 'image_url',
]

// attributes outside of the options
def attributes_fields_mapping = [
  quantity: "inventory_level",  // property must be named "quantity" for proper functionality
]

def sku_options_by_id = [:];
/*
  sku_options_by_id = {
    [id: string]: option[],  // all options in this array have the same sku_option.id
  }
*/

if (doc?.child_sku_options && Objects.nonNull(doc?.child_sku_options)) {
  def sku_options = slurper.parseText(doc.child_sku_options as String)

  // build out map of sku_options_by_id options - options are grouped together by sku_option.id
  if(Objects.nonNull(sku_options) && !(sku_options as List).isEmpty()) {
    sku_options.each { sku_option ->
      sku_options_by_id[sku_option.id] = sku_options_by_id[sku_option.id] ?: [];
      sku_options_by_id[sku_option.id].push(sku_option);
    }
  }

  // use sku_options_by_id map to poppulate variant_array
  sku_options_by_id.each { id, options ->
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

    // loop through each option_array
    options.each { option ->
      /* populate core mappings */
      core_fields_mapping.each { core_field_name, variant_field_name ->
        if (option[variant_field_name] && Objects.nonNull(option[variant_field_name])) {
          variant_object.mappings.core[core_field_name] = option[variant_field_name]
        }
      }

      /* populate attributes */
      attributes_fields_mapping.each { attribute_field_name, variant_field_name ->
        if (option[variant_field_name] && Objects.nonNull(option[variant_field_name])) {
          variant_object.attributes[attribute_field_name] = option[variant_field_name]
        }
      }

      // determine availability
      if (option.inventory_level > 0 && !option.purchasing_disabled) {
        variant_object.attributes.available = true
      } else {
        variant_object.attributes.available = false
      }

      /* populate options */
      if (option.option && option.value && option.option_id && option.option_value_id) {
        variant_object.options[option.option] = [
          value: option.value,
          optionValue: option.option_value_id,
          optionId: option.option_id,
        ]
      }
    }

    variant_array.push(variant_object);
  }
}

index.ss_variants = JsonOutput.toJson(variant_array)