import UIComponent from "./UIComponent";

export default class Button implements UIComponent {
  constructor(private label: string) {}

  render(indent: string = ""): void {
    console.log(indent + "🔘 Button: " + this.label);
  }
}