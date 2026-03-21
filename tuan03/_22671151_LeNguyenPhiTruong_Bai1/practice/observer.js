// Observer Pattern demo: stock updates and task status updates.

class Subject {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    this.observers = this.observers.filter((item) => item !== observer);
  }

  notify(event) {
    for (const observer of this.observers) {
      observer.update(event);
    }
  }
}

class StockSubject extends Subject {
  constructor(symbol, price) {
    super();
    this.symbol = symbol;
    this.price = price;
  }

  setPrice(newPrice) {
    const oldPrice = this.price;
    this.price = newPrice;
    this.notify({
      type: "STOCK_PRICE_CHANGED",
      symbol: this.symbol,
      oldPrice,
      newPrice,
      timestamp: new Date().toISOString(),
    });
  }
}

class InvestorObserver {
  constructor(name) {
    this.name = name;
  }

  update(event) {
    if (event.type === "STOCK_PRICE_CHANGED") {
      console.log(
        `[Investor ${this.name}] ${event.symbol}: ${event.oldPrice} -> ${event.newPrice} at ${event.timestamp}`
      );
    }
  }
}

class TaskSubject extends Subject {
  constructor(taskName, status) {
    super();
    this.taskName = taskName;
    this.status = status;
  }

  setStatus(newStatus) {
    const oldStatus = this.status;
    this.status = newStatus;
    this.notify({
      type: "TASK_STATUS_CHANGED",
      taskName: this.taskName,
      oldStatus,
      newStatus,
      timestamp: new Date().toISOString(),
    });
  }
}

class TeamMemberObserver {
  constructor(name) {
    this.name = name;
  }

  update(event) {
    if (event.type === "TASK_STATUS_CHANGED") {
      console.log(
        `[Team ${this.name}] Task "${event.taskName}": ${event.oldStatus} -> ${event.newStatus} at ${event.timestamp}`
      );
    }
  }
}

function runObserverDemo(logger = console.log) {
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

  log("\n=== Observer Demo: Stock ===");
  const stock = new StockSubject("AAPL", 180);
  const investorA = new InvestorObserver("Alice");
  const investorB = new InvestorObserver("Bob");

  stock.attach(investorA);
  stock.attach(investorB);

  stock.setPrice(182);
  stock.setPrice(177);

  stock.detach(investorB);
  stock.setPrice(185);

  log("\n=== Observer Demo: Task ===");
  const task = new TaskSubject("Implement Adapter", "Todo");
  const dev = new TeamMemberObserver("Developer");
  const qa = new TeamMemberObserver("QA");

  task.attach(dev);
  task.attach(qa);

  task.setStatus("In Progress");
  task.setStatus("Done");

  console.log = originalConsoleLog;
  return lines.join("\n");
}

module.exports = {
  runObserverDemo,
  Subject,
  StockSubject,
  InvestorObserver,
  TaskSubject,
  TeamMemberObserver,
};

if (require.main === module) {
  runObserverDemo();
}
