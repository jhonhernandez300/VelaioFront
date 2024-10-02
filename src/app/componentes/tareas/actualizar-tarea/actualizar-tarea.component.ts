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

  usuarioNuevo: iUsuario = {
    usuarioId: this.usuario?.usuarioId || 0,  
    nombre: '',  
    email: '',
    password: '',
    edad: 0,
    habilidades: [], 
    tarea: []  
  };

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
    //Eliminar tarea al inicio para que en formulario esté la que va a quedar
    if(this.tarea?.tareaId != null)
      this.eliminarTarea(this.tarea?.tareaId);    
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

  eliminarTarea(tareaId: number): void {
    if (this.tarea) {          
        this.usuario.tarea = this.usuario.tarea.filter(
          (h) => h.tareaId !== tareaId
        );      
    }    
  }

  public async onSubmit(): Promise<void> {
    this.submitted = true;   
    console.log("Form value ", this.myForm.value);        

    if (this.myForm.invalid) {
      //console.log('Error de validación');
      this.dialog.open(CloseDialogComponent, {            
        data: { message: "Revise los valores del formulario" } 
      });
      return;
    }     

    this.agregarTarea();

    this.usuarioNuevo = {
      usuarioId: this.usuario.usuarioId,
      nombre: this.usuario.nombre,
      email: this.usuario.email,
      password: this.usuario.password,
      edad: this.usuario.edad,
      habilidades: this.usuario.habilidades, 
      tarea: this.usuario.tarea
    };
    
    this.applicationDataService.deleteUser(this.usuario?.usuarioId);
    this.applicationDataService.addUser(this.usuarioNuevo);
    this.dialog.open(CloseDialogComponent, {            
      data: { message: "Tarea actualizada exitosamente." }  
    });
    this.usuarioTransferService.emitUserRestartChange();
    this.router.navigate(['/obtener-todas-tareas']);
  }

  agregarTarea() {
    if (this.myForm.get('descripcion')?.invalid) {
      this.submitted = true;
      // No agregar si el campo es inválido
      return;  
    }

    const nuevaTarea = {
      descripcion: this.myForm.get('descripcion')?.value,
      estado: this.myForm.get('estado')?.value,
      // Ejemplo para generar un ID único temporalmente
      tareaId: Date.now()  
    };
    
    this.usuario.tarea.push(nuevaTarea);
    this.myForm.get('descripcion')?.reset();
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
