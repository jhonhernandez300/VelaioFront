import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDataService } from '../../../servicios/application-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../general/confirm-dialog/confirm-dialog.component';
import { CloseDialogComponent } from '../../general/close-dialog/close-dialog.component';
import { iTarea } from '../../../interfaces/iTarea';
import { UsuarioTransferService } from '../../../servicios/usuario-transfer.service';
import { iUsuario } from '../../../interfaces/iUsuario';

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.component.html',
  styleUrls: ['./crear-tarea.component.css']
})
export class CrearTareaComponent implements OnInit{
  myForm!: FormGroup; 
  submitted = false;
  tareaIdSeleccionada!: number;
  usuario: iUsuario | null = null;
  selectedUsuarioId!: number;
  tareas: iTarea[] = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private applicationDataService: ApplicationDataService,
    private router: Router,
    public dialog: MatDialog,
    private usuarioTransferService: UsuarioTransferService 
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {   
    this.initializeForm();
    
    this.usuarioTransferService.currentUser.subscribe(usuario => {
      
      if(usuario != null){
        this.usuario = usuario;
        //console.log("En update ", this.usuario);    
      }      
    });
  }

  private initializeForm(): void {
    this.myForm = this.formBuilder.group({                                      
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      estado: ['En Proceso'],
      usuarioId: ['']
    });
  }

  public onReset(): void {
    this.submitted = false;
    this.myForm.reset();
  }

  private generateTareaId(): number {
    // Generar un nuevo ID único para la tarea
    return Math.floor(Math.random() * 1000);  
  }

  public async onSubmit(): Promise<void> {
    this.submitted = true;    
    this.myForm.patchValue({
      usuarioId: this.usuario?.usuarioId
    });

    if (this.myForm.invalid) {
      this.dialog.open(CloseDialogComponent, {            
          data: { message: "Revise los valores del formulario" } 
      });
      return;
    }   
  
    const newTarea = {
        tareaId: this.generateTareaId(),  
        descripcion: this.myForm.get('descripcion')?.value,
        estado: this.myForm.get('estado')?.value
    };

    if(this.usuario?.usuarioId != null){
      this.applicationDataService.addTaskToUser(this.usuario.usuarioId, newTarea);    
      this.dialog.open(ConfirmDialogComponent, {            
        data: { message: "Tarea agregada con éxito" } 
      });
  
      // Reiniciar el formulario después de la adición exitosa
      this.onReset(); 
    }     
  }


  get form(): { [key: string]: AbstractControl; }
  {
      return this.myForm.controls;
  }
}
