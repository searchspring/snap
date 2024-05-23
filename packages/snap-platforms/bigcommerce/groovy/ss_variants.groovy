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
  When using this in Snap any properties found in `mappings.core` and `attributes` will be "masked" when the variant is selected.
  See Snap documentation for more details.
  
*/

import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.apache.commons.lang.StringUtils

def slurper = new JsonSlurper()
def ss_variants = []

if (Objects.nonNull(doc?.child_sku_options) && !StringUtils.isEmpty(doc?.child_sku_options)) {
  def sku_options = slurper.parseText(doc.child_sku_options as String)
  if(Objects.nonNull(sku_options) && !(sku_options as List).isEmpty()){
    sku_options.each { sku_option ->
      def sku = [:]
      def mappings = [:]
      def core = [:]
      def attributes = [:]
      def option_data = [:]
      def options = [:]

      core.put("imageUrl" , sku_option?.image_url)
      core.put("url", doc.url)
      core.put("uid" ,sku_option.child_sku)
      mappings.put("core", core)
      sku.put("mappings",mappings)

      if(Objects.nonNull(sku_option?.inventory_level)){
        attributes.put("available", sku_option?.inventory_level > 0)
      }

      if(Objects.nonNull(sku_option?.option) && !StringUtils.isEmpty(sku_option?.option) && Objects.nonNull(sku_option?.value) && !StringUtils.isEmpty(sku_option?.value)){
        attributes.put("title", sku_option?.option + " / " + sku_option?.value)

      }
      sku.put("attributes",attributes)

      option_data.put("value", sku_option?.value)

      if(Objects.nonNull(sku_option?.option)){
        options.put(sku_option?.option, option_data)
      }

      sku.put("options",options)
      ss_variants.add(sku)
    }
  }
}

index.put("ss_variants", JsonOutput.toJson(ss_variants))