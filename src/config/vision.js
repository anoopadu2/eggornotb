const vision = require('@google-cloud/vision');

const SACREDENTIALS = JSON.parse(JSON.stringify(
    {
        "type": "service_account",
        "project_id": "geometric-bolt-384002",
        "private_key_id": "4e56ff4096ca5d8d572a2f64f67ea12274bf42fc",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDIXzq6tTcl3g8m\n1Sdu/bP6ldkhX/7mVE/lLAX1wmu6HJGzt9DbJinVWkcrR7/CkvNe/T3ikgiEAM81\n/ROIwCs4kh+gsM+yCFSv9JLPStTiuDWK66PkAkeBDh1XdLUTqKXmBrjKy0c3qu/V\nnk4l4dFGZNVKGg3PNZrt+EgygDbV+yYdjgFrzpiwORBJ4Mde3TGbSNcMRoKftWp4\nLlUoBWOOjQy+UatRNPm7+MNocrTAKNCNq369WxLXlEjuNnpjDCURgeVd9OWaO7PH\niOylM1LL43CFPB4Mz4P9/oPdhXsLwHoySiZE5C/SHaSiQZNEybuLkdR9NuNL8KxY\nh3psqpgPAgMBAAECggEAFLcfs8DbcDtKdrnPx15MVqpaVeR+TmLGFcvc2+EbURT2\nDU4CNj32Ujvwoq1aymt15MqqtLtjTP5mbc75z4gKj+EviuXsuxu4Ya6X5P14D+56\nfp/JBGAl81Y5u1pyBBPJ/wOP5Etq0/sEq6Gfs7PqdmwjTvNtnRAOMe8ay7nMsYeE\nN2zOHKp7Nog3aaZP/kEKGovQkRPOwciWEIvzebpb86CVu83f3x2UxuVK5SU7//08\na9ALujpKe0uVPZr7uM/KaKPrd8WWMZqJnJdlzbiVnekvJtizFeetC/Up2wX7g1MA\nrSQWhQOtbon+yGcydoAqOeXy0Hhaeiy8E3yQuoZX6QKBgQDqwZDEIwaMJRdJOlAL\nt1N0WNBw66bB+hvp7XuCrdhHLpVIfB+8BjrrsP9tfnYCsgvJuPTMJ23nzWtYyLcv\nWBLNQebmCoQYfebQtk7NmyiMukhcf6WyNYJbZ8wR+m62f9GIKQuldVAGcbCl7iiU\n29EC7SRvUmF9/XoK5vKDcthKyQKBgQDagRxCC8u8yFy9ho4VMrYQeVDRGIFhj+FV\nbRhE6m+yaZUQNPxZ/jP/2yz0kWZGcK5JnGFTMRBCw6dvUUxjBif6YDB2rQDtLnCc\nmMYcp4bScWTICeaGMNtIJkZ6HeK9KtR6cmdXOgGtoOfQ4FeuYLYLThMkWnP0cnGi\nP2aFZWzgFwKBgFaq3Yo7sBgfPWiQearJpKrIezOlHCxy7MlBHp8RFU66OOzIvmKJ\nHkmTT8mZrXGzT7zKZr3UNLQmV2Iwv8hfyJk0okz9RuVP3d3h4Ffx11eVEk/r5D1V\nmemq+WENxr/jknSlSqJsG/41DNVFhn/mY1SkPhZHIK0F3n+V4aR7yrRZAoGBANm0\nRARmHlN0yjonY08pnI7jYKtEoDwlj9x+euzHLAz194gTUs8TYJnutWbjq6RJRs2e\n2rV5r/rlV+CoftQ24QQsbH0BuGeYmqjb6p/IJqNsSX6ppp5S9Vh4kkW/mxbhIpzx\neZdF+0AUjoPl0laykw7GdnoFCX0nvaJrSulj+ct3AoGAVEGXLa4i6Rb8x+qBRDrG\nzwhpXYWVGPuC/+vHpQJQT0IjA3E0HfazTe1CwXpyifR5Ja3RLsQmW8MaWlzBU9cZ\nCLcLN1ou1uSrAEGBBTth1syueqwLU2BWjv+LkYcQfaWbiuupc64KxKfM2sfaa38h\nPuySHThdeknPKORhL81TTss=\n-----END PRIVATE KEY-----\n",
        "client_email": "eggornotservice1@geometric-bolt-384002.iam.gserviceaccount.com",
        "client_id": "107344281170270422760",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/eggornotservice1%40geometric-bolt-384002.iam.gserviceaccount.com"
      }));

const SACONFIG = {
    credentials: {
        private_key: SACREDENTIALS.private_key,
        client_email: SACREDENTIALS.client_email
    }
};

export const client = new vision.ImageAnnotatorClient(SACONFIG);

export const detectLabel = async() => {
    const [result] = await client.labelDetection('./1.png');
    console.log(result);
}