export class Categoria {
  constructor(
    public id_categoria: number,
    public nombre_categoria: string,
    public descripcion_categoria: string,
    public id_categoria_padre: number,
    public bloqueado: boolean,
    public categoria?: Categoria[]
  ) { }
}
