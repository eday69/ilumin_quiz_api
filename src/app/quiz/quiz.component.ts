import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  public studentForm: FormGroup = new FormGroup(
    {
      firstname: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      lastname: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      highschool: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      city: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      yeargraduate: new FormControl('', [Validators.required, this.rangeEmptyOkValidator(2000, (new Date()).getFullYear())]),
    });

  constructor(
    private router: Router,
    private data: DataService,
  ) { }

  rangeEmptyOkValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined) {
        if (control.value !== '') {
          if ((isNaN(control.value) || control.value < min || control.value > max)) {
            return { rangeEmptyOk: true };
          }
        }
      }
      return null;
    };
  }

  has_error(field, error) {
    return this.studentForm.get(field).errors && this.studentForm.get(field).hasError(error);
  }

  startQuiz() {
    if (this.studentForm.invalid) {
      return;
    }
    this.data.studentData = this.studentForm.value;
    this.router.navigate(['/questions']);
  }
}
