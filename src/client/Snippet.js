import React from 'react';
import hljs from 'highlight';
import _ from 'lodash';

class Snippet extends React.Component {
  constructor(props) {
    super(props);
  }

  getLanguageFromFilePath() {
    // Attempt to get language from filePath
    let lang = _.last(this.props.filePath.split('.'));

    const extToLang = {
      js: 'javascript',
      py: 'python',
      ts: 'typescript',
    };

    if (_.has(extToLang, lang)) {
      lang = extToLang[lang];
    }

    if (!_.includes(hljs.listLanguages(), lang)) {
      lang = null;
    }

    return lang;
  }

  renderHighlightedCode() {
    const codeLines = this.getCodeLines();

    const lang = this.getLanguageFromFilePath();

    let highlightedCodeLines;

    if (lang) {
      highlightedCodeLines = _.map(codeLines, line => hljs.highlight(lang, line).value);
    } else {
      highlightedCodeLines = _.map(codeLines, line => hljs.highlightAuto(line).value);
    }

    const styledCodeLines = _.map(highlightedCodeLines, (line, index) => {
      // We need the space otherwise pre tag won't render it.
      const lineContent = line || '&nbsp';
      const lineNumber = index + 1;
      let additionalStyles = '';
      if (this.shouldHighlight(lineNumber)) {
        additionalStyles += 'line-highlight';
      }
      return `<pre class="line-content ${additionalStyles}"><code>${lineContent}</code></pre>`;
    });
    return styledCodeLines.join('\n');
  }

  getCodeLines() {
    return this.props.code.split('\n');
  }

  shouldHighlight(lineNumber) {
    return _.includes(this.props.highlightLineNumbers, lineNumber);
  }

  componentDidMount() {
    if (this.elToScrollTo) {
      this.elToScrollTo.scrollIntoView({ behavior: 'smooth' });
    }
  }

  componentDidUpdate() {
    if (this.elToScrollTo) {
      this.elToScrollTo.scrollIntoView({ behavior: 'smooth' });
    }
  }

  render() {
    return (
      <div className="code-snippet">
        <div className="inside-scroll-container">
          <div className="line-numbers">
            {_.map(this.getCodeLines(), (codeLine, index) => {
              const lineNumber = index + 1;
              return (
                <pre
                  ref={el => {
                    // 3 line offset so we don't scroll to the very top
                    if (lineNumber === _.max([_.min(this.props.highlightLineNumbers) - 3, 1])) {
                      this.elToScrollTo = el;
                    }
                  }}
                  className={
                    this.shouldHighlight(lineNumber) ? 'line-highlight line-number' : 'line-number'
                  }
                  key={lineNumber}
                >
                  {lineNumber}
                </pre>
              );
            })}
          </div>

          <div dangerouslySetInnerHTML={{ __html: this.renderHighlightedCode() }} />

        </div>
      </div>
    );
  }
}

export default Snippet;
