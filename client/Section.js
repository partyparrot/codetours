import React from "react";
import marked from 'marked';


class Section extends React.Component {

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  selectable() {
    return this.props.section.lineStart && this.props.section.lineEnd
  }

  onClick() {
    if (this.selectable()) {
      this.props.onSelect();
    }
  }

  render() {
    return (
      <div className={"section" + (this.selectable() ? ' selectable' : '') + (this.props.selected ? ' selected' : '')} onClick={this.onClick}>
        <div dangerouslySetInnerHTML={{__html: marked(this.props.section.content)}} />
      </div>

    );

  }
}

export default Section;
