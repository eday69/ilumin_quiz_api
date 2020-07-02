import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import { listAnswers } from './listAnswers';
import { MatHorizontalStepper, MatStepper } from '@angular/material';
import {DataService} from '../data.service';
import {Router} from '@angular/router';

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
  answer = listAnswers;
  invalid = false;
  studentData: {};
  quiz: [{
    label: '',
    options: []
  }];
  loading = true;

  ngOnInit() {
    this.studentData = this.dataService.studentData;
    this.dataService.getQuiz(1).subscribe(
        res => {
          this.loading = false;
          this.quiz = res.results.data;
          this.form = this.fb.group({
            questions: this.fb.array([])
          });
          this.buildQuestions(this.quiz);
          console.log('We got', this.studentData, this.questions, this.form);
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
  // END TEST

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
    return true;
    if ((typeof idx !== 'undefined') && this.stepper && (this.stepper.selectedIndex === idx)) {
      return !this.questions.get([idx]).invalid;
    }
    return false;
  }


  onSubmit() {
    // console.log('data orig', this.data, this.data.map(qs => qs.options));
    // const calc = this.data.map((qs, qi) => qs.options.map(
    //   (q, qIdx) => {
    //     return this.questions.get([qi]).get('options')['controls'][qIdx].value ? q.prompt : null;
    //   }
    // ));
    const answers = [
      [4, 3, 4, 2, null, null, null, null, null, null, null],
      [6, 3, 4, 6, null, null, null, null, null, null, null],
      [6, 3, 6, 6, null, null, null, null],
      [1, 1, 1, 7, null, null, null],
      [1, 7, 7, 1, null, null, null, null],
      [2, 3, 7, 7, null, null, null, null, null],
      [2, 2, 5, 5, null, null, null, null]
    ];

    const data = {
      answers,
      student: this.studentData
    };

    this.dataService.postPrompt(data)
      .subscribe(res => {
        this.dataService.token = res.results.data.token;
        this.router.navigate(['/results']);
      });

    console.log('json', answers, JSON.stringify(answers));

    const calcFlat = [].concat.apply([], answers);
    const countOccur = calcFlat.reduce((acc, curr) => {
      if (typeof acc[curr] === 'undefined') {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }

      return acc;
    }, {});
    console.log('answer', this.answer[Object.keys(countOccur)[0]]);

    // countOccur.forEach((item) => {
    //   console.log('Selected', item);
    //   // console.log('Answer', answer[item])
    // });
    console.log('times', countOccur);
    // console.log('data', this.data.filter(
    //   (q, qIdx) => this.questions.get([qIdx]).get('options')['controls'].some(
    //     (control, controlIdx) => {
    //       console.log('in some', qIdx, controlIdx, control.value);
    //       return control.value;
    //     })));


    alert('Submitted');
  }
}
