// Simple cache instance for Express (node-cache)
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 }); // cache for 60 seconds
export default cache;
