import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Organization } from 'src/app/models/organization';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-list-points',
  templateUrl: './list-points.component.html',
  styleUrls: ['./list-points.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPointsComponent implements OnInit {
  @Input() users: User[];
  @Input() organization: Organization;
  numOfPoints: number;

  constructor() {}

  ngOnInit(): void {}

  assignToUser(user: User): void {
    if (!this.numOfPoints) {
      return;
    }
    if (this.organization.balance < this.numOfPoints) {
      throw new Error('Organization cannot give anymore coins');
    }
    const index = this.users.findIndex((value) => value === user);
    const newUserBalance = { id: user.id, balance: this.numOfPoints };
    this.users = [
      ...this.users.slice(0, index),
      Object.assign({}, newUserBalance),
      ...this.users.slice(index + 1),
    ];
  }
}
