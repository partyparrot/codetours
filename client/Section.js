import React from "react";
import marked from 'marked';


class Section extends React.Component {

  constructor(props) {
    super(props);
  }

  renderViewCodeButton() {
    if (this.props.section.lineStart && this.props.section.lineEnd) {
      return <button onClick={this.props.onSelect}>Highlight code</button>;
    }
  }

  render() {
    return (
      <div class="section">
        {this.renderViewCodeButton()}
        <div dangerouslySetInnerHTML={{__html: marked(this.props.section.content)}} />
      </div>

    );

  }
}

export default Section;
