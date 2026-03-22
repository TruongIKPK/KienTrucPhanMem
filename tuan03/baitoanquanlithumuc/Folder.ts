import { FileSystemItem } from "./FileSystemItem";

class Folder implements FileSystemItem {
  private children: FileSystemItem[] = [];

  constructor(private name: string) {}

  add(item: FileSystemItem): void {
    this.children.push(item);
  }

  remove(item: FileSystemItem): void {
    this.children = this.children.filter(i => i !== item);
  }

  show(indent: string = ""): void {
    console.log(indent + "📁 " + this.name);

    this.children.forEach(child => {
      child.show(indent + "   ");
    });
  }
}

export default Folder;