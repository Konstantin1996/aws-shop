import { createResponse } from '../../helpers/createResponse';

export const importFileParser = async (event) => {
  console.log('import file parser ', event);
  return createResponse(200, {});
};
