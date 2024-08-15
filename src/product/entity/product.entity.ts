import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  identifier: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  created_at: Date;

  @Column()
  modified_at: Date;
}

export class ProductFactory {
  static create(name: string, price: number): Product {
    const product = new Product();
    product.name = name;
    product.price = price;
    product.created_at = new Date();
    product.modified_at = new Date();
    return product;
  }
}
