import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../task.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  
  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TaskService', ['addTask', 'editTask']);

    await TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      imports: [FormsModule],  
      providers: [{ provide: TaskService, useValue: spy }]
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  
  });

  it('should create the form with default values', () => {
    expect(component).toBeTruthy();
    const taskFormElement = fixture.debugElement.query(By.css('form'));
    expect(taskFormElement).toBeTruthy();
    
    expect(component.task.assignedTo).toBe('');
    expect(component.task.status).toBe('Not Started');
    expect(component.task.dueDate).toBe('');
    expect(component.task.priority).toBe('Normal');
  });

  it('should not submit the form when fields are invalid', () => {
    
    component.task = {
      assignedTo: '',
      status: '',
      dueDate: '',
      priority: '',
      comments: ''
    };

    fixture.detectChanges();  
    const formDebugElement = fixture.debugElement.query(By.css('form'));

    formDebugElement.triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(taskService.addTask).not.toHaveBeenCalled();
    expect(taskService.editTask).not.toHaveBeenCalled();
  });

  it('should emit formCancelled event on cancel', () => {
    spyOn(component.formCancelled, 'emit');
    
    const cancelButton = fixture.debugElement.query(By.css('button[type="button"]'));
    cancelButton.triggerEventHandler('click', null);
    
    fixture.detectChanges();
    expect(component.formCancelled.emit).toHaveBeenCalled();
  });
});
