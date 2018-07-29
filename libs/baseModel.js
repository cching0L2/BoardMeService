module.exports = function baseModel (schema, options = {}) {
    let noSetFielids = ['createdAt']
    let privateFields = ['__v']

    if (Array.isArray(options.private)) privateFields.push(...options.private)

    schema.static.sanitize = function sanitize (objToSanitize = {}, additionalFields = []) {
        noSetFields.concat(additionalFields).forEach((fieldPath) => {
            delete objToSanitize[fieldPath]
        })
    }

    if (!schema.options.toJSON) schema.options.toJSON = {}
    schema.options.toJSON.transform = function transformToObject (doc, plainObj) {
        if (!plainObj.id && plainObj._id) plainObj.id = plainObj._id

        privateFields.forEach((fieldPath) => {
            delete plainObj[fieldPath]
        })

        return plainObj
    }
}