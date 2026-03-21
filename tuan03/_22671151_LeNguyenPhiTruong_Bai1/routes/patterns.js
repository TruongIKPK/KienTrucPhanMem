var express = require('express');
var fs = require('fs');
var path = require('path');

var router = express.Router();

var runCompositeDemo = require('../practice/composite').runCompositeDemo;
var runObserverDemo = require('../practice/observer').runObserverDemo;
var runAdapterDemo = require('../practice/adapter').runAdapterDemo;

var diagrams = {
  composite: [
    'classDiagram',
    '    class Component {',
    '      <<interface>>',
    '      +display(indent)',
    '    }',
    '    class FileLeaf',
    '    class FolderComposite',
    '    Component <|.. FileLeaf',
    '    Component <|.. FolderComposite',
    '    FolderComposite o-- Component : contains',
  ].join('\n'),
  observer: [
    'classDiagram',
    '    class Subject {',
    '      +attach(observer)',
    '      +detach(observer)',
    '      +notify(event)',
    '    }',
    '    class Observer {',
    '      +update(event)',
    '    }',
    '    class StockSubject',
    '    class InvestorObserver',
    '    Subject <|-- StockSubject',
    '    Observer <|-- InvestorObserver',
    '    StockSubject o-- Observer',
  ].join('\n'),
  adapter: [
    'classDiagram',
    '    class JsonTarget {',
    '      +sendJson(payload)',
    '    }',
    '    class XmlLegacySystem {',
    '      +sendXml(xmlString)',
    '    }',
    '    class XmlJsonAdapter {',
    '      +sendJson(payload)',
    '    }',
    '    JsonTarget <|.. XmlJsonAdapter',
    '    XmlJsonAdapter --> XmlLegacySystem',
  ].join('\n'),
  integration: [
    'flowchart LR',
    '    A[Composite\\nTree Management] --> B[Observer\\nChange Notification]',
    '    A --> C[Adapter\\nData Transformation]',
    '    B --> C',
  ].join('\n'),
};

var modules = [
  {
    name: 'Composite',
    icon: 'Tree',
    summary: 'Quan ly cau truc cay cho thu muc, tap tin, va UI component tree.',
    cases: ['Folder - File tree', 'UI components grouping'],
  },
  {
    name: 'Observer',
    icon: 'Bell',
    summary: 'Thong bao tu dong den cac doi tuong dang ky khi state thay doi.',
    cases: ['Stock price notification', 'Task status notification'],
  },
  {
    name: 'Adapter',
    icon: 'Plug',
    summary: 'Lam cau noi giua he thong XML legacy va web service JSON.',
    cases: ['XML -> JSON request', 'XML response -> JSON output'],
  },
];

router.get('/', function(req, res, next) {
  try {
    var docsPath = path.join(__dirname, '..', 'practice', 'design-patterns.md');
    var diagramsDoc = fs.existsSync(docsPath)
      ? fs.readFileSync(docsPath, 'utf8')
      : 'Diagram document not found at practice/design-patterns.md';

    var silentLogger = function() {};
    var compositeOutput = runCompositeDemo(silentLogger);
    var observerOutput = runObserverDemo(silentLogger);
    var adapterOutput = runAdapterDemo(silentLogger);

    res.render('patterns', {
      title: 'Design Patterns Studio',
      diagramsDoc: diagramsDoc,
      compositeOutput: compositeOutput,
      observerOutput: observerOutput,
      adapterOutput: adapterOutput,
      modules: modules,
      diagrams: diagrams,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
