import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DirectusStudentsModule } from './students/directus-students.module';
import { ConfigModule } from '@nestjs/config';
import { APIModule } from './apis/api.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the environment variables available globally
    }),
    APIModule,
    DirectusStudentsModule,
    FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
