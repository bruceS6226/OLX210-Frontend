export class EstadoDatos {
  constructor(
    public id_estado_datos: number,
    public nombre_apellido_publico: boolean,
    public foto_publica: boolean,
    public correo_publico: boolean,
    public telefono_publico: boolean,
    public genero_publico: boolean,
    public fecha_nacimiento_publica: boolean,
    public ubicacion_publica: boolean,
    public numero_documento_publico: boolean,
    public tipo_usuario_publico: boolean,
    public tipo_documento_publico: boolean,
    public clase_usuario_publica: boolean,
  ){}
}