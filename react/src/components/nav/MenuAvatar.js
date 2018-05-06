import React, { Component } from 'react'
import { withRouter } from 'react-router'
import TopHello  from './TopHello'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import BackButton from './BackButton'
import Icon from 'material-ui/Icon'
import ImageTemplate from '../nav/ImageTemplate'
import Menu, { MenuItem } from 'material-ui/Menu'
import { AUTH_TOKEN } from '../../constants/constants'



class MenuAvatar extends Component {
  state = {
    anchorEl: null,
  };
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleClose = (page) => {
    if(page ==='profile') {
      this.props.history.push('/user/' + this.props.user.id)
    }
    if(page ==='logout') {
      localStorage.removeItem(AUTH_TOKEN)
      this.props.history.replace(`/login`)
    }

    this.setState({ anchorEl: null })
  };

  render() {
    const { anchorEl } = this.state
    return (
      <div>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup='true'
          onClick={this.handleClick}
        >
        <ImageTemplate format={'avatar'} nameFile={this.props.nameFile}/>
        </Button>
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={()=>this.handleClose('profile')}>My Profile</MenuItem>
          <MenuItem onClick={()=>this.handleClose('logout')}>Logout</MenuItem>








        </Menu>
      </div>
    )
  }
}

export default withRouter(MenuAvatar)
