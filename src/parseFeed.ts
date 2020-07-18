const Parser = require('rss-parser');

const parseFeed = async (feed: string) => {
  return await new Parser().parseString(feed);
};

export default parseFeed;
