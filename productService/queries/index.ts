export const PRODUCT_QUERY = {
  GET_PRODUCT_BY_ID: `select p.id, p.title, p.description, p.price, p.imageLink, s.count from products p left join stocks s on p.id = s.product_id where id=$1;`,
  GET_PRODUCT_LIST: `select p.id, p.title, p.description, p.price, p.imageLink, s.count from products p inner join stocks s on s.product_id = p.id;`,
  INSERT_INTO_PRODUCTS: `insert into products (title, description, price, imagelink) values ($1, $2, $3, $4) returning id;`,
  INSERT_INTO_STOCKS: `insert into stocks (product_id, count) values ($1, $2);`
}