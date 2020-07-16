import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { Result } from '../util/result';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>
  ) {}

  register(pass: string):Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(pass, saltRounds);
  }

  async create(createAdminDto: CreateAdminDto): Promise<any> {
    const query  = new Admin()
    query.username = createAdminDto.username
    const findAdmin = await this.adminRepository.findOne(query)
    if (findAdmin){
      return Result.login_accountExist()
    }else {
      const admin = new Admin()
      const newPass = await this.register(createAdminDto.password)
      admin.username = createAdminDto.username
      admin.password = newPass
      await this.adminRepository.save(admin)
      return Result.success()
    }

  }

  async updatePassword(admin: Admin, newPwd: string) {
    admin.password = await this.register(newPwd)
    await this.adminRepository.save(admin)
    return Result.success()
  }

  async deleteBy(ids: Array<number>): Promise<any> {
    await this.adminRepository.delete(ids)
    return Result.success()
  }

  async findOne(createAdminDto: CreateAdminDto):Promise<Admin> {
    const query = new Admin()
    query.username = createAdminDto.username
    return await this.adminRepository.findOne(query)
  }

  async getAdminList(createAdminDto:CreateAdminDto): Promise<any> {
    const res = await this.adminRepository.createQueryBuilder('admin')
      .skip(createAdminDto.pageSize * (createAdminDto.pageNum - 1))
      .take(createAdminDto.pageSize)
      .getManyAndCount()
    return Result.success({
      list:res[0].map(item => ({username:item.username,id:item.id})),
      total:res[1]
    })
  }


}
