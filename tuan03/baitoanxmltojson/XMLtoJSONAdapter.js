class XMLtoJSONAdapter {
  constructor(xmlService, rootTag = "root") {
    this.xmlService = xmlService;
    this.rootTag = rootTag;
  }

  // Parse flat XML into a plain object (demo-friendly, not full XML support)
  parseXml(xml) {
    const rootMatch = xml.match(/<([^!?\s>]+)[^>]*>([\s\S]*)<\/\1>/);
    const body = rootMatch ? rootMatch[2] : xml;
    const result = {};

    const tagRegex = /<([A-Za-z0-9_:-]+)>([^<>]*)<\/\1>/g;
    let match;
    while ((match = tagRegex.exec(body)) !== null) {
      const [, tag, value] = match;
      const num = Number(value);
      result[tag] = Number.isNaN(num) ? value : num;
    }

    return result;
  }

  // Build flat XML from a plain object using the configured root tag
  buildXml(json) {
    const entries = Object.entries(json)
      .map(([key, value]) => `  <${key}>${value}</${key}>`)
      .join("\n");

    return `<${this.rootTag}>\n${entries}\n</${this.rootTag}>`;
  }

  // XML → JSON
  getData() {
    const xml = this.xmlService.getData();
    return this.parseXml(xml);
  }

  // JSON → XML
  sendData(json) {
    const xml = this.buildXml(json);
    this.xmlService.sendData(xml);
  }
}

module.exports = XMLtoJSONAdapter;