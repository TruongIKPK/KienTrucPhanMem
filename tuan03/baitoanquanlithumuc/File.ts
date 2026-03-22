import { FileSystemItem } from "./FileSystemItem";

// Use a non-DOM name to avoid clashing with the built-in File type
export default class DocumentFile implements FileSystemItem {
  constructor(private name: string) {}

  show(indent: string = ""): void {
    console.log(indent + "📄 " + this.name);
  }
}