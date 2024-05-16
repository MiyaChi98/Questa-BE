import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { IdValidationPipe } from 'src/pipes/IDvalidation.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/decorators/has_role.decorator';
import { Role } from 'src/constant/roleEnum';
import { ATGuard } from 'src/guard/accessToken.guards';
import { RolesGuard } from 'src/guard/role.guard';
import { Request } from "express";

@ApiTags("Search")
@HasRoles(Role.TEACHER)
@UseGuards(ATGuard, RolesGuard)
@ApiBearerAuth()
@Controller('search')
export class ElasticsearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Post()
  async create(
) {
    return this.elasticsearchService.index()
  }


  @Get('searchBycourseName')
  async searchByCourseName(
    @Req() req: Request,
    @Query('courseName') courseName : string
  ){
      return this.elasticsearchService.searchBycourseName(courseName,req['user'].sub)
  }

  @Get('searchByexamName')
  async searchByExamName(
    @Req() req: Request,
    @Query('examName') examName : string
  ){
      return this.elasticsearchService.searchByexamName(examName,req['user'].sub)
  }

  @Get(':id')
  async search(
    @Param("id") id: string,
) {
    return this.elasticsearchService.get(id)
  }

  @Delete(':id')
  async delete(
    @Param("id", new IdValidationPipe()) id: string,
  ){
    console.log("course id",id)
    return this.elasticsearchService.deleteDocumentByCourseID(id)
  }
}
