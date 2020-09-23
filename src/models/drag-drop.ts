
    // Drag and Drop Interfaces

// used in the projectItem class
export interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
  }
  
  // used in projectList class
 export interface DragTarget {
    dragOverHandler(event: DragEvent): void; // It gives the signal to the browser the valid drag target; It permit the drop
    dropHandler(event: DragEvent): void; // It handle the drop and update the data and UI of the element.
    dragLeaveHandler(event: DragEvent): void; // If no drop happen or cancle the drop , this event triggred to revert the update.
  }