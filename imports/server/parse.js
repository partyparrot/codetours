import { loadFront } from 'yaml-front-matter';
import execRegexOrThrow from './execRegexOrThrow';

export function parseMD(md) {
  const {
    title,
    code,
    __content: step,
  } = loadFront(md);

  const metadata = parseGitHubURL(code);

  const sectionBlocks = parseSectionBlocks(step, metadata);

  // these lines have already been used to create the introduction step,
  // remove them from the step root
  const { lineStart, lineEnd, ...cleanMetadata } = metadata;

  return {
    title,
    codeUrl: code,
    sections: sectionBlocks,
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

function parseSectionBlocks(step, metadata) {
  const lines = step.split('\n');

  const sections = [];

  // init the introduction segment with the step's metadata
  let currentSection = {
    slug: 'section-1',
    lineStart: parseInt(metadata.lineStart, 10) || null,
    lineEnd: parseInt(metadata.lineEnd, 10) || null,
    content: '',
  };

  lines.forEach(line => {
    if (line.indexOf(metadata.fileUrl) === -1) {
      currentSection.content += line + '\n';
      return;
    }

    // Close off current segment
    sections.push(currentSection);

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
    const slug = (anchorId && anchorId[1]) || `section-${sections.length + 1}`;
    const contentWithoutAnchorTag = execRegexOrThrow(/<a[^>]+>(.+)<\/a>/, line)[1] + '\n';

    currentSection = {
      slug,
      lineStart: parseInt(lineStart, 10) || null,
      lineEnd: parseInt(lineEnd, 10) || null,
      content: contentWithoutAnchorTag,
    };
  });

  sections.push(currentSection);

  return sections;
}
