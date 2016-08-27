import React from "react";
import marked from 'marked';


class Section extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div dangerouslySetInnerHTML={{__html: marked(this.props.section.content)}} />
    );

  }
}

export default Section;
