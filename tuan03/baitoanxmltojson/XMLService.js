class XMLService {
	constructor(initialXml = "<root><name>Demo</name><age>30</age></root>") {
		this.xml = initialXml;
	}

	getData() {
		return this.xml;
	}

	sendData(xml) {
		this.xml = xml;
		console.log("XML sent:");
		console.log(xml);
	}
}

module.exports = XMLService;
