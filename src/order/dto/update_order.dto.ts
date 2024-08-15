export class UpdateOrderDto {
  constructor(status: number) {
    this.status = status;
  }
  status: number;
}
