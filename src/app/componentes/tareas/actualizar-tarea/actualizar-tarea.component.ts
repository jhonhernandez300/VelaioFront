import { Component, OnInit } from '@angular/core';
import { TareaTransferService } from '../../../servicios/tarea-transfer.service';
import { UsuarioTransferService } from '../../../servicios/usuario-transfer.service';
import { iTarea } from '../../../interfaces/iTarea';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../general/confirm-dialog/confirm-dialog.component';
import { CloseDialogComponent } from '../../general/close-dialog/close-dialog.component';
import { iUsuario } from '../../../interfaces/iUsuario';
import { ApplicationDataService } from '../../../servicios/application-data.service'

@Component({
  selector: 'app-actualizar-tarea',
  templateUrl: './actualizar-tarea.component.html',
  styleUrl: './actualizar-tarea.component.css'
})
export class ActualizarTareaComponent implements OnInit{
  tarea: iTarea | null = null;
  myForm!: FormGroup;
  selectedEstadoId!: number;
  submitted = false;
  tareaIdSeleccionado!: number;    
  showSection: string = "userChosen"
  usuario: iUsuario = {
    usuarioId: 0,
    nombre: '',
    email: '',
    password: '',
    edad: 0,
    habilidades: [],
    tarea: []
  };
  estados = ['Pendiente', 'En proceso', 'Completado'];

  constructor(
    private tareaTransferService: TareaTransferService,
    private usuarioTransferService: UsuarioTransferService,
    private formBuilder: FormBuilder,
    private applicationDataService: ApplicationDataService,
    private router: Router,
    public dialog: MatDialog
  ){this.initializeForm();}

    obtenerUsuarioDeLaTarea(): void{
      const usuario = this.applicationDataService.getUserByTaskId(this.tarea?.tareaId || 0); 
      if (usuario) {
        // Solo asigna si no es undefined
        this.usuario = usuario; 
      }
    }

  ngOnInit() {
    this.obtenerTarea();
    this.obtenerUsuarioDeLaTarea();
    this.initializeForm();
    this.usuarioTransferService.userChange$.subscribe(() => {       
      this.updateUser();
    });

  }

  obtenerTarea(): void{
    this.tareaTransferService.currentTask.subscribe(tarea => {
      
      if(tarea != null){
        this.tarea = tarea;        
        this.myForm.patchValue(tarea);        
      }      
    });    
  }

  private initializeForm(): void {
    this.myForm = this.formBuilder.group({                                
      tareaId: [this.tarea?.tareaId],
      descripcion: [this.tarea?.descripcion,[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      estado: [this.tarea?.estado]      
    });
  }

  public onReset(): void {
    this.submitted = false;
    this.myForm.reset();
  }

  public async onSubmit(): Promise<void> {
    this.submitted = true;   
    //console.log("Form value ", this.myForm.value);        

    if (this.myForm.invalid) {
      //console.log('Error de validación');
      this.dialog.open(CloseDialogComponent, {            
        data: { message: "Revise los valores del formulario" } 
      });
      return;
    }     
  }

  public onChangeUser(): void{    
    this.showSection = "table";      
    this.usuarioTransferService.emitUserChange();
  }

  get form(): { [key: string]: AbstractControl; }
  {
      return this.myForm.controls;
  }

  updateUser(): void{
    this.usuarioTransferService.currentUser.subscribe(usuario => {
      
      if(usuario != null){
        this.usuario = usuario;     
        this.showSection = "userChosen";
      }      
    });    
  }
}
