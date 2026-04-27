import * as tus from 'tus-js-client';
import { createReadStream, statSync } from 'node:fs';
import crypto from 'node:crypto';

const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
const apiKey = process.env.BUNNY_STREAM_API_KEY;
if (!libraryId || !apiKey) throw new Error('Missing Bunny env');

const title = `Lovable tus-js-client test ${new Date().toISOString()}`;
const createRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
  method: 'POST',
  headers: { AccessKey: apiKey, 'Content-Type': 'application/json', accept: 'application/json' },
  body: JSON.stringify({ title }),
});
if (!createRes.ok) throw new Error(`Bunny create failed ${createRes.status}: ${await createRes.text()}`);
const video = await createRes.json();
const videoId = video.guid as string;
const authorizationExpire = Math.floor(Date.now() / 1000) + 86400;
const authorizationSignature = crypto.createHash('sha256').update(`${libraryId}${apiKey}${authorizationExpire}${videoId}`).digest('hex');
console.log('created video', videoId);

const filePath = '/tmp/lovable-upload-test.mp4';
await new Promise<void>((resolve, reject) => {
  const upload = new tus.Upload(createReadStream(filePath), {
    endpoint: 'https://video.bunnycdn.com/tusupload',
    uploadSize: statSync(filePath).size,
    retryDelays: [0, 1000, 3000],
    chunkSize: 50 * 1024 * 1024,
    storeFingerprintForResuming: false,
    removeFingerprintOnSuccess: true,
    headers: {
      AuthorizationSignature: authorizationSignature,
      AuthorizationExpire: String(authorizationExpire),
      VideoId: videoId,
      LibraryId: libraryId,
    },
    metadata: { filetype: 'video/mp4', title },
    onProgress(sent, total) { console.log(`progress ${Math.round((sent / total) * 100)}%`); },
    onError(err) { reject(err); },
    onSuccess() { console.log('upload success'); resolve(); },
  });
  upload.start();
});
