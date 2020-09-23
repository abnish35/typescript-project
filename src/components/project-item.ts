
import Component from './base-component.js';
import { Draggable } from "../models/drag-drop.js";
import { Project } from '../models/project.js';
import { autobind } from '../decorators/autobind.js';



// Project item class for Element Rendering

export class ProjectItem
extends Component<HTMLUListElement, HTMLLIElement>
implements Draggable {
private project: Project;

// getter
get persons() {
  if (this.project.noOfPeople === 1) {
    return `1 Person`;
  } else {
    return `${this.project.noOfPeople} persons`;
  }
}

constructor(hostId: string, project: Project) {
  super("single-project", hostId, false, project.id);
  this.project = project;
  this.configure();
  this.renderContent();
}
@autobind
dragStartHandler(event: DragEvent) {
  event.dataTransfer!.setData("text/plain", this.project.id);
  event.dataTransfer!.effectAllowed = "move";
//   console.log(event);
}

@autobind
dragEndHandler(_: DragEvent) {
//   console.log("Drag End");
}

configure() {
  this.element.addEventListener("dragstart", this.dragStartHandler);
  this.element.addEventListener("dragend", this.dragEndHandler);
}
renderContent() {
  this.element.querySelector("h2")!.textContent = this.project.title;
  this.element.querySelector("h3")!.textContent =
    this.persons.toString() + " assigned";
  this.element.querySelector("h4")!.textContent = this.project.description;
}
}



// ///<reference path="base-component.ts"/>
// ///<reference path="../models/drag-drop.ts"/>
// ///<reference path="../models/project.ts"/>
// ///<reference path="../decorators/autobind.ts"/>

// namespace App {
// }