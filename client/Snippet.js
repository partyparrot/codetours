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

    const styledCodeLines = _.map(highlightedCodeLines, (line) => {
      return `<span class="line-content">${line}</span>`;
    });
    return styledCodeLines.join('\n');
  }

  getCodeLines() {
    return this.props.code.split('\n');
  }

  render() {
    return (
      <div className="code-snippet">

        <div className="line-numbers">
          {
            _.map(this.getCodeLines(), (codeLine, index) => {
              return (
                <pre className="line-number" key={index}>
                  {index + this.props.startLineNumber}
                </pre>
              );
            })
          }
        </div>

        <pre>
          <code
            dangerouslySetInnerHTML={{__html: this.renderHighlightedCode()}}>
          </code>
        </pre>
      </div>

    );
  }
}

export default Snippet;
