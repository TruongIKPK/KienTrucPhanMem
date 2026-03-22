import UIComponent from "./UIComponent";

export default class Container implements UIComponent {
  private children: UIComponent[] = [];

  constructor(private name: string) {}

  add(component: UIComponent): void {
    this.children.push(component);
  }

  remove(component: UIComponent): void {
    this.children = this.children.filter(c => c !== component);
  }

  render(indent: string = ""): void {
    console.log(indent + "📦 " + this.name);

    this.children.forEach(child => {
      child.render(indent + "   ");
    });
  }
}