import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Organization } from 'src/app/models/organization';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list-points',
  templateUrl: './list-points.component.html',
  styleUrls: ['./list-points.component.css'],
})
export class ListPointsComponent implements OnInit {
  @Input() users: User[];
  @Output() studentPoints = new EventEmitter();
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  assignToUser(userAndPoints: any): void {
    this.apiService.assignPointsToStudent(userAndPoints.user, userAndPoints.points).subscribe(
      res => {
        if (res) {
          const index = this.users.findIndex((value) => value === userAndPoints.user);
          const newUserBalance = { id: userAndPoints.user.id, balance: userAndPoints.user.balance + userAndPoints.points };
          this.users = [
            ...this.users.slice(0, index),
            newUserBalance,
            ...this.users.slice(index + 1),
          ];
          this.studentPoints.emit(userAndPoints)
        }
      }
    )
  }
}
