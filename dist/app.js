"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
console.log("getting start.xdfsfs..");
// custom class
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, noOfPeople, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.noOfPeople = noOfPeople;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    // it store when sthing changes in the project i.e. add new project,we call all listener fn ; its an array of function reference.
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addProject(title, description, noOfPeople) {
        const newProject = new Project(Math.random().toString(), title, description, noOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        this.updateListener();
    }
    moveProject(projectId, newStatus) {
        const project = this.projects.find(proj => proj.id === projectId);
        if (project && project.status != newStatus) {
            project.status = newStatus;
            this.updateListener();
        }
    }
    updateListener() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
            // Every listener function gets executed and receive brand new copy of obj.
        }
    }
}
const projectState = ProjectState.getInstance();
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
// AUTOBIND DECORATOR
function autobind(target, methodName, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
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
// Project item class for Element Rendering
class ProjectItem extends Component {
    constructor(hostId, project) {
        super('single-project', hostId, false, project.id);
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
        event.dataTransfer.setData('text/plain', this.project.id);
        event.dataTransfer.effectAllowed = "move";
        console.log(event);
    }
    dragEndHandler(_) {
        console.log('Drag End');
    }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('h3').textContent = this.persons.toString() + " assigned";
        this.element.querySelector('h4').textContent = this.project.description;
    }
}
__decorate([
    autobind
], ProjectItem.prototype, "dragStartHandler", null);
__decorate([
    autobind
], ProjectItem.prototype, "dragEndHandler", null);
// Project List class
class projectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjets = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = document.querySelector('ul');
            listEl.classList.add('droppable');
        }
    }
    dropHandler(event) {
        const projId = event.dataTransfer.getData('text/plain');
        projectState.moveProject(projId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
        console.log(event);
    }
    dragLeaveHandler(event) {
        const listEl = document.querySelector('ul');
        listEl.classList.remove('droppable');
    }
    renderContent() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
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
            new ProjectItem(this.element.querySelector('ul').id, projItem);
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
// This class is responsible to taking the input and rendering the input on DOM;
// Project Input Class
class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.titleInputElement = this.element.querySelector("#title");
        this.descInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    renderContent() { }
    getherUserMethod() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titleValdatable = {
            value: enteredTitle,
            required: true,
        };
        const descValidatable = {
            value: enteredDescription,
            minLength: 5,
            required: true,
        };
        const peopleValidatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 100,
        };
        if (!validator(titleValdatable) ||
            !validator(descValidatable) ||
            !validator(peopleValidatable)) {
            alert("invalid input ... please try again");
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    clearInput() {
        (this.titleInputElement.value = ""), (this.descInputElement.value = "");
        this.peopleInputElement.value = "";
    }
    submitHandler(e) {
        e.preventDefault();
        const userInput = this.getherUserMethod();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(userInput);
            projectState.addProject(title, desc, people);
            this.clearInput();
        }
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const projInput = new ProjectInput();
const activeProjList = new projectList("active");
const finishedProjList = new projectList("finished");
