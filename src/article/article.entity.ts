import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Comment } from '../comment/comment.entity';
const moment = require('moment');

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({type:'text'})
  content: string;

  @Column({type:"datetime", transformer:{
      from(value: any): any {
        return moment(value).format('YYYY年MM月DD日 HH:mm:ss')
      },
      to(value: any): any {
        return value
      }
    }})
  createTime:string;

  @Column({default:0})
  viewNum:number;

  @OneToMany(type => Comment,comment => comment.user)
  comments:Comment[]



}
