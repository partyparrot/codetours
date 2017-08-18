import { loadFront } from 'yaml-front-matter';

// Exports
export const getFile = (connector, repoFullName, path, ref) => {
  let url = `/repos/${repoFullName}/contents/${path}`;

  if (ref) {
    url += `?ref=${ref}`;
  }

  return connector.get(url).then(data => {
    return new Buffer(data.content, 'base64').toString();
  });
};

export const parseMD = md => {
  const { title, code, note, __content: step } = loadFront(md);

  const metadata = _parseGitHubURL(code);

  const sectionBlocks = _parseSectionBlocks(step, metadata);

  // these lines have already been used to create the introduction step,
  // remove them from the step root
  const { lineStart, lineEnd, ...cleanMetadata } = metadata;

  return {
    title,
    codeUrl: code,
    speakerNotes: note,
    sections: sectionBlocks,
    ...cleanMetadata,
  };
};

// Internals
const _parseGitHubURL = url => {
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
  ] = _execRegexOrThrow(re, url);

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
};

const _parseSectionBlocks = (step, metadata) =>
  step
    // split the step on line breaks
    .split('\n')
    // remove empty lines
    .filter(line => line)
    // create section blocks
    .reduce((sections, currentLine) => {
      // return true if the current line
      const isSectionBeginning = currentLine.includes(metadata.fileUrl);

      // create a new section with the current line (beginning of the section)!
      if (isSectionBeginning || !sections.length) {
        return [...sections, [currentLine]];
      }

      // separate previous sections from the current section
      const lastSectionIndex = sections.length - 1;
      const previousSections = sections.slice(0, lastSectionIndex);
      const currentSection = sections[lastSectionIndex];

      return [...previousSections, [...currentSection, currentLine]];

      // return [...sections, currentLine];
    }, [])
    // transform the list of sections arrays in a list of objects with data about the section
    .map(section => {
      const [sectionHead, ...rawContent] = section;

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
      ] = _execRegexOrThrow(re, sectionHead);

      if (!lineEnd) {
        lineEnd = lineStart;
      }
      const [, sectionTitle] = _execRegexOrThrow(
        /<a[^>]+>(.+)<\/a>/,
        sectionHead
      );

      return {
        note: sectionTitle,
        lineStart: parseInt(lineStart, 10) || null,
        lineEnd: parseInt(lineEnd, 10) || null,
        speakerNotes: rawContent.join('\n'),
      };
    });

const _execRegexOrThrow = (re, str) => {
  const result = re.exec(str);

  if (!result) {
    throw new Error('format', `${str} didn't match required format: ${re}`);
  }

  return result;
};
