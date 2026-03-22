import UIComponent from "./UIComponent";

export default class Input implements UIComponent {
  constructor(private placeholder: string) {}

  render(indent: string = ""): void {
    console.log(indent + "📝 Input: " + this.placeholder);
  }
}