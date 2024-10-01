import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iTarea } from '../interfaces/iTarea'; 


@Injectable({
  providedIn: 'root'
})
export class TareaTransferService {
  private taskSource = new BehaviorSubject<iTarea | null>(null);
  currentTask = this.taskSource.asObservable();

  constructor() { }

  changeTarea(tarea: iTarea) {
    //console.log("En el transfer service ", employee);
    this.taskSource.next(tarea);
  }
}

