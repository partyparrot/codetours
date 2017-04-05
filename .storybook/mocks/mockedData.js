const mockedData = {
  Tour: () => ({
    _id: 'CdkePNS3c558dTg67',
    targetRepository: 'partyparrot/codetours-starter-kit',
    description: "Start here when you're making a code tour!",
    steps: ['my-first-step.md'],
    repository: 'partyparrot/codetours-starter-kit',
    createdAt: '2016-08-28T18:26:27.834Z',
  }),
  Step: () => ({
    _id: 'wBN9oicHn8hJWXipJ',
    title: 'A code tour content file',
    codeUrl: 'https://github.com/partyparrot/codetours-starter-kit/blob/ff549496a34638b7d940b915a68aae567bf2cce4/my-first-step.md',
    sections: [
      {
        slug: 'section-1',
        lineStart: null,
        lineEnd: null,
        content: "\n\nOK, now that we know how to configure a code tour, let's look at one of the content files. This tour is pretty meta, since we're now looking at the source code of the previous step's content.\n\n",
      },
      {
        slug: 'section-2',
        lineStart: 1,
        lineEnd: 4,
        content: '<h4>YAML front matter</h4>\n\nAt the top of every step, there needs to be a bit of metadata. This is encoded in a standard format called "YAML front matter", used by a variety of different markdown-based site generators.\n\nBut you don\'t really need to know YAML for this - it\'s just a set of keys, followed by some values. There are only two used by code tours:\n\n- `title` - as you may have guessed, this is the title of the tour step.\n- `code` - this one is a bit more complicated. It represents the file that this step of the tour is about. It has to be in a specific format - a "blob" URL from GitHub.\n\nYou can get the URL that needs to go into the `code` property quite easily from the GitHub UI:\n\n1. Go to the file you want\n2. Hit `y` on your keyboard to get a URL for the specific commit hash\n3. Click to select the starting line number\n4. Shift-click to select the ending line number\n5. Copy the URL from the address bar\n\nThat\'s it - the URL format is a bit complicated but you don\'t have to worry about it to use it.\n\n',
      },
      {
        slug: 'section-3',
        lineStart: 17,
        lineEnd: 17,
        content: "<h4>Code snippet links</h4>\n\nSometimes, a file or concept requires looking at several different parts of the code. In this case, you can add another section to the same step, that will highlight a specific set of lines when clicked. Just add an `<a>` tag in your markdown, with an `href` that has the same format as the `code` property in the YAML front matter.\n\nThe only restriction is, all sections of the same step have to reference the _same file_ of source code.\n\n#### Starter kit\n\nTo get started with your own code tour, just fork the [starter kit](https://github.com/partyparrot/codetours-starter-kit) and get to editing. Then, type in the name of your code tour's repository in the \"create a tour\" box on the front page, and view it online!\n\nThe best part is, the formatting has been optimized to work almost as well in GitHub's native Markdown viewer. So you can look at your content directly on GitHub before you're ready to submit it to www.codetours.xyz.\n\n",
      },
    ],
    user: 'partyparrot',
    repoName: 'codetours-starter-kit',
    fullRepoName: 'partyparrot/codetours-starter-kit',
    commit: 'ff549496a34638b7d940b915a68aae567bf2cce4',
    filePath: 'my-first-step.md',
    fileUrl: 'https://github.com/partyparrot/codetours-starter-kit/blob/ff549496a34638b7d940b915a68aae567bf2cce4/my-first-step.md',
    repository: 'partyparrot/codetours-starter-kit',
    slug: 'markdown.md',
    index: 1,
    code: '---\ntitle: A code tour configuration file\ncode: https://github.com/partyparrot/codetours-starter-kit/blob/ded59179edb6bd892ccffcb0c5a8a4f3868826d5/.codetour.json\n---\n\n### Welcome to CodeTours!\n\nYou might have read some code tours already, but this one is special - it\'s designed to teach you how to make a tour yourself. You can make a code tour of any open source project, even one you don\'t have commit access to.\n\nThe content for a code tour is pulled from your repository on GitHub. To be able to be imported as a code tour, your repository needs to contain:\n\n1. A `.codetour.json` configuration file in the root of the repository\n2. One or more markdown files, referenced by the configuration file\n\nOn the left, you can see an example of a very simple `.codetour.json` file. You can see that it needs to include at least three properties.\n\n<a href="https://github.com/partyparrot/codetours-starter-kit/blob/ded59179edb6bd892ccffcb0c5a8a4f3868826d5/.codetour.json#L2" id="targetRepository"><h4>targetRepository</h4></a>\n\nThis property represents the repository that you are writing a tour about. For example, your code tour might live at `github.com/mynamehere/best-react-tour`, and the `targetRepository` would be `facebook/react`. This will help people find your tour when browsing this website.\n\n<a href="https://github.com/partyparrot/codetours-starter-kit/blob/ded59179edb6bd892ccffcb0c5a8a4f3868826d5/.codetour.json#L3" id="description"><h4>description</h4></a>\n\nThis property is a description that should tell people what to expect when they get into your tour. It\'s your chance to hook people in when they are browsing the catalog.\n\n<a href="https://github.com/partyparrot/codetours-starter-kit/blob/ded59179edb6bd892ccffcb0c5a8a4f3868826d5/.codetour.json#L4-L6" id="steps"><h4>steps</h4></a>\n\nThis property represents the actual content of your tour - it\'s an array of steps, each of which is the path to a Markdown-formatted file inside the same repository.\n\nThat\'s all for the configuration file - go to the next step to learn how to write the content of the steps themselves.\n',
  }),
};

export default mockedData;
