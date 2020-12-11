const express = require('express');
require('dotenv').config();
const axios = require('axios');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());

app.all('*', async function interceptor (req, res) {
  console.log('req.originalUrl', req.originalUrl);
  console.log('req.method', req.method);
  console.log('body', req.body);

  const recipent = req.originalUrl.split('/')[1];
  console.log('recipent', recipent);
  const recipentUrl = process.env[recipent];

  console.log(`COMPLETED URL: ${recipentUrl}${req.originalUrl}`);
  
  const isCartURL = /\/cart/.test(req.originalUrl);
  console.log('REGEXP RESULT: ',  isCartURL);
  
  if(recipentUrl) {
    const axiosConfig = {
      method: req.method,
      url: `${recipentUrl}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && {data: req.body}),
    };

    console.log('axios config: ', axiosConfig);

    try {
      const recipentResponse = await axios(axiosConfig);

      console.log('recipentResponse: ', recipentResponse);

      res.status(200).json(recipentResponse.data);
    } catch (error) {
      console.log('error: ', error);

      if(error.response) {
        const {
          status,
          data,
        } = error.response;

        res.status(status).json({ data });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.status(502).json({ error: 'Can not process request'});
  }

});

app.listen(PORT, () => {
  console.log(`bff service is listened at http://localhost:${PORT}`);
});

