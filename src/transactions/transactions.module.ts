import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Transaction, transactionSchema } from "./schemas/transaction.schema";
import { TransactionsService } from "./services/transactions.service";
import { TransactionsController } from "./controllers/transactions.controller";
import { User, userSchema } from "src/users/schemas/users.schema";

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Transaction.name, schema:transactionSchema},
      {name:User.name, schema:userSchema}
    ])
  ],
  controllers:[
    TransactionsController
  ],
  providers:[
    TransactionsService
  ]
})
export class TransactionsModule{}


































/*import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { User, userSchema } from 'src/users/schemas/users.schema';
import { ExchangeRate, ExchangeRateSchema } from 'src/exchange-rates/schemas/exchage-rates.schema';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsService } from './services/transactions.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: User.name, schema: userSchema },
      { name: ExchangeRate.name, schema: ExchangeRateSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
*/
