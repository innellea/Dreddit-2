import { Migration } from '@mikro-orm/migrations';

export class Migration20211225223836 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "title" to "username";');


    this.addSql('alter table "user" add column "password" text not null;');

    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
  }
}
