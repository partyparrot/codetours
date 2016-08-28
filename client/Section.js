import React from "react";
import marked from 'marked';


class Section extends React.Component {

  constructor(props) {
    super(props);
  }

  renderViewCodeButton() {
    if (this.props.section.lineStart && this.props.section.lineEnd) {
      return <button onClick={this.props.onSelect}>View Code Snippet</button>;
    }
  }

  render() {
    return (
      <div>
        {this.renderViewCodeButton()}
        <div dangerouslySetInnerHTML={{__html: marked(this.props.section.content)}} />
        <hr></hr>
      </div>

    );

  }
}

export default Section;
