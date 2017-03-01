import rp from 'request-promise';

// Keys are GitHub API URLs, values are { etag, result } objects
const eTagCache = {};

const GITHUB_API_ROOT = 'https://api.github.com';

export class GitHubConnector {
  constructor() {
    this.clientId = process.env.GITHUB_CLIENT_ID;
    this.clientSecret = process.env.GITHUB_CLIENT_SECRET;

    // Allow mocking request promise for tests
    this.rp = rp;
    if (GitHubConnector.mockRequestPromise) {
      this.rp = GitHubConnector.mockRequestPromise;
    }
  }

  get(path) {
    const url = GITHUB_API_ROOT + path;

    const options = {
      json: true,
      resolveWithFullResponse: true,
      headers: {
        'user-agent': 'GitHunt',
      },
    };

    if (this.clientId) {
      options.qs = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
      };
    }

    const cachedRes = eTagCache[url];

    if (cachedRes && cachedRes.eTag) {
      options.headers['If-None-Match'] = cachedRes.eTag;
    }
    return new Promise((resolve, reject) => {
      this.rp({
        uri: url,
        ...options,
      }).then((response) => {
        const body = response.body;
        eTagCache[url] = {
          result: body,
          eTag: response.headers.etag,
        };
        resolve(body);
      }).catch((err) => {
        if (err.statusCode === 304) {
          resolve(cachedRes.result);
        } else {
          reject(err);
        }
      });
    });
  }
}
