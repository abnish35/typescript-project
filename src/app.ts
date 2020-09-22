console.log("getting start.xdfsfs..")

// VALIDATION
interface validatable{
    value: string | number;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    min?: number;
    max?: number;
}

function validator(validateInput: validatable){
    let isValid = true;
    if(validateInput.required){
        isValid = isValid && validateInput.value.toString().trim().length !== 0
    }

    if(validateInput.minLength != null && typeof validateInput.value === 'string'){
        isValid = isValid &&  validateInput.value.length >= validateInput.minLength;
    }

    if(validateInput.maxLength != null && typeof validateInput.value === 'string'){
        isValid = isValid &&  validateInput.value.length >= validateInput.maxLength;
    }

    if(validateInput.max != null && typeof validateInput.value === 'number' ){
        isValid = isValid && validateInput.value <= validateInput.max;
    }

    if(validateInput.min != null && typeof validateInput.value === 'number' ){
        isValid = isValid && validateInput.value >= validateInput.min;
    }

    return isValid;
}


// AUTOBIND DECORATOR
function autobind(target: any, methodName: string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor ={
        configurable: true,
        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

class projectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;

    constructor(private type: 'active' | 'finished'){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);

        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;
        this.attach();
        this.renderContent();
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        // for "UL" element
        this.element.querySelector('ul')!.id = listId;
        // for heading the projects
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase()+" PROJECTS";
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
}


// This class is responsible to taking the input and rendering the input on DOM;

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
        this.configure()
        this.attach()

    }
    private getherUserMethod(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValdatable: validatable={
            value: enteredTitle,
            required: true
        };
        const descValidatable: validatable={
            value: enteredDescription,
            minLength: 5,
            required: true
        };
        const peopleValidatable: validatable={
            value: enteredPeople,
            required: true,
            min: 1,
            max: 100
        };

        if(!validator(titleValdatable) || !validator(descValidatable) || !validator(peopleValidatable)){
            alert('invalid input ... please try again');
            return;
        }
        else{
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInput() {
        this.titleInputElement.value = "",
        this.descInputElement.value = ""
        this.peopleInputElement.value = ""
    }

        @autobind
    private submitHandler(e: Event) {
        e.preventDefault()
        const userInput = this.getherUserMethod();
             
        if(Array.isArray(userInput)){
            const [title, desc, people] = userInput;
            console.log(userInput)
            this.clearInput()
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const projInput = new ProjectInput()
const activeProjList = new projectList('active');
const finishedProjList = new projectList('finished');