import React, { Component } from 'react'
import Snackbar from 'material-ui/Snackbar'

class SnackBarCustom extends Component {
  state = {
    messageSnackBar: '',
    openSnackBar: false
  }
  handleClose = (event, reason) => {
     if (reason === 'clickaway') {
       return
     }
     this.setState({ openSnackBar: false })
     this.props._closeSnackBar()
   }

   componentWillReceiveProps(newProps) {
     this.setState({
       messageSnackBar: newProps.messageSnackBar,
       openSnackBar: newProps.openSnackBar
     })
   }

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
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span>{this.state.messageSnackBar}</span>}
        />
    </div>
    )
  }
}

export default SnackBarCustom
