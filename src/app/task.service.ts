import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks = [
    { id: 1, assignedTo: 'User 1', status: 'Completed', dueDate: '12/10/2024', priority: 'Low', comments: 'This task is good' },
    { id: 2, assignedTo: 'User 2', status: 'In Progress', dueDate: '14/09/2024', priority: 'High', comments: 'This task is good' },
    { id: 3, assignedTo: 'User 3', status: 'Not Started', dueDate: '18/08/2024', priority: 'Low', comments: 'This task is good' },
    { id: 4, assignedTo: 'User 4', status: 'In Progress', dueDate: '12/06/2024', priority: 'Normal', comments: 'This task is good' }
  ];

constructor() { }

getTasks() {
    return this.tasks;
  }
  
addTask(task: any) {
    task.id = this.tasks.length + 1; 
    this.tasks.push(task);
  }

editTask(editTask: any) {
  const index = this.tasks.findIndex(task => task.id === editTask.id);
  if (index > -1) {
    this.tasks[index] = editTask;  
  }
}

deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
}
