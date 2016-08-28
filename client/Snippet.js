import React from "react";
import hljs from "highlight";
import _ from "lodash";


class Snippet extends React.Component {

  constructor(props) {
    super(props);
  }

  renderHighlightedCode() {

    const codeLines = this.getCodeLines();

    // TODO(angela): get language, etc from db
    const highlightedCodeLines = _.map(
      codeLines,
      (line) => hljs.highlight("javascript", line).value);

    const styledCodeLines = _.map(highlightedCodeLines, (line, index) => {

      // We need the space otherwise pre tag won't render it.
      const lineContent = line || ' ';
      let additionalStyles = '';
      if(this.shouldHighlight(index)) {
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

  render() {
    return (
      <div className="code-snippet">
        <div className="inside-scroll-container">

          <div className="line-numbers">
            {
              _.map(this.getCodeLines(), (codeLine, index) => {
                return (
                  <pre
                    className={this.shouldHighlight(index) ? "line-highlight line-number": "line-number"}
                    key={index}>
                    {index}
                  </pre>
                );
              })
            }
          </div>

          <div
            dangerouslySetInnerHTML={{__html: this.renderHighlightedCode()}}>
          </div>

        </div>
      </div>

    );
  }
}

export default Snippet;
