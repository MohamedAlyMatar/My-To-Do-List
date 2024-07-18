import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskList {
  id: number;
  name: string;
  tasks: Task[];
}

@Component({
  selector: 'app-task-list-dialog',
  templateUrl: './task-list-dialog.component.html',
  styleUrls: ['../app.component.css']
})
export class TaskListDialogComponent {
  newTask: string = '';

  constructor(
    public dialogRef: MatDialogRef<TaskListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { list: TaskList }
  ) { }

  exitList(): void {
    this.dialogRef.close();
  }

  addTask(): void {
    if (this.newTask.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        text: this.newTask,
        completed: false
      };
      this.data.list.tasks.push(newTask);
      this.newTask = '';
    }
  }

  toggleTaskCompletion(taskId: number): void {
    const task = this.data.list.tasks.find(task => task.id === taskId);
    if (task) {
      task.completed = !task.completed;
    }
  }

  deleteTask(taskId: number): void {
    this.data.list.tasks = this.data.list.tasks.filter(task => task.id !== taskId);
  }

  deleteList(): void {
    // we could create a seperate component for confirmation dialog but fot the mean time we will use this
    const dialogConfirmation = confirm('Are you sure you want to delete this list?');
    if (!dialogConfirmation) {
      this.dialogRef.close({ deleteList: false });
    }
    else {
      this.dialogRef.close({ deleteList: true, listId: this.data.list.id });
    }
  }

}
