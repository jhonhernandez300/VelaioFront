import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iUsuario } from '../interfaces/iUsuario'; 


@Injectable({
  providedIn: 'root'
})
export class UsuarioTransferService {
  private userSource = new BehaviorSubject<iUsuario | null>(null);
  currentUser = this.userSource.asObservable();

  constructor() { }

  changeUser(usuario: iUsuario) {
    //console.log("En el transfer service ", employee);
    this.userSource.next(usuario);
  }
}
