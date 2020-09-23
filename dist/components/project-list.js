var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from './base-component.js';
import { ProjectItem } from './project-item.js';
import { projectState } from '../state/project-state.js';
import { autobind } from '../decorators/autobind.js';
import { ProjectStatus } from '../models/project.js';
// Project List class
export class projectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjets = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            const listEl = document.querySelector("ul");
            listEl.classList.add("droppable");
        }
    }
    dropHandler(event) {
        const projId = event.dataTransfer.getData("text/plain");
        projectState.moveProject(projId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
        //   console.log(event);
    }
    dragLeaveHandler(event) {
        const listEl = document.querySelector("ul");
        listEl.classList.remove("droppable");
    }
    renderContent() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);
        const listId = `${this.type}-projects-list`;
        // for "UL" element
        this.element.querySelector("ul").id = listId;
        // for heading the projects
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
    }
    configure() {
        projectState.addListener((projects) => {
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
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = "";
        for (const projItem of this.assignedProjets) {
            new ProjectItem(this.element.querySelector("ul").id, projItem);
        }
    }
}
__decorate([
    autobind
], projectList.prototype, "dragOverHandler", null);
__decorate([
    autobind
], projectList.prototype, "dropHandler", null);
__decorate([
    autobind
], projectList.prototype, "dragLeaveHandler", null);
// ///<reference path="base-component.ts"/>
// ///<reference path="../decorators/autobind.ts"/>
// ///<reference path="../models/drag-drop.ts"/>
// ///<reference path="../models/project.ts"/>
// ///<reference path="../state/project-state.ts"/>
// namespace App {
// }
