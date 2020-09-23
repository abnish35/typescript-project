// custom class
export var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
export class Project {
    constructor(id, title, description, noOfPeople, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.noOfPeople = noOfPeople;
        this.status = status;
    }
}
