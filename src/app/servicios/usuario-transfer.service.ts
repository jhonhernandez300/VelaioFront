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

  private isUserChanging: boolean = false;

  constructor() { }

  changeUser(usuario: iUsuario) {
    //console.log("En el transfer service ", employee);
    this.userSource.next(usuario);
  }

  emitUserChange(): void {    
    if (!this.isUserChanging) { // cambio: prevenir cambios simultáneos
      this.isUserChanging = true; // nuevo: marcar como en proceso
      this.userChangeSubject.next();
    }
  }

  emitUserRestartChange(): void {    
    if (this.isUserChanging) { // cambio: prevenir ejecuciones simultáneas
      this.isUserChanging = false; // nuevo: resetear el flag
      this.userRestartChangeSubject.next();
    }
  }
}

