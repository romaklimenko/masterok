import splitContent from './splitContent';
import getBlocks from './getBlocks';

const MongoClient = require('mongodb').MongoClient;

const dbUrl = process.env.MONGO;
const dbName = 'dirty';

const fetch = require('node-fetch');
const fs = require('fs');
const request = require('request');

const Parser = require('rss-parser');

const sid = process.env.D3_SID;
const uid = process.env.D3_UID;
const csrf = process.env.D3_CSRF;
const domain = process.env.DOMAIN;
const rss = process.env.RSS;

async function download(url, path): Promise<void> {
  const fileResponse = await fetch(new URL(url).toString());
  return await new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(path);
    fileResponse.body.pipe(fileStream);
    fileResponse.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
}

async function upload(url) {
  const tempFile = '/tmp/temp.jpeg';

  await download(url, tempFile);

  return new Promise((resolve, reject) => {
    const options = {
      'method': 'POST',
      'url': 'https://d3.ru/api/images/',
      'headers': {
        'X-Futuware-UID': uid,
        'X-Futuware-SID': sid
      },
      formData: {
        'name': 'image.jpeg',
        'file': {
          'value': fs.createReadStream(tempFile),
          'options': {
            'contentType': null
          }
        }
      }
    };

    request(options, function (error, response) {
      if (error) {
        reject(error)
      } else {
        resolve(JSON.parse(response.body));
      }
    })
  });
}

async function publish(item) {
  console.log(item.title + ':' + item.link);

  const fragments = splitContent(item['content:encoded']);
  const blocks = getBlocks(fragments);

  const data = {
    data: {
      blocks: [],
      type: 'article',
      title: item.title,
    },
    tags: item.categories
  };

  data.data.blocks.push({
    type: 'text',
    text: `(<a href="${item.link}">источник</a>)`
  });

  for (const block of blocks) {
    if (block.type === 'image') {
      const media = await upload(block.rawUrl);
      block.url = media['media_url'];
      console.log(block.url);
      data.data.blocks.push(block);
    } else if (block.type === 'text') {
      data.data.blocks.push(block);
    } else if (block.type === 'embed') {
      const body = new URLSearchParams();
      body.append('csrf_token', csrf);
      body.append('url', block.url);

      const response = await fetch('https://d3.ru/ajax/urls/video/info/', {
        method: 'POST',
        headers: {
          'Cookie': `uid=${uid}; sid=${sid};`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      });

      const json = await response.json();

      if (json.status === 'OK') {
        block.url = json.url.url;
        block.embed = {
          provider: json.media_provider,
          id: json.media_provider_id
        }
        data.data.blocks.push(block);
      }
      else {
        console.log('ERR', json);
      }
    }
  }

  console.log(item.categories);

  const response = await fetch('https://d3.ru/api/drafts/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Futuware-UID': uid,
      'X-Futuware-SID': sid
    },
    body: JSON.stringify(data)
  });

  console.log(response.status);

  const draft = await response.json();

  console.log(draft.id);

  fetch(`https://d3.ru/api/drafts/${draft.id}/publish/?domain_prefix=${domain}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Futuware-UID': uid,
      'X-Futuware-SID': sid
    }
  });
}

async function masterok() {
  const feed = await new Parser().parseURL(rss);
  console.log(feed.title);

  const client = new MongoClient(
    dbUrl,
    { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);

  for (const item of feed.items) {
    const doc = await db.collection('masterok')
      .findOne({ _id: item.link });

    if (doc) {
      continue;
    }

    try {
      await publish(item);
      await db.collection('masterok').insertOne({ _id: item.link });
    } catch (error) {
      console.log(error);
      await db.collection('masterok').insertOne({
        _id: item.link,
        error: JSON.stringify(error)
      });
    }

    break;
  }

  client.close();
}

// masterok();

module.exports = masterok;