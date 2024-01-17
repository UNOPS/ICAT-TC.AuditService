import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'audit-country' })
export class AuditCountry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  logDate: string;

  @Column()
  logTime: string;

  @Column({ default: null })
  userName: string;

  @Column()
  description: string;

  @Column()
  actionStatus: string;

  @Column({ default: null })
  userType: string;

  @Column({ default: null })
  uuId: string;

  @Column({ default: null })
  institutionId: number;

  @Column({ default: null })
  countryId: number;
}
