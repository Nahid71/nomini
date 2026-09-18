import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { OrdersModule } from './orders/orders.module';
import { InvestmentsModule } from './investments/investments.module';
import { DppModule } from './dpp/dpp.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { TeamModule } from './team/team.module';
import { UploadModule } from './upload/upload.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TasksModule,
    OrdersModule,
    InvestmentsModule,
    DppModule,
    ProductsModule,
    UsersModule,
    TeamModule,
    UploadModule,
    CategoriesModule,
  ],
})
export class AppModule {}
