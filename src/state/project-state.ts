
import { Project, ProjectStatus } from '../models/project.js';

// Project State Management

type Listener<T> = (items: T[]) => void; // Any value this might return, we don't care about that. We don't need any return type, just insure that when listener fires it may or maynot be return value.

class State<T> {
  protected listeners: Listener<T>[] = [];
  // it store when sthing changes in the project i.e. add new project,we call all listener fn ; its an array of function reference.

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, noOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      noOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListener();
  }
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((proj) => proj.id === projectId);
    if (project && project.status != newStatus) {
      project.status = newStatus;
      this.updateListener();
    }
  }
  private updateListener() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
      // Every listener function gets executed and receive brand new copy of obj.
    }
  }
}

export const projectState = ProjectState.getInstance();