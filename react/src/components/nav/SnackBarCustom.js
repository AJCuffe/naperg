import React, { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar'

class SnackBarCustom extends Component {
  state = {
    messageSnackBar: '',
    openSnackBar: false
  }

  _openSnackBar(messageSnackBar){
    this.setState({
      messageSnackBar: messageSnackBar,
      openSnackBar: true
    })
  }

  handleClose = (event, reason) => {
     if (reason === 'clickaway') {
       return
     }
     this.setState({ openSnackBar: false })
   }

   // componentWillReceiveProps(newProps) {
   //   this.setState({
   //     messageSnackBar: newProps.messageSnackBar,
   //     openSnackBar: newProps.openSnackBar
   //   })
   // }

  render() {

    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.openSnackBar}
          autoHideDuration={5000}
          onClose={this.handleClose}
          message={<span>{this.state.messageSnackBar}</span>}
        />
    </div>
    )
  }
}

export default SnackBarCustom
