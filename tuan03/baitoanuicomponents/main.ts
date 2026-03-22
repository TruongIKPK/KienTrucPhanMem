import Container from "./Container";
import Button from "./Button";
import Input from "./Input";

const dialog = new Container("Dialog");

const btnSubmit = new Button("Submit");
const inputName = new Input("Enter name");

const navbar = new Container("Navbar");
navbar.add(new Button("Home"));
navbar.add(new Button("Profile"));

dialog.add(inputName);
dialog.add(btnSubmit);
dialog.add(navbar);

dialog.render();