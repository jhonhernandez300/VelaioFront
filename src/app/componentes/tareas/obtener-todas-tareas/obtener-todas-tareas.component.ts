import { Component, OnInit, ViewChild } from '@angular/core';
import { iUsuario } from '../../../interfaces/iUsuario';
import { iTarea } from '../../../interfaces/iTarea';
import { TareaService } from '../../../servicios/tarea.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../general/confirm-dialog/confirm-dialog.component';
import { CloseDialogComponent } from '../../general/close-dialog/close-dialog.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TareaTransferService } from '../../../servicios/tarea-transfer.service';
import { ApplicationDataService } from '../../../servicios/application-data.service';
import { SessionStorageService } from '../../../servicios/session-storage.service';

@Component({
  selector: 'app-obtener-todas-tareas',
  templateUrl: './obtener-todas-tareas.component.html',
  styleUrl: './obtener-todas-tareas.component.css'
})
export class ObtenerTodasTareasComponent implements OnInit {
  dataSource = new MatTableDataSource<iTarea>([]); 
  errorMessage: string = '';  
  showDiv = false;  
  userChoice = false;  
  users: iUsuario[] = [];
  displayedColumns: string[] = ['descripcion', 'estado', 'update'];

  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(
    private router: Router,    
    private tareaService: TareaService, 
    public dialog: MatDialog,
    public tareaTransferService: TareaTransferService,
    private applicationDataService: ApplicationDataService,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit(): void {    
    this.loadAll();
  }

  public loadAll(): void {
    this.users = this.applicationDataService.getUsers();
    //console.log("users ", this.users);

    const tareasConUsuario = this.users.flatMap(user => 
      user.tarea.map(tarea => ({        
        tareaId: tarea.tareaId,
        descripcion: tarea.descripcion, 
        estado: tarea.estado
      }))
    );
    this.dataSource.data = tareasConUsuario; 
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
 
  update(tarea: iTarea) {
    this.tareaTransferService.changeTarea(tarea);
    this.router.navigate(['/actualizar-tarea']);        
  }  

  // private updateTareas(id: number): void {    
  //   this.dataSource.data = this.dataSource.data.filter(usuario => usuario.usuarioId !== id);
  // }

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
}

