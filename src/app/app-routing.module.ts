import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';

// Define your routes
const routes: Routes = [
  { path: '', component: TaskListComponent },       
  { path: 'new-task', component: TaskFormComponent },  
  { path: 'edit-task/:id', component: TaskFormComponent }, 
  { path: '**', redirectTo: '', pathMatch: 'full' }    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]  
})
export class AppRoutingModule { }
