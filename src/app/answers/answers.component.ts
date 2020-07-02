import { Component, OnInit } from '@angular/core';
import { listQuestions } from '../questions/listQuestions';
import { listAnswers } from '../questions/listAnswers';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {

  constructor() { }

  student = [
    [4,3,4,2,null,null,null,null,null,null,null],
    [6,3,4,6,null,null,null,null,null,null,null],
    [6,3,6,6,null,null,null,null],
    [1,1,1,7,null,null,null],
    [1,7,7,1,null,null,null,null],
    [2,3,7,7,null,null,null,null,null],
    [2,2,5,5,null,null,null,null]
  ];
  listAns = listAnswers;
  listQ = listQuestions;

  ngOnInit(): void {
  }

}
