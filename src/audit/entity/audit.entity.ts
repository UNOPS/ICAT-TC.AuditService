import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'audit' })
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

 /*  @ManyToOne((type) => User, { eager: true })
  @JoinColumn()
  user: User; */

  @Column()
  logDate: string;

  @Column({ default: null })
  userName: string;

  @Column()
  description: string;

  @Column()
  actionStatus: string;

  @Column()
  userType: string;

  @Column()
  uuId: string;

}
