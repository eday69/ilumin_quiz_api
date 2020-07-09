import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {

  tokenOk = '';
  showContent = false;
  student = [];
  studentName = '';
  prompts = [];
  listQ = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
    this.route.params.subscribe(params => {
      this.tokenOk = '';
      if (params.hasOwnProperty('token')) {
        this.tokenOk = params.token;
        console.log('Token found', this.tokenOk);
        this.getAnswers(this.tokenOk);
      } else {
        console.log('Token not found', params);
      }
    });
  }

  getAnswers(token) {
    this.dataService.getPrompt(token)
      .subscribe(
        res => {
          if (res.status === 200) {
            this.showContent = true;
            this.student = JSON.parse(res.results.data.answers);
            this.studentName = res.results.data.name;
            this.prompts = res.results.data.prompt;
            this.listQ = res.results.data.quizData;
          }

          console.log('prompts', this.student, this.prompts, this.listQ);
        },
        err => {
          this.showContent = true;
        }
      );
  }

  printInfo() {
    window.print();
  }

  ngOnInit(): void {
  }
}
