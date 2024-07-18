import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskListDialogComponent } from './task-list-dialog/task-list-dialog.component';

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
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  newTask: string = '';
  newList: string = '';
  tasks: Task[] = [];
  lists: TaskList[] = [];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadData();
  }

  addTask(): void {
    if (this.newTask.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        text: this.newTask,
        completed: false
      };
      this.tasks.push(newTask);
      this.newTask = '';
      this.saveData();
    }
  }

  toggleTaskCompletion(taskId: number): void {
    const task = this.tasks.find(task => task.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveData();
    }
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.saveData();
  }

  addList(): void {
    if (this.newList.trim() !== '') {
      const newList: TaskList = {
        id: Date.now(),
        name: this.newList,
        tasks: []
      };
      this.lists.push(newList);
      this.newList = '';
      this.saveData();
    }
  }

  openList(list: TaskList): void {
    const dialogRef = this.dialog.open(TaskListDialogComponent, {
      width: '400px',
      data: { list }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.deleteList) {
        this.lists = this.lists.filter(l => l.id !== result.listId);
        this.saveData();
      } else {
        this.saveData();
      }
    });
  }

  saveData(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('lists', JSON.stringify(this.lists));
  }

  loadData(): void {
    const savedTasks = localStorage.getItem('tasks');
    const savedLists = localStorage.getItem('lists');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
    if (savedLists) {
      this.lists = JSON.parse(savedLists);
    }
  }


}
