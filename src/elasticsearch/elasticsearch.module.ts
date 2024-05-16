import { Module } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { ElasticsearchController } from './elasticsearch.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule],
  providers: [ElasticsearchService],
  controllers: [ElasticsearchController],
  exports: [ElasticsearchService],
})
export class ElasticsearchModule {}
