import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { LocationsController } from './controller/location.controller';
import { BuildingController } from './controller/building.controller';
import { LocationsService } from './services/locations/locations.service';
import { BuildingsService } from './services/buildings/buildings.service';
import { Location } from './entities/location.entity';
import { Building } from './entities/building.entity';
import { LoggerMiddleware } from './middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NotFoundInterceptor } from './interceptors/not-found.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Building]),
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [AppController, LocationsController, BuildingController],
  providers: [
    AppService,
    LocationsService,
    BuildingsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: NotFoundInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
