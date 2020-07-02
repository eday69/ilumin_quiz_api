import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatHorizontalStepper} from '@angular/material';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})

export class PromptComponent implements OnInit {
  @Input() prompt: FormGroup;
  @Input() labels: [ { option: '', prompt: 0 }];
  @Input() question: number;
  @Input() invalid: boolean;

  ngOnInit(): void {
  }

  get f() {
    return this.prompt && this.prompt.controls;
  }

  get options(): FormArray {
    return this.f && this.f.options as FormArray;
  }
}
