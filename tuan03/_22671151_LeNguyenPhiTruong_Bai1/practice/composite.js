// Composite Pattern demo: file system tree and UI tree.

class Component {
  display(_indent = 0) {
    throw new Error("display() must be implemented");
  }
}

class FileLeaf extends Component {
  constructor(name, sizeKB) {
    super();
    this.name = name;
    this.sizeKB = sizeKB;
  }

  display(indent = 0) {
    const pad = " ".repeat(indent);
    console.log(`${pad}- File: ${this.name} (${this.sizeKB}KB)`);
  }
}

class FolderComposite extends Component {
  constructor(name) {
    super();
    this.name = name;
    this.children = [];
  }

  add(child) {
    this.children.push(child);
  }

  removeByName(name) {
    this.children = this.children.filter((child) => child.name !== name);
  }

  display(indent = 0) {
    const pad = " ".repeat(indent);
    console.log(`${pad}+ Folder: ${this.name}`);
    for (const child of this.children) {
      child.display(indent + 2);
    }
  }
}

class UIComponent {
  render(_indent = 0) {
    throw new Error("render() must be implemented");
  }
}

class ButtonLeaf extends UIComponent {
  constructor(label) {
    super();
    this.label = label;
  }

  render(indent = 0) {
    const pad = " ".repeat(indent);
    console.log(`${pad}Button: [${this.label}]`);
  }
}

class NavItemLeaf extends UIComponent {
  constructor(title) {
    super();
    this.title = title;
  }

  render(indent = 0) {
    const pad = " ".repeat(indent);
    console.log(`${pad}NavItem: ${this.title}`);
  }
}

class UIContainer extends UIComponent {
  constructor(name) {
    super();
    this.name = name;
    this.children = [];
  }

  add(child) {
    this.children.push(child);
  }

  render(indent = 0) {
    const pad = " ".repeat(indent);
    console.log(`${pad}Container: ${this.name}`);
    for (const child of this.children) {
      child.render(indent + 2);
    }
  }
}

function runCompositeDemo(logger = console.log) {
  const lines = [];
  const log = (...args) => {
    const line = args
      .map((item) => (typeof item === "string" ? item : JSON.stringify(item, null, 2)))
      .join(" ");
    lines.push(line);
    logger(...args);
  };

  log("\n=== Composite Demo: File System ===");
  const root = new FolderComposite("root");
  const docs = new FolderComposite("docs");
  const images = new FolderComposite("images");

  docs.add(new FileLeaf("report.pdf", 120));
  docs.add(new FileLeaf("notes.txt", 4));
  images.add(new FileLeaf("logo.png", 256));

  root.add(docs);
  root.add(images);
  root.add(new FileLeaf("readme.md", 2));

  const originalConsoleLog = console.log;
  console.log = (...args) => log(...args);
  root.display();
  console.log = originalConsoleLog;

  log("\n=== Composite Demo: UI Tree ===");
  const appShell = new UIContainer("AppShell");
  const navBar = new UIContainer("NavBar");
  const dialog = new UIContainer("SettingsDialog");

  navBar.add(new NavItemLeaf("Home"));
  navBar.add(new NavItemLeaf("Projects"));
  navBar.add(new NavItemLeaf("Profile"));

  dialog.add(new ButtonLeaf("Save"));
  dialog.add(new ButtonLeaf("Cancel"));

  appShell.add(navBar);
  appShell.add(dialog);

  console.log = (...args) => log(...args);
  appShell.render();
  console.log = originalConsoleLog;

  return lines.join("\n");
}

module.exports = {
  runCompositeDemo,
  Component,
  FileLeaf,
  FolderComposite,
  UIComponent,
  ButtonLeaf,
  NavItemLeaf,
  UIContainer,
};

if (require.main === module) {
  runCompositeDemo();
}
