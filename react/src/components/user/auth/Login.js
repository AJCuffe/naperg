import React, { Component } from 'react'
import { AUTH_TOKEN } from '../../../constants/constants'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import SnackBarCustom from '../SnackBarCustom'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'

const queryString = require('query-string')

class Login extends Component {
  state = {
    stateLogin: 'login',
    email: '',
    password: '',
    name: '',
    messageSnackBar: '',
    openSnackBar: false,
    resetPasswordToken: '',
    validateEmailToken: '',
  }

  componentDidMount() {
    let resetPasswordToken = queryString.parse(this.props.location.search).resetPasswordToken
    if(resetPasswordToken) {
      this.setState({
        stateLogin: 'resetPassword',
        resetPasswordToken: resetPasswordToken
      })
    }
    let validateEmailToken = queryString.parse(this.props.location.search).validateEmailToken
    if(validateEmailToken) {
      this.validateEmailMutation(validateEmailToken)
    }
  }

  render() {
    return (
      <div className='paperOut'>
        <Paper className='paperIn'>
        <h4 className='mv3'>
          {this.state.stateLogin === 'login' && 'Login'}
          {this.state.stateLogin === 'forget' && 'Forget Password'}
        </h4>
        <div className='flex flex-column'>
          {(
            this.state.stateLogin === 'login' ||
            this.state.stateLogin === 'forget'
          ) && (
          <input
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            type='text'
            placeholder='Your email address'
          />
        )}
        {(
          this.state.stateLogin === 'login' ||
          this.state.stateLogin === 'resetPassword'
        ) && (
          <input
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
            type='password'
            placeholder='Choose a safe password'
          />
      )}
        </div>
        <div className='flex mt3'>
          <Button variant='raised' onClick={() => this._confirm()}>
            Ok
          </Button>
          <Button variant='flat'
            onClick={() => this.props.history.push('/signup')}
          >signup
          </Button>
          <Button variant='flat'
            onClick={() => this.setState({ stateLogin: 'forget', openSnackBar: false })}
          >Forget Password
          </Button>
        </div>
        <SnackBarCustom
          openSnackBar={this.state.openSnackBar}
          messageSnackBar={this.state.messageSnackBar}/>
      </Paper>
      </div>
    )
  }
  validateEmailMutation = async (validateEmailToken) => {
    let messageSnackBar
    await this.props.validateEmailMutation({
      variables: {
        validateEmailToken
      },
    })
    .then((result) => { messageSnackBar = `${result.data.validateEmail.email} is now validated.` })
    .catch((e) => { messageSnackBar = e.graphQLErrors[0].message })

    this.setState({
      messageSnackBar: messageSnackBar,
      openSnackBar: true,
      stateLogin: 'login'
    })
  }
  _confirm = async () => {
    const { name, email, password, resetPasswordToken } = this.state
    if (this.state.stateLogin === 'login') {
      await this.props.loginMutation({
        variables: {
          email,
          password,
        },
      })
      .then((result) => {
        const { token, user } = result.data.login
        this._saveUserData(token, user)
        this.props.history.push(`/`)
      })
      .catch((e) => {
        let messageSnackBar = e.graphQLErrors[0].message
        this.setState({
          messageSnackBar: messageSnackBar,
          openSnackBar: true,
        })
      })
    }
    if (this.state.stateLogin === 'forget') {
      let messageSnackBar
      await this.props.forgetPasswordMutation({
        variables: {
          email
        },
      })
      .then((result) => { messageSnackBar = `A mail has been sent with a link available until
        ${new Date(result.data.forgetPassword.resetPasswordExpires).toLocaleString()}` })
      .catch((e) => { messageSnackBar = e.graphQLErrors[0].message })

      this.setState({
        messageSnackBar: messageSnackBar,
        openSnackBar: true,
        stateLogin: 'login'
      })
    }
    if (this.state.stateLogin === 'resetPassword') {
      const result = await this.props.resetPasswordMutation({
        variables: {
          resetPasswordToken,
          password
        },
      })

      const { token, user } = result.data.resetPassword
      this._saveUserData(token, user)
      this.props.history.push(`/`)

    }
  }

  _saveUserData = (token, user) => {
    localStorage.setItem(AUTH_TOKEN, token)
    localStorage.setItem('userToken', JSON.stringify(user))
  }
}



const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        name
        id
      }
    }
  }
`
const VALIDATE_EMAIL_TOKEN_MUTATION = gql`
  mutation ValidateEmailMutation($validateEmailToken: String!) {
    validateEmail(validateEmailToken: $validateEmailToken) {
      email
    }
  }
`
const FORGET_PASSWORD_MUTATION = gql`
  mutation ForgetPasswordMutation($email: String!) {
    forgetPassword(email: $email) {
      name
      id
      resetPasswordExpires
    }
  }
`
const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation($password: String!, $resetPasswordToken: String!) {
    resetPassword(password: $password, resetPasswordToken: $resetPasswordToken) {
      token
      user {
        name
        id
      }
    }
  }
`

export default compose(
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
  graphql(FORGET_PASSWORD_MUTATION, { name: 'forgetPasswordMutation' }),
  graphql(RESET_PASSWORD_MUTATION, { name: 'resetPasswordMutation' }),
  graphql(VALIDATE_EMAIL_TOKEN_MUTATION, { name: 'validateEmailMutation' }),
)(Login)
