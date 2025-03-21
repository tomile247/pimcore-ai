/*

    const messageBuilder = `
        I need real attribute values for product ${productNameInputField.value}.
        Please autofill next product attributes: ${requestedInputFields.join(', ')}
        Return data in json format without beautifying.
        Please do not return extra information about the product or questions or attributes I didn't mention.
        Return values only for provided attributes.
    `
    */

/*
    Provide the following attribute values for the product with EAN: 5414847462863 in JSON format, without formatting or additional text:
     - name
     - width (in mm, no measurement unit)
     - height
     - color (only black or white)
     - weight
    Return only the specified attributes. Do not include any extra product information, questions, or unspecified attributes.
*/