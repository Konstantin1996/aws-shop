--create table products (
--	id uuid primary key	default uuid_generate_v4(),
--	title text not null,
--	description text,
--	price integer
--)

--insert into products (title, description, price) values ('Blue case', 'Blue case for you Iphone 8 with cool print from the movie avengers', 300);
--insert into products (title, description, price) values ('Sponge bob case', 'Case for you Iphone SE with Sponge bob print', 300);
--insert into products (title, description, price) values ('Battlefield', 'Exclusive case for Iphone 8 from the game', 400);

--drop table products;

--create table stocks (
--	product_id uuid references products(id),
--	count integer
--)

--insert into stocks (product_id, count) values ('a51909a2-f78e-436d-9426-26d757d7f44c', 15)
--insert into stocks (product_id, count) values ('4f2c90d7-9e99-48e9-9b61-aa1f7714b05b', 3)
--insert into stocks (product_id, count) values ('8e4180fa-e21f-4e3d-a2e0-a0249559b0bf', 5)

--drop table stocks;

--create extension if not exists "uuid-ossp";