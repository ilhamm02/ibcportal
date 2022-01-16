import React from 'react';
import '../assets/styles.css';
import { connect } from 'react-redux';
import thecodes_white from "../thecodes_white.png";
import thecodes_black from "../thecodes_black.png";

class Footer extends React.Component {
  render() {
    return(
      <div className="footer-div" data-theme={this.props.fullData.theme}>
        <img src={this.props.fullData.theme === "dark" ? thecodes_white : thecodes_black} alt="TheCodes Logo" />
        <p>Copyright &copy; 2022 TheCodes. All rights reserved.</p>
        <div className="footer-social">
          <p><a href="mailto:ibc@ibcscan.net" target="_blank" rel="noreferrer">E-Mail</a></p>
          <p><a href="https://thecodes.dev/" target="_blank" rel="noreferrer">Website</a></p>
          <p><a href="https://t.me/thecodescommunity" target="_blank" rel="noreferrer">Telegram</a></p>
          <p><a href="https://twitter.com/thecodesdev" target="_blank" rel="noreferrer">Twitter</a></p>
          <p><a href="https://facebook.com/groups/Pemburu.Bitcoin.Indonesia/" target="_blank" rel="noreferrer">Facebook</a></p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fullData: state.user
  }
};

export default connect(mapStateToProps)(Footer);