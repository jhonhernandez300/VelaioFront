import { Component, OnInit, ViewChild } from '@angular/core';
import { iUsuarioCorto } from '../../../interfaces/iUsuarioCorto';
import { iUsuario } from '../../../interfaces/iUsuario';
import { ApplicationDataService } from '../../../servicios/application-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../general/confirm-dialog/confirm-dialog.component';
import { CloseDialogComponent } from '../../general/close-dialog/close-dialog.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UsuarioTransferService } from '../../../servicios/usuario-transfer.service';

@Component({
  selector: 'app-obtener-todos-corto',
  templateUrl: './obtener-todos-corto.component.html',
  styleUrl: './obtener-todos-corto.component.css'
})
export class ObtenerTodosCortoComponent implements OnInit {
  dataSource = new MatTableDataSource<iUsuario>([]); 
  errorMessage: string = '';  
  showDiv = false;    
  showAll = false;
  userChoice = false;  
  users: any[] = [];
  displayedColumns: string[] = ['nombre', 'email', 'choose'];

  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(
    private router: Router,    
    private applicationDataService: ApplicationDataService, 
    public dialog: MatDialog,
    public usuarioTransferService: UsuarioTransferService
  ) { }

  ngOnInit(): void {        
    this.loadAllUsers();        
  }  

  public loadAllUsers(): void {
    this.users = this.applicationDataService.getUsers();
    //console.log("users ", this.users);
    this.dataSource.data = this.users;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  } 

  private handleEmpty(message: string): void {
    this.errorMessage = message;
    this.showTemporaryDiv();
  }

  private showTemporaryDiv(): void {
    this.showDiv = true;
    setTimeout(() => this.showDiv = false, 5000);
  }

  private handleError(error: any): void {
    console.error('Error:', error);
    this.errorMessage = error;
    this.showTemporaryDiv();
  }

  choose(usuario: iUsuario) {
    this.usuarioTransferService.changeUser(usuario);    
    this.usuarioTransferService.emitUserChange();
  }
}

