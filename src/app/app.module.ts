import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MyMaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuestionsComponent } from './questions/questions.component';
import { PromptComponent } from './prompt/prompt.component';
import { AnswersComponent } from './answers/answers.component';

// import { AppRoutingModule } from './app-routing.module';


const  appRoutes: Routes  = [
  {
    path:  '',
    redirectTo:  '/quiz',
    pathMatch:  'full'
  },
  {
    path: 'quiz',
    component: QuizComponent
  },
  {
    path: 'questions',
    component: QuestionsComponent,
  },
  {
    path: 'answers/:token',
    component: AnswersComponent,
  },
  {
    path: 'answers',
    component: AnswersComponent,
  }
];


@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    QuestionsComponent,
    PromptComponent,
    AnswersComponent
  ],
  imports: [
    NoopAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MyMaterialModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true }
    ),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
