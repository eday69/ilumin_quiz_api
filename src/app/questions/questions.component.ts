import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

class QuizOption {
  option: string;
  prompt: number;
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
})

export class QuestionsComponent implements OnInit {
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  constructor(private fb: FormBuilder,
              private router: Router,
              private dataService: DataService
  ) { }

  public form: FormGroup = new FormGroup({});
  invalid = false;
  studentData: {};
  quiz: [{
    label: '',
    content: '',
    options: []
  }];

  loading = true;

  ngOnInit() {
    this.studentData = this.dataService.studentData;

    if (this.studentData === undefined) {
        this.router.navigate(['/quiz']);
    }

    this.dataService.getQuiz(1).subscribe(
        res => {
          this.loading = false;
          this.quiz = res.results.data;
          this.form = this.fb.group({
            questions: this.fb.array([])
          });
          this.buildQuestions(this.quiz);
        }
    );
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  buildQuestions(quiz: {}[]) {
    const formArray = this.questions;
    quiz.map(q => {
      formArray.push(this.buildOptions(q));
    });
    this.form.setControl('questions', formArray);
  }

  buildOptions(q): FormGroup {
    const formGroup: FormGroup = new FormGroup({});
    formGroup.addControl('options', this.buildOptionsFormArr(q.options));

    return formGroup;
  }

  buildOptionsFormArr(options: []): FormArray {
    const controlArr = options.map(category => {
      return this.fb.control(false);
    });
    return this.fb.array(controlArr, this.atLeastOneCheckboxCheckedValidator());
  }

  atLeastOneCheckboxCheckedValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let checked = 0;

      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];

        if (control.value === true) {
          checked++;
        }
      });

      if (checked < minRequired) {
        return {
          requireCheckboxToBeChecked: true,
        };
      }

      return null;
    };
  }

  nextStep() {
    if (this.isValid(this.stepper.selectedIndex)) {
      this.invalid = false;
      this.stepper.next();
    } else {
      this.invalid = true;
    }
  }

  previousStep() {
    this.stepper.previous();
  }

  isValid(idx) {
    if ((typeof idx !== 'undefined') && this.stepper && (this.stepper.selectedIndex === idx)) {
      return !this.questions.get([idx]).invalid;
    }
    return false;
  }


  onSubmit() {
    const answers = this.quiz.map((qs, qi) => qs.options.map(
      (q: QuizOption, qIdx) => {
        return this.questions.get([qi]).get('options')['controls'][qIdx].value ? q.prompt : null;
      }
    ));

    const data = {
      answers: JSON.stringify(answers),
      quizid: 1,
      student: this.studentData
    };

    this.dataService.postPrompt(data)
      .subscribe(res => {
        this.router.navigate(['/answers/' + res.results.data.token]);
      });
  }
}
