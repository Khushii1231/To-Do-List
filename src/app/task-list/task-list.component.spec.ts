import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../task.service';
import { By } from '@angular/platform-browser';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TaskService', ['getTasks', 'deleteTask']);

    await TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      imports: [FormsModule], 
      providers: [{ provide: TaskService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    
    taskService.getTasks.and.returnValue([
      { id: 1, assignedTo: 'John Doe', status: 'In Progress', dueDate: '2024-09-21', priority: 'High', comments: 'Sample comment' },
      { id: 2, assignedTo: 'Jane Smith', status: 'Not Started', dueDate: '2024-09-25', priority: 'Low', comments: '' }
    ]);

    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display tasks in the task list', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);

    const firstRow = rows[0].nativeElement;
    expect(firstRow.textContent).toContain('John Doe');
    expect(firstRow.textContent).toContain('In Progress');
  });

  it('should filter tasks based on search term', () => {
    component.searchTerm = 'Jane';
    component.filterTasks();
    fixture.detectChanges();
    const filteredRows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(filteredRows.length).toBe(1);
    expect(filteredRows[0].nativeElement.textContent).toContain('Jane Smith');
  });
  
  it('should show the delete confirmation modal when Delete is clicked', () => {
    const deleteButton = fixture.debugElement.query(By.css('button.delete'));
    deleteButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    const deleteModal = fixture.debugElement.query(By.css('.modal-content h2'));
    expect(deleteModal.nativeElement.textContent).toContain('Delete');
    expect(component.showDeleteModal).toBeTrue();
  });

  it('should delete a task when confirmed', () => {
    const deleteButton = fixture.debugElement.query(By.css('button.delete'));
    deleteButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    component.confirmDelete(true); 
    expect(taskService.deleteTask).toHaveBeenCalledWith(1);
    expect(component.tasks.length).toBe(2);  
  });

  it('should navigate between pages in pagination', () => {
    component.tasksPerPage = 1;
    component.totalPages = 2;
    component.updateFilteredTasks();
    component.goToNextPage();
    fixture.detectChanges();
    expect(component.currentPage).toBe(2);
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
    expect(rows[0].nativeElement.textContent).toContain('Jane Smith');
  });

  it('should refresh the task list when the Refresh button is clicked', () => {
    const refreshButton = fixture.debugElement.query(By.css('.refresh-btn'));
    refreshButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(taskService.getTasks).toHaveBeenCalled();
  });
});
