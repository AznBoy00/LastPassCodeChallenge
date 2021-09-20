export interface Response {
  username: string;
  auth_token: string;
}

const APIDomain = '127.0.0.1:3001';

const authenticateUser = async (username: string, password: string): Promise<Response> => {
  // ENDPOINT, PARAMS
  const url = `//${APIDomain}/auth`;
  const params = {
    username,
    password,
  };
  const settings = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'content-type': 'application/json' },
  };

  // POST REQUEST
  const response = await fetch(url, settings);
  
  // DATA RESPONSE
  const data = (await response.json());

  if (response.status === 200) {
    data.success = true;
  } else {
    data.success = false;
  }
  
  return data;
};

export default authenticateUser;
