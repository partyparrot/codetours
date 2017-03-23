import { loadFront } from 'yaml-front-matter';
import execRegexOrThrow from './execRegexOrThrow';

export function parseMD(md) {
  const {
    title,
    code,
    __content: content,
  } = loadFront(md);

  const metadata = parseGitHubURL(code);

  const contentBlocks = parseContentBlocks(content, metadata);

  // these lines have already been used to create the introduction step,
  // remove them from the step root
  const { lineStart, lineEnd, ...cleanMetadata } = metadata;

  return {
    title,
    codeUrl: code,
    content: contentBlocks,
    ...cleanMetadata,
  };
}

function parseGitHubURL(url) {
  // XXX this regex fails when there is only one line selected
  const re = /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/([^#]+)(#L(\d+)(-L(\d+))?)?/;
  const [
    _str,
    user,
    repoName,
    commit,
    filePath,
    _unused,
    lineStart,
    _unused2,
    lineEnd,
  ] = execRegexOrThrow(re, url);

  const fileUrl = url.split('#')[0];

  return {
    user,
    repoName,
    fullRepoName: user + '/' + repoName,
    commit,
    filePath,
    lineStart,
    lineEnd,
    fileUrl,
  };
}

function parseContentBlocks(content, metadata) {
  const lines = content.split('\n');

  const segments = [];

  // init the introduction segment with the step's metadata
  let currSegment = {
    slug: 'section-1',
    lineStart: parseInt(metadata.lineStart, 10) || null,
    lineEnd: parseInt(metadata.lineEnd, 10) || null,
    content: '',
  };

  lines.forEach(line => {
    if (line.indexOf(metadata.fileUrl) === -1) {
      currSegment.content += line + '\n';
      return;
    }

    // Close off current segment
    segments.push(currSegment);

    const re = /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/([^#]+)(#L(\d+)(-L(\d+))?)?/;

    // This line contains a GitHub URL that points to the same file
    let [
      _str,
      _user,
      _repoName,
      _commit,
      _filePath,
      _unused,
      lineStart,
      _unused2,
      lineEnd,
    ] = execRegexOrThrow(re, line);

    if (!lineEnd) {
      lineEnd = lineStart;
    }

    const anchorId = /id="([^"]+)"/.exec(line);
    const slug = (anchorId && anchorId[1]) || `section-${segments.length + 1}`;
    const contentWithoutAnchorTag = execRegexOrThrow(/<a[^>]+>(.+)<\/a>/, line)[1] + '\n';

    currSegment = {
      slug,
      lineStart: parseInt(lineStart, 10) || null,
      lineEnd: parseInt(lineEnd, 10) || null,
      content: contentWithoutAnchorTag,
    };
  });

  segments.push(currSegment);

  return segments;
}
