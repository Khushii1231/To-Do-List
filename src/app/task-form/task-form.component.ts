import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../task.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() task: any = { assignedTo: '', status: 'Not Started', dueDate: '', priority: 'Normal', comments: '' };  // Input task for editing
  @Input() isEditing: boolean = false;  
  @Output() formCancelled = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<void>();  
  
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    if (!this.task) {
      this.task = { assignedTo: '', status: 'Not Started', dueDate: '', priority: 'Normal', comments: '' };
    }
  }

  saveTask(form: NgForm) {
    if (form.valid) {
      if (this.isEditing) {
        this.taskService.editTask(this.task);  
      } else {
        this.taskService.addTask(this.task);  
      }
      this.formSubmitted.emit();  
    } else {
      form.controls['assignedTo'].markAsTouched();
      form.controls['status'].markAsTouched();
      form.controls['dueDate'].markAsTouched();
      form.controls['priority'].markAsTouched();
    }
  }
  cancelTask() {
    this.formCancelled.emit();  
  }
}
