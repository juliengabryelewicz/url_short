import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    urlCode: string;

    @Column()
    sentUrl: string;

    @Column()
    shortUrl: string;
}