import { Project, ProjectStatus } from '../models/project.js';
class State {
    constructor() {
        this.listeners = [];
    }
    // it store when sthing changes in the project i.e. add new project,we call all listener fn ; its an array of function reference.
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class ProjectState extends State {
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
        const project = this.projects.find((proj) => proj.id === projectId);
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
export const projectState = ProjectState.getInstance();
