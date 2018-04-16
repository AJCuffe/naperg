import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import SnackBarCustom from '../SnackBarCustom'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'


class ForgetPassword extends Component {
  constructor(props) {
    super(props)
    this.closeSnackBar = this.closeSnackBar.bind(this)
  }

  state = {
    email: '',
    messageSnackBar: '',
    openSnackBar: false,
  }


  closeSnackBar() {
    this.setState({ openSnackBar: false })
  }


  render() {

    return (
      <div className='paperOut'>
        <Paper className='paperIn'>
        <h4 className='mv3'>
          Forget Password
        </h4>
        <div className='flex flex-column'>

          <TextField
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            type='text'
            label='Your email address'
          />

        </div>
        <div className='flex mt3'>
          <Button variant='raised' onClick={() => this._confirm()}>
            Ok
          </Button>
        </div>
        <SnackBarCustom
          _closeSnackBar={this.closeSnackBar}
          openSnackBar={this.state.openSnackBar}
          messageSnackBar={this.state.messageSnackBar}/>
      </Paper>
      </div>
    )
  }

  _confirm = async () => {
    const { email } = this.state
      let messageSnackBar
      await this.props.forgetPasswordMutation({
        variables: {
          email
        },
      })
      .then((result) => {
        messageSnackBar = `A mail has been sent with a link available until
        ${new Date(result.data.forgetPassword.resetPasswordExpires).toLocaleString()}`
      })
      .catch((e) => { messageSnackBar = e.graphQLErrors[0].message })

      this.setState({
        messageSnackBar: messageSnackBar,
        openSnackBar: true,
      })

  }

}



const FORGET_PASSWORD_MUTATION = gql`
  mutation ForgetPasswordMutation($email: String!) {
    forgetPassword(email: $email) {
      name
      id
      resetPasswordExpires
    }
  }
`

export default compose(

  graphql(FORGET_PASSWORD_MUTATION, { name: 'forgetPasswordMutation' }),

)(ForgetPassword)
