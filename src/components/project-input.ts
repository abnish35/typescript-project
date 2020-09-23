
import Component from './base-component.js';
import * as validation from '../utils/validator.js';
import { autobind as Autobind} from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';


// This class is responsible to taking the input and rendering the input on DOM;
// Project Input Class

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
  
      const titleValdatable: validation.validatable = {
        value: enteredTitle,
        required: true,
      };
      const descValidatable: validation.validatable = {
        value: enteredDescription,
        minLength: 5,
        required: true,
      };
      const peopleValidatable: validation.validatable = {
        value: enteredPeople,
        required: true,
        min: 1,
        max: 100000,
      };
  
      if (
        !validation.validator(titleValdatable) ||
        !validation.validator(descValidatable) ||
        !validation.validator(peopleValidatable)
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
  
    @Autobind
    private submitHandler(e: Event) {
      e.preventDefault();
      const userInput = this.getherUserMethod();
  
      if (Array.isArray(userInput)) {
        const [title, desc, people] = userInput;
        // console.log(userInput);
        projectState.addProject(title, desc, people);
        this.clearInput();
      }
    }
  }



// ///<reference path="base-component.ts"/>
// ///<reference path="../utils/validator.ts"/>
// ///<reference path="../decorators/autobind.ts"/>
// namespace App {
// }

