/* 
  Snap variants script for Magento2
  
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
import org.apache.commons.lang.StringUtils


def slurper = new JsonSlurper()

def imageUrls = [:]
if (Objects.nonNull(doc.swatch_json_data) && !StringUtils.isEmpty(doc.swatch_json_data as String)) {
  def swatchData = slurper.parseText(doc.swatch_json_data as String)
  if (Objects.nonNull(swatchData)) {
    swatchData.each { imageData ->
      if (Objects.nonNull(imageData?.color) && Objects.nonNull(imageData?.image)) {
        imageUrls.put(imageData?.color, imageData?.image)
      }
    }
  }
}

if (Objects.nonNull(doc.json_config) && !StringUtils.isEmpty(doc.json_config as String)) {
  def jsonConfig = slurper.parseText(doc.json_config as String)
  def ss_swatches = []

  if (Objects.nonNull(jsonConfig?.attributes)) {
    def productIds = []
    jsonConfig.attributes*.value*.options*.products?.each { rawProductIds ->
      if (Objects.nonNull(rawProductIds)) {
        rawProductIds.each {
          if (Objects.nonNull(it)) {
            productIds.addAll(it)
          }
        }
      }
    }
    productIds = productIds?.unique()

    productIds.each { uniqueProductId ->
      def productId = uniqueProductId
      def ss_variants = [:]
      def options = [:]

      def colour = null
      def size = null
      def colourAttributeId = null
      def colourOptionId = null
      def sizeAttributeId = null
      def sizeOptionId = null
      jsonConfig?.attributes?.each { attribute ->
        if (Objects.nonNull(attribute?.value?.code)) {
          def isColour = attribute?.value?.code == "colour"
          def optionData = [:]

          optionData.put("attributeId", attribute?.key)

          if (Objects.nonNull(attribute?.value?.options) && !(attribute?.value?.options as List).isEmpty()) {
            (attribute?.value?.options as List).each { attributeSubOption ->
              if (Objects.nonNull(attributeSubOption?.products) && (attributeSubOption?.products as List).contains(productId)) {
                if (isColour) {
                  colour = attributeSubOption?.label
                  colourAttributeId = attribute?.key
                  colourOptionId = attributeSubOption?.id
                } else {
                  size = attributeSubOption?.label
                  sizeAttributeId = attribute?.key
                  sizeOptionId = attributeSubOption?.id
                }
                optionData.put("value", attributeSubOption?.label)
                optionData.put("optionId", attributeSubOption?.id)
              }
            }
          }
          options.put(attribute?.value?.code, optionData)
        }
      }

      def core = [:]

      if (colourAttributeId && colourOptionId && sizeOptionId && sizeAttributeId) {
        core.put("url", doc?.url + "#" + colourAttributeId + "=" + colourOptionId + "&" + sizeAttributeId + "=" + sizeOptionId)
      }

      if (Objects.nonNull(colour) && Objects.nonNull(imageUrls?.get(colour))) {
        core.put("imageUrl", imageUrls?.get(colour))
      }

      core.put("uid", uniqueProductId)
      def mappings = [:]
      mappings.put("core", core)

      ss_variants.put("mappings", mappings)

      def attributes = [:]
      attributes.put("available", true)
      if (Objects.nonNull(colour) && Objects.nonNull(size)) {
        attributes.put("title", "$colour / $size")
      }
      ss_variants.put("attributes", attributes)
      ss_variants.put("options", options)
      ss_swatches.add(ss_variants)
    }

    index.ss_variants = JsonOutput.toJson(ss_swatches)
  }
}