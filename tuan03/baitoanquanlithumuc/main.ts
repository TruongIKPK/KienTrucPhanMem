import Folder from "./Folder";
import DocumentFile from "./File";

const root = new Folder("Root");

const file1 = new DocumentFile("index.ts");
const file2 = new DocumentFile("README.md");

const src = new Folder("src");
const utils = new Folder("utils");

utils.add(new DocumentFile("helper.ts"));
src.add(utils);
src.add(new DocumentFile("app.ts"));

root.add(file1);
root.add(file2);
root.add(src);

root.show();
