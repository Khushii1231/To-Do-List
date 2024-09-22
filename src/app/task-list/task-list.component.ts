import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks = [];
  filteredTasks = [];
  searchTerm: string = '';

  currentPage: number = 1;
  tasksPerPage: number = 20;
  totalPages: number = 1;

  showTaskForm: boolean = false;
  isEditing: boolean = false;
  currentTask: any = null;  
  showDeleteModal: boolean = false;  

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
    this.totalPages = Math.ceil(this.tasks.length / this.tasksPerPage);
    this.updateFilteredTasks();
  }

  deleteTask(id: number) {
    this.currentTask = this.tasks.find(task => task.id === id);
    this.showDeleteModal = true;  
    this.tasks = this.taskService.getTasks();
    this.filterTasks(); 
  }

  confirmDelete(isConfirmed: boolean) {
    if (isConfirmed && this.currentTask) {
      this.taskService.deleteTask(this.currentTask.id);
      this.tasks = this.taskService.getTasks();
     
      this.updateFilteredTasks();
    }
    this.showDeleteModal = false;  
    this.currentTask = null; 
  }

  editTask(task: any) {
    this.isEditing = true;
    this.currentTask = { ...task };  
    this.showTaskForm = true;  
  }

  openTaskForm() {
    this.showTaskForm = true;
   }

  closeTaskForm() {
    this.showTaskForm = false;
    this.currentTask = null;  
  }
  
  refreshTasks() {
    this.tasks = this.taskService.getTasks();
    this.updateFilteredTasks();
    this.filterTasks(); 
  }

  filterTasks() {
    if (this.searchTerm.trim() === '') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task => 
        task.assignedTo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.status.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  updateFilteredTasks() {
    const startIndex = (this.currentPage - 1) * this.tasksPerPage;
    const endIndex = startIndex + this.tasksPerPage;
    this.filteredTasks = this.tasks.slice(startIndex, endIndex);
  }

  goToFirstPage() {
    this.currentPage = 1;
    this.updateFilteredTasks();
  }

  goToPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredTasks();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateFilteredTasks();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updateFilteredTasks();
  }
}
