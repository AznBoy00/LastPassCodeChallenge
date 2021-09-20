// Generate a consistent Salt using Password
const getSalt = (password: string) => {
  let salt = [];
  // Uint8Array(16)
  for (var i = 0; i < 16; i++) {
    salt[i] = password.charCodeAt(i % (password.length - 1));
  }

  return new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
};

// Generate a consistent IV using username
const getIV = (username: string) => {
  let iv = [];
  // Uint8Array(12)
  for (var i = 0; i < 12; i++) {
    iv[i] = username.charCodeAt(i % (username.length - 1));
  }

  return new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
};

function getPrivateInfoEncoding(privateInfo: string) {
  let enc = new TextEncoder();
  return enc.encode(privateInfo);
}

async function getImportKey(password: string) {
  const enc = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return key;
}

async function getDerivedKey(password: string) {
  const key = await getImportKey(password);
  const salt = getSalt(password);
  const derivedKey = window.crypto.subtle.deriveKey(
    {
      "name": "PBKDF2",
      salt,
      "iterations": 100000,
      "hash": "SHA-256"
    },
    key,
    { "name": "AES-GCM", "length": 256 },
    true,
    ["encrypt", "decrypt"]
  );

  return derivedKey;
}

export async function saveEncryptedPrivateInfo(username: string, password: string, privateInfo: string) {
  const derivedKey = await getDerivedKey(password);
  const iv = getIV(username);
  // console.log('iv', iv);
  let ciphertext;
  const encoded = getPrivateInfoEncoding(privateInfo);

  ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    derivedKey,
    encoded,
  );

  localStorage.setItem('privateInfo', JSON.stringify(new Uint8Array(ciphertext)));

  return true;
}

export async function decryptPrivateInfo(username: string, password: string, privateInfoEncrypted: any) {
  try {
    const encodedPrivateInfo = JSON.parse(privateInfoEncrypted);
    let i = 0;
    let endOfObject = false;
    let encodedArrayBuffer: any = [];
    do {
      if (encodedPrivateInfo[i]) {
        encodedArrayBuffer[i] = encodedPrivateInfo[i];
        i++;
      } else {
        endOfObject = true;
      }
    } while (!endOfObject);

    // console.log('encodedPrivateInfo', encodedPrivateInfo.buffer);
    const iv = getIV(username);
    const derivedKey = await getDerivedKey(password);
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      derivedKey,
      new Uint8Array(encodedArrayBuffer).buffer,
    );

    let dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (e) {
    console.error('Decryption Failed');
    return false;
  }
}