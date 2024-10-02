import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { iUsuario } from '../interfaces/iUsuario'; 


@Injectable({
  providedIn: 'root'
})
export class UsuarioTransferService {
  private userSource = new BehaviorSubject<iUsuario | null>(null);
  currentUser = this.userSource.asObservable();
  
  private userChangeSubject = new BehaviorSubject<void | null>(null); 
  userChange$ = this.userChangeSubject.asObservable();

  private userRestartChangeSubject = new BehaviorSubject<void | null>(null); 
  userRestartChange$ = this.userRestartChangeSubject.asObservable();

  constructor() { }

  changeUser(usuario: iUsuario) {
    //console.log("En el transfer service ", employee);
    this.userSource.next(usuario);
  }

  emitUserChange(): void {    
    this.userChangeSubject.next();
  }

  emitUserRestartChange(): void {    
    this.userRestartChangeSubject.next();
  }
}

