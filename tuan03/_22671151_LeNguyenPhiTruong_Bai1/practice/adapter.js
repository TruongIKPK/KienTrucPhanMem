// Adapter Pattern demo: adapt XML-oriented service to JSON target interface.

class JsonTarget {
  sendJson(_payload) {
    throw new Error("sendJson() must be implemented");
  }
}

class JsonWebService extends JsonTarget {
  sendJson(payload) {
    console.log("[JsonWebService] received JSON:", JSON.stringify(payload));
    return {
      status: "ok",
      acceptedFormat: "json",
      data: payload,
    };
  }
}

class XmlLegacySystem {
  sendXml(xmlString) {
    console.log("[XmlLegacySystem] processing XML:", xmlString);
    return `<response><status>ok</status><echo>${xmlString}</echo></response>`;
  }
}

class XmlJsonAdapter extends JsonTarget {
  constructor(xmlService) {
    super();
    this.xmlService = xmlService;
  }

  static objectToXml(obj, rootTag = "request") {
    const fields = Object.entries(obj)
      .map(([key, value]) => `<${key}>${String(value)}</${key}>`)
      .join("");
    return `<${rootTag}>${fields}</${rootTag}>`;
  }

  static xmlToSimpleJson(xml) {
    // Very small parser for demo input shape.
    const statusMatch = xml.match(/<status>(.*?)<\/status>/);
    const echoMatch = xml.match(/<echo>(.*?)<\/echo>/);
    return {
      status: statusMatch ? statusMatch[1] : "unknown",
      echo: echoMatch ? echoMatch[1] : "",
      sourceFormat: "xml",
    };
  }

  sendJson(payload) {
    const xmlRequest = XmlJsonAdapter.objectToXml(payload, "request");
    const xmlResponse = this.xmlService.sendXml(xmlRequest);
    return XmlJsonAdapter.xmlToSimpleJson(xmlResponse);
  }

  sendXmlAsJson(xmlString) {
    const xmlResponse = this.xmlService.sendXml(xmlString);
    return XmlJsonAdapter.xmlToSimpleJson(xmlResponse);
  }
}

function runAdapterDemo(logger = console.log) {
  const lines = [];
  const log = (...args) => {
    const line = args
      .map((item) => (typeof item === "string" ? item : JSON.stringify(item, null, 2)))
      .join(" ");
    lines.push(line);
    logger(...args);
  };

  const originalConsoleLog = console.log;
  console.log = (...args) => log(...args);

  log("\n=== Adapter Demo: XML <-> JSON ===");

  const jsonService = new JsonWebService();
  const responseA = jsonService.sendJson({ id: 1, action: "ping" });
  log("Direct JSON response:", responseA);

  const xmlLegacy = new XmlLegacySystem();
  const adapter = new XmlJsonAdapter(xmlLegacy);

  const responseB = adapter.sendJson({ id: 2, action: "sync" });
  log("Adapted response from XML system:", responseB);

  console.log = originalConsoleLog;
  return lines.join("\n");
}

module.exports = {
  runAdapterDemo,
  JsonTarget,
  JsonWebService,
  XmlLegacySystem,
  XmlJsonAdapter,
};

if (require.main === module) {
  runAdapterDemo();
}
