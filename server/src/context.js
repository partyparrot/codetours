import { GitHubConnector } from './github-connector';

export function context(headers, secrets) {
  return {
    secrets,
    github: new GitHubConnector(
      secrets.GITHUB_CLIENT_ID,
      secrets.GITHUB_CLIENT_SECRET
    ),
  };
}
