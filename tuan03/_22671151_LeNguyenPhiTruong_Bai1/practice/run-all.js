const { runCompositeDemo } = require("./composite");
const { runObserverDemo } = require("./observer");
const { runAdapterDemo } = require("./adapter");

function runAll() {
  console.log("Design Patterns Practice Runner");
  console.log("--------------------------------");

  runCompositeDemo();
  runObserverDemo();
  runAdapterDemo();
}

runAll();
