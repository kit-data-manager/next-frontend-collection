let contentModel = {
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "type": "object",
  "headerTemplate": "Data Resource {{#if self.id}} #{{ self.id }} {{else}} (New) {{/if}}",
  "required": [
    "relativePath"
  ],
  "format": "categories",
  "properties": {
    "id": {
      "type": "integer",
      "readOnly": true,
      "default": null,
      "options": {
        "hidden": true
      }
    },
    "parentResource": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        }
      },
      "readOnly": true,
      "options": {
        "hidden": true,
        "visible": false
      }
    },
    "relativePath": {
      "type": "string"
    },
    "version": {
      "type": "integer",
      "readOnly": true
    },
    "fileVersion": {
      "type": "string",
      "readOnly": true
    },
    "versioningService": {
      "type": "string",
      "readOnly": true
    },
    "uploader": {
      "type": "string"
    },
    "mediaType": {
      "type": "string"
    },
    "hash": {
      "type": "string"
    },
    "size": {
      "type": "integer"
    },
    "metadata": {
      "type": "object"
    },
    "tags": {
      "type": "array",
      "items": {}
    },
    "filename": {
      "type": "string"
    }
  }
}
