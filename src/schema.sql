drop table if exists users;
drop table if exists tournaments;
drop table if exists stocks;
drop table if exists userStocks;
drop table if exists userOrders;
drop table if exists userDiaryPortfolios;

create table users (
	id serial primary key,
  	name text not null,
  	email text not null unique,
  	senha text not null,
    cpf text,
    telefone text
);

create table tournaments (
	id serial primary key,
  	name text not null,
  	createdAt date not null,
  	tipo text not null,
    endDate date,
    startMoney smallint,
    user_id smallint REFERENCES users(id),
    maxStocks smallint
);

create table stocks (
	ticker text primary key unique,
  	name text not null,
  	logo text,
    price smallint
);

create table userStocks (
    id serial primary key,
    user_id smallint REFERENCES users(id),
    tournament_id smallint REFERENCES tournaments(id),
    stock_ticker text REFERENCES stocks(ticker),
    quantity smallint not null,
    avgPrice smallint not null
);

create table userOrders (
    id serial primary key,
    user_id smallint REFERENCES users(id),
    tournament_id smallint REFERENCES tournaments(id),
    stock_ticker text REFERENCES stocks(ticker),
    quantity smallint not null,
    unitValue smallint not null,
    date date not null,
    type text not null
);

create table userDiaryPortfolios (
    id serial primary key,
    user_id smallint REFERENCES users(id),
    tournament_id smallint REFERENCES tournaments(id),
    money smallint not null,
    portfolioValue smallint not null,
    date date not null
);
