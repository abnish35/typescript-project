console.log("getting start.xdfsfs..");

// Drag and Drop Interfaces

// used in the projectItem class
interface Draggable {
    dragStartHandler( event: DragEvent): void; 
    dragEndHandler(event: DragEvent): void;
}

// used in projectList class
interface DragTarget {
    dragOverHandler(event: DragEvent): void; // It gives the signal to the browser the valid drag target; It permit the drop
    dropHandler(event: DragEvent): void;// It handle the drop and update the data and UI of the element.
    dragLeaveHandler(event: DragEvent): void; // If no drop happen or cancle the drop , this event triggred to revert the update. 
}

// custom class
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public noOfPeople: number,
    public status: ProjectStatus
  ) {}
}

// Project State Management

type Listener<T> = (items: T[]) => void; // Any value this might return, we don't care about that. We don't need any return type, just insure that when listener fires it may or maynot be return value.

class State<T> {
  protected listeners: Listener<T>[] = [];
  // it store when sthing changes in the project i.e. add new project,we call all listener fn ; its an array of function reference.

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
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
    this.updateListener()
  }
  moveProject(projectId: string, newStatus: ProjectStatus){
    const project = this.projects.find(proj=> proj.id === projectId);
    if(project && project.status != newStatus){
        project.status = newStatus;
        this.updateListener()
    }
  }
  private updateListener(){
    for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice());
        // Every listener function gets executed and receive brand new copy of obj.
      }
  }
}

const projectState = ProjectState.getInstance();

// VALIDATION
interface validatable {
  value: string | number;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
}

function validator(validateInput: validatable) {
  let isValid = true;
  if (validateInput.required) {
    isValid = isValid && validateInput.value.toString().trim().length !== 0;
  }

  if (
    validateInput.minLength != null &&
    typeof validateInput.value === "string"
  ) {
    isValid = isValid && validateInput.value.length >= validateInput.minLength;
  }

  if (
    validateInput.maxLength != null &&
    typeof validateInput.value === "string"
  ) {
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
function autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    TemplateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      TemplateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }
  attach(insertAtBegining: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBegining ? "afterbegin" : "beforeend",
      this.element
    );
  }
  abstract configure(): void;
  abstract renderContent(): void;
}

// Project item class for Element Rendering

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    // getter
    get persons(){
        if(this.project.noOfPeople === 1){
            return `1 Person`;
        }
        else{
            return `${this.project.noOfPeople} persons`;
        }

    }

    constructor(hostId: string, project: Project){
        super('single-project', hostId, false, project.id );
        this.project = project;
        this.configure();
        this.renderContent();
    }
    @autobind
    dragStartHandler(event: DragEvent){
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = "move";
        console.log(event)
    }

    @autobind
    dragEndHandler(_: DragEvent){
        console.log('Drag End')
    }

    configure(){
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }
    renderContent(){
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.persons.toString()+ " assigned";
        this.element.querySelector('h4')!.textContent = this.project.description;
    }
}

// Project List class
class projectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjets: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.assignedProjets = [];

    this.configure();
    this.renderContent();
  }
  @autobind
  dragOverHandler(event: DragEvent){
      if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
          event.preventDefault();
          const listEl = document.querySelector('ul')!;
          listEl.classList.add('droppable')     
      }
  }

  @autobind
  dropHandler(event: DragEvent){
      const projId = event.dataTransfer!.getData('text/plain');
         projectState.moveProject(projId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished )
      console.log(event)
  }

  @autobind
  dragLeaveHandler(event: DragEvent){

    const listEl = document.querySelector('ul')!;
    listEl.classList.remove('droppable')
  }

  renderContent() {

    this.element.addEventListener('dragover', this.dragOverHandler)
    this.element.addEventListener('dragleave', this.dragLeaveHandler)
    this.element.addEventListener('drop', this.dropHandler)

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
      new ProjectItem(this.element.querySelector('ul')!.id, projItem)
    }
  }
}

// This class is responsible to taking the input and rendering the input on DOM;
// Project Input Class

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  renderContent() {}

  private getherUserMethod(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValdatable: validatable = {
      value: enteredTitle,
      required: true,
    };
    const descValidatable: validatable = {
      value: enteredDescription,
      minLength: 5,
      required: true,
    };
    const peopleValidatable: validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 100,
    };

    if (
      !validator(titleValdatable) ||
      !validator(descValidatable) ||
      !validator(peopleValidatable)
    ) {
      alert("invalid input ... please try again");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInput() {
    (this.titleInputElement.value = ""), (this.descInputElement.value = "");
    this.peopleInputElement.value = "";
  }

  @autobind
  private submitHandler(e: Event) {
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

const projInput = new ProjectInput();
const activeProjList = new projectList("active");
const finishedProjList = new projectList("finished");
