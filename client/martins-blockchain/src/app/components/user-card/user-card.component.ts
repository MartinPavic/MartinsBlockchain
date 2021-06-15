import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  @Input() user: User
  @Output() assignPoints = new EventEmitter();
  numOfPoints: number;
  constructor() { }

  ngOnInit(): void {
  }

  assignToUser() {
    this.assignPoints.emit({user: this.user, points: this.numOfPoints});
  }

}
