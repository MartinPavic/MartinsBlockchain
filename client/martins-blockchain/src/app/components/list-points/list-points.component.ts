import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
})
export class ListPointsComponent implements OnInit {
  @Input() users: User[];
  @Input() organization: Organization;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  assignToUser(userAndPoints: any): void {
    const index = this.users.findIndex((value) => value === userAndPoints.user);
    const newUserBalance = { id: userAndPoints.user.id, balance: userAndPoints.points };
    this.users = [
      ...this.users.slice(0, index),
      newUserBalance,
      ...this.users.slice(index + 1),
    ];
  }
}
