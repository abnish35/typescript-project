var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from './base-component.js';
import * as validation from '../utils/validator.js';
import { autobind as Autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
// This class is responsible to taking the input and rendering the input on DOM;
// Project Input Class
export class ProjectInput extends Component {
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
            max: 100000,
        };
        if (!validation.validator(titleValdatable) ||
            !validation.validator(descValidatable) ||
            !validation.validator(peopleValidatable)) {
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
            // console.log(userInput);
            projectState.addProject(title, desc, people);
            this.clearInput();
        }
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
// ///<reference path="base-component.ts"/>
// ///<reference path="../utils/validator.ts"/>
// ///<reference path="../decorators/autobind.ts"/>
// namespace App {
// }
