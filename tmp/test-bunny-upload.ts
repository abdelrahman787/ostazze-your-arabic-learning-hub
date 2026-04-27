import { createClient } from '@supabase/supabase-js';
import * as tus from 'tus-js-client';
import { createReadStream, statSync } from 'node:fs';

const supabaseUrl = 'https://dqqfzpghixfvhhpxfgwv.supabase.co';
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcWZ6cGdoaXhmdmhocHhmZ3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTMzNjcsImV4cCI6MjA4ODY2OTM2N30.7WsVUn0uoogL7xfQ80Fw_UUncbEHPf10tPYue4DuYSg;
const supabase = createClient(supabaseUrl, supabaseKey);

const filePath = '/tmp/lovable-upload-test.mp4';
const title = `Lovable upload test ${new Date().toISOString()}`;

const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
  email: 'admin@ostazze.com',
  password: 'Admin@123456',
});
if (signInError || !signInData.session) throw new Error(`Signin failed: ${signInError?.message}`);
console.log('signed in as admin');

const { data, error } = await supabase.functions.invoke('bunny-create-video', { body: { title } });
if (error) throw new Error(`create function failed: ${error.message} ${JSON.stringify(error.context ?? {})}`);
console.log('create function returned', { videoId: data.videoId, libraryId: data.libraryId, endpoint: data.tusEndpoint, expire: data.authorizationExpire });

await new Promise<void>((resolve, reject) => {
  const size = statSync(filePath).size;
  const upload = new tus.Upload(createReadStream(filePath), {
    endpoint: data.tusEndpoint,
    uploadSize: size,
    retryDelays: [0, 1000, 3000],
    chunkSize: 50 * 1024 * 1024,
    removeFingerprintOnSuccess: true,
    headers: {
      AuthorizationSignature: data.authorizationSignature,
      AuthorizationExpire: String(data.authorizationExpire),
      VideoId: data.videoId,
      LibraryId: data.libraryId,
    },
    metadata: {
      filetype: 'video/mp4',
      title,
    },
    onProgress(sent, total) {
      console.log(`progress ${sent}/${total}`);
    },
    onError(err) {
      reject(err);
    },
    onSuccess() {
      console.log('upload success', upload.url);
      resolve();
    },
  });
  upload.start();
});
