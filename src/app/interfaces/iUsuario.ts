import { iHabilidad } from "./iHabilidad";
import { iTarea } from "./iTarea";

export interface iUsuario{   
    usuarioId: number, 
    nombre: string,
    email: string,    
    password: string,    
    edad: number,
    habilidades: iHabilidad[];     
    tarea: iTarea[];
}