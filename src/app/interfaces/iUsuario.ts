import { iHabilidad } from "./iHabilidad";
import { iTarea } from "./iTarea";

export interface iUsuario{   
    usuarioId: number, 
    nombre: string,
    email: string,    
    password: string,    
    Edad: number,
    habilidades: iHabilidad[];     
    tareas: iTarea[];
}