export const generatePolicy = ( principalId, resourse, effect="Allow" ) => {
  console.log(`principalId ${principalId}; resource ${resourse}; effect ${effect}`)

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resourse
        }
      ]
    }
  }
}