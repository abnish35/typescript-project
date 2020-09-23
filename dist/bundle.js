"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    // Component Base Class
    class Component {
        constructor(TemplateId, hostElementId, insertAtStart, newElementId) {
            this.templateElement = document.getElementById(TemplateId);
            this.hostElement = document.getElementById(hostElementId);
            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = importedNode.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtStart);
        }
        attach(insertAtBegining) {
            this.hostElement.insertAdjacentElement(insertAtBegining ? "afterbegin" : "beforeend", this.element);
        }
    }
    App.Component = Component;
})(App || (App = {}));
///<reference path="base-component.ts"/>
///<reference path="../decorators/autobind.ts"/>
///<reference path="../models/drag-drop.ts"/>
///<reference path="../models/project.ts"/>
///<reference path="../state/project-state.ts"/>
var App;
(function (App) {
    // Project List class
    class projectList extends App.Component {
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
                new App.ProjectItem(this.element.querySelector("ul").id, projItem);
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
    App.projectList = projectList;
})(App || (App = {}));
var App;
(function (App) {
    function validator(validateInput) {
        let isValid = true;
        if (validateInput.required) {
            isValid = isValid && validateInput.value.toString().trim().length !== 0;
        }
        if (validateInput.minLength != null &&
            typeof validateInput.value === "string") {
            isValid = isValid && validateInput.value.length >= validateInput.minLength;
        }
        if (validateInput.maxLength != null &&
            typeof validateInput.value === "string") {
            isValid = isValid && validateInput.value.length >= validateInput.maxLength;
        }
        if (validateInput.max != null && typeof validateInput.value === "number") {
            isValid = isValid && validateInput.value <= validateInput.max;
        }
        if (validateInput.min != null && typeof validateInput.value === "number") {
            isValid = isValid && validateInput.value >= validateInput.min;
        }
        return isValid;
    }
    App.validator = validator;
})(App || (App = {}));
///<reference path="base-component.ts"/>
///<reference path="../models/drag-drop.ts"/>
///<reference path="../models/project.ts"/>
///<reference path="../decorators/autobind.ts"/>
var App;
(function (App) {
    // Project item class for Element Rendering
    class ProjectItem extends App.Component {
        constructor(hostId, project) {
            super("single-project", hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        // getter
        get persons() {
            if (this.project.noOfPeople === 1) {
                return `1 Person`;
            }
            else {
                return `${this.project.noOfPeople} persons`;
            }
        }
        dragStartHandler(event) {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
            //   console.log(event);
        }
        dragEndHandler(_) {
            //   console.log("Drag End");
        }
        configure() {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent =
                this.persons.toString() + " assigned";
            this.element.querySelector("h4").textContent = this.project.description;
        }
    }
    __decorate([
        autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        autobind
    ], ProjectItem.prototype, "dragEndHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
