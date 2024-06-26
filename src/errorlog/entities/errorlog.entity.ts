
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'errorlog' })
export class Errorlog  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: number;

  @Column()
  logdate: string;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  message: string;

}

