
import Component from './base-component.js';
import { ProjectItem } from './project-item.js';
import { DragTarget } from "../models/drag-drop.js";
import { projectState } from '../state/project-state.js';
import { autobind } from '../decorators/autobind.js';
import { Project, ProjectStatus } from '../models/project.js';

// Project List class
export class projectList
extends Component<HTMLDivElement, HTMLElement>
implements DragTarget {
assignedProjets: Project[];

constructor(private type: "active" | "finished") {
  super("project-list", "app", false, `${type}-projects`);

  this.assignedProjets = [];

  this.configure();
  this.renderContent();
}
@autobind
dragOverHandler(event: DragEvent) {
  if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
    event.preventDefault();
    const listEl = document.querySelector("ul")!;
    listEl.classList.add("droppable");
  }
}

@autobind
dropHandler(event: DragEvent) {
  const projId = event.dataTransfer!.getData("text/plain");
  projectState.moveProject(
    projId,
    this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
  );
//   console.log(event);
}

@autobind
dragLeaveHandler(event: DragEvent) {
  const listEl = document.querySelector("ul")!;
  listEl.classList.remove("droppable");
}

renderContent() {
  this.element.addEventListener("dragover", this.dragOverHandler);
  this.element.addEventListener("dragleave", this.dragLeaveHandler);
  this.element.addEventListener("drop", this.dropHandler);

  const listId = `${this.type}-projects-list`;
  // for "UL" element
  this.element.querySelector("ul")!.id = listId;
  // for heading the projects
  this.element.querySelector("h2")!.textContent =
    this.type.toUpperCase() + " PROJECTS";
}

configure() {
  projectState.addListener((projects: Project[]) => {
    const relevantProjects = projects.filter((proj) => {
      if (this.type === "active") {
        return proj.status === ProjectStatus.Active;
      }
      return proj.status === ProjectStatus.Finished;
    });
    this.assignedProjets = relevantProjects;
    this.renderProjects();
  });
}

private renderProjects() {
  const listEl = document.getElementById(
    `${this.type}-projects-list`
  )! as HTMLUListElement;
  listEl.innerHTML = "";
  for (const projItem of this.assignedProjets) {
    new ProjectItem(this.element.querySelector("ul")!.id, projItem);
  }
}
}




// ///<reference path="base-component.ts"/>
// ///<reference path="../decorators/autobind.ts"/>
// ///<reference path="../models/drag-drop.ts"/>
// ///<reference path="../models/project.ts"/>
// ///<reference path="../state/project-state.ts"/>

// namespace App {
// }
