import 'source-map-support/register';
import { getProductsList } from './src/modules/getProductsList';
import { getProductsById } from './src/modules/getProductsById';
import { createProduct } from './src/modules/createProduct';
import { catalogBatchProcess } from './src/modules/catalogBatchProcess';

export {
  getProductsList,
  getProductsById,
  createProduct,
  catalogBatchProcess
}