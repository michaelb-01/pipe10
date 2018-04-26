import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { RouterModule, Routes } from '@angular/router';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MomentModule } from 'angular2-moment';

import { MatButtonModule,
         MatSidenavModule,
         MatInputModule,
         MatTabsModule,
         MatCheckboxModule,
         MatSelectModule,
         MatDatepickerModule,
         MatNativeDateModule,
         MatTooltipModule,
         MatExpansionModule,
         MatAutocompleteModule,
         MatCardModule,
         MatSliderModule,
         MatSnackBarModule } from '@angular/material';

import { MatIconModule } from '@angular/material/icon';

import 'hammerjs';

import { JobsComponent } from './jobs/jobs.component';
import { ThumbnailComponent } from './thumbnail/thumbnail.component';
import { JobFormComponent } from './job-form/job-form.component';
import { JobComponent } from './job/job.component';
import { EntitiesComponent } from './entities/entities.component';

import { FirstLetterPipe } from './pipes/first-letter.pipe';

import { SidenavService } from './sidenav.service';
import { AnnotationService } from './annotation/annotation.service';

import { EntityFormComponent } from './entity-form/entity-form.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { VersionsComponent } from './versions/versions.component';
import { EntityComponent } from './entity/entity.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { VersionItemComponent } from './version-item/version-item.component';
import { VersionFormComponent } from './version-form/version-form.component';
import { SidebarLeftComponent } from './sidebar-left/sidebar-left.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { ReviewComponent } from './review/review.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { PipeVideoComponent } from './pipe-video/pipe-video.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { SortableDirective } from './sortable.directive';
import { TodosFilterPipe } from './todos-filter.pipe';
import { AnnotationItemComponent } from './annotation-item/annotation-item.component';
import { TypeFilter2Pipe } from './type-filter2.pipe';
import { RoundPipe } from './round.pipe';
import { ZeroPadPipe } from './zero-pad.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { GanttComponent } from './gantt/gantt.component';
import { GanttItemComponent } from './gantt-item/gantt-item.component';

const appRoutes: Routes = [
  { path: 'jobs', component: JobsComponent },
  { path: 'job/:jobId', component: JobComponent },
  { path: 'entity/:entityId', component: EntityComponent },
  { path: 'entity/:entityId/:taskType', component: EntityComponent },
  { path: 'review/:versionId', component: ReviewComponent },
  { path: 'mytasks', component: MyTasksComponent },
  { path: 'planner', component: GanttComponent },
  { path: '',
    redirectTo: '/jobs',
    pathMatch: 'full'
  },
  { path: '**', component: JobsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    JobsComponent,
    ThumbnailComponent,
    JobFormComponent,
    JobComponent,
    EntitiesComponent,
    FirstLetterPipe,
    EntityFormComponent,
    TaskFormComponent,
    VersionsComponent,
    EntityComponent,
    FileUploadComponent,
    VersionItemComponent,
    VersionFormComponent,
    SidebarLeftComponent,
    TodoListComponent,
    TodoItemComponent,
    ReviewComponent,
    AnnotationComponent,
    PipeVideoComponent,
    CommentListComponent,
    MyTasksComponent,
    SortableDirective,
    TodosFilterPipe,
    AnnotationItemComponent,
    TypeFilter2Pipe,
    RoundPipe,
    ZeroPadPipe,
    FilterPipe,
    GanttComponent,
    GanttItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    MatButtonModule,
    MatSidenavModule,
    MatInputModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatSliderModule,
    RouterModule.forRoot(
      appRoutes
      //{ enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [SidenavService, AnnotationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
