import React from "react";
import hljs from "highlight";
import _ from "lodash";

class Snippet extends React.Component {

  constructor(props) {
    super(props);
  }

  renderHighlightedCode() {
    // TODO(angela): get language, etc from db
    const highlightedCodeLines = _.map(
      this.props.code.split('\n'),
      (line) => hljs.highlight("javascript", line).value);


    return highlightedCodeLines.join('\n');
  }
  render() {
    return (
      <div class="code-snippet">
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
