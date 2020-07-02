import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  public studentForm: FormGroup = new FormGroup(
    {
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', []),
      highschool: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      city: new FormControl('', [Validators.required]),
      yeargraduate: new FormControl('', [this.rangeEmptyOkValidator(2000, (new Date()).getFullYear())]),
    });

  constructor(
    private router: Router,
    private data: DataService,
  ) { }

  ngOnInit(): void {
  }

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
    this.data.studentData = this.studentForm.value;
    this.router.navigate(['/questions']);
  }

  answers() {
    this.router.navigate(['/answers']);
  }

}
