--create table products (
--	id uuid primary key	default uuid_generate_v4(),
--	title text not null,
--	description text,
--	price integer
--)

--insert into products (title, description, price, imageLink) values ('Blue case', 'Blue case for you Iphone 8 with cool print from the movie avengers', 300, 'https://www.dhresource.com/0x0/f2/albu/g7/M00/AB/BD/rBVaSVvtSaKAV6WPAAFQeMTIJAg940.jpg');
--insert into products (title, description, price, imageLink) values ('Sponge bob case', 'Case for you Iphone SE with Sponge bob print', 300, 'https://i8.rozetka.ua/goods/18493239/219233695_images_18493239541.jpg');
--insert into products (title, description, price, imageLink) values ('Battlefield', 'Exclusive case for Iphone 8 from the game', 400, 'https://img.100gadgets.ru/prints/5815_162_300x300.jpg');

--delete from products;
--delete from stocks;
--alter table products add column imageLink text

--select * from products where products.id='9a27cd19-45e2-4b91-a0d9-e7bc9f51d0dd';

--drop table products;

--create table stocks (
--	product_id uuid references products(id),
--	count integer
--)

--insert into stocks (product_id, count) values ('9a27cd19-45e2-4b91-a0d9-e7bc9f51d0dd', 15);
--insert into stocks (product_id, count) values ('dbd48ffc-1568-429d-8d80-5ae61a59a9ea', 3);
--insert into stocks (product_id, count) values ('3ef68573-b20c-4a57-bce4-a60fbf7abb93', 5);

--drop table stocks;

--create extension if not exists "uuid-ossp";

--select (id, title, description, price, count) from products inner join stocks on stocks.product_id = products.id;

--select * from stocks;
--select * from products;