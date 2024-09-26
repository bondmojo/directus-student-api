import { Module } from '@nestjs/common';
import { UpdateFilesModule } from './update-files/update-files.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DirectusModule } from './students/directus-students.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the environment variables available globally
    }),
    DirectusModule,
    UpdateFilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
