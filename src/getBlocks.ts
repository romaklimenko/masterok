const cheerio = require('cheerio');

const getBlocks = (fragments: string[]) => {
  const blocks = [];

  fragments.forEach(fragment => {
    const $ = cheerio.load(fragment);

    if (fragment.toLowerCase().startsWith('<img')) {
      const block = {
        type: 'image',
        rawUrl: $('img').attr('src'),
        align: 'center'
      };
      blocks.push(block);
    } else if (fragment.toLowerCase().startsWith('<iframe')) {
      const iframeSrc = $('iframe').attr('src');
      const block = {
        align: 'center',
        type: 'embed',
        rawUrl: iframeSrc,
        url: iframeSrc
      };
      blocks.push(block);
    } else {
      const block = {
        type: 'text',
        text: '<br>' + $.html()
      };
      if (block.text === '') {
        return;
      }
      blocks.push(block);
    }
  });

  return blocks;
};

export default getBlocks;