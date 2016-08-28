import React from "react";

class Navbar extends React.Component {

  render() {
    const brandNameStyle = {
      fontFamily: "'Pacifico', cursive",
      fontSize: "30px",
      marginLeft: "10px",
      color: "white",
    };

    const logoStyle = {
      width: "40px",
      height: "40px",
      marginTop: "-13px",
      mixBlendMode: "multiply",
      display: "inline-block"
    }
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <img rel="icon" src="/logo.png" style={logoStyle}/>
              <span style={brandNameStyle}>CodeTours</span>
            </a>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav navbar-right">
              <li><a href={this.props.secondaryLink}>{this.props.secondaryText}</a></li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar;
