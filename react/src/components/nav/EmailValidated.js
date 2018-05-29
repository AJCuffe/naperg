import React, { Component } from 'react'
import { AUTH_TOKEN } from '../../constants/constants'
import Paper from '@material-ui/core/Paper'
import Icon from '@material-ui/core/Icon'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Button from '@material-ui/core/Button'
import SnackBarCustom from './SnackBarCustom'
import Loading from './Loading'


class EmailValidated extends Component {
  state = {
    interval : 0
  }
  render() {
    if (this.props.me.loading) {
      return (<Loading />)
    }

    const authToken = localStorage.getItem(AUTH_TOKEN)
    if(authToken && !this.props.me.me.emailvalidated) {
      return (
        <div className='paperOut'>
          <Paper className='paperIn'>
            <Icon>error_outline</Icon>{' '}
              Email not validated. Link sent by email, or {' '}
              {this.state.interval ? (
                <span>wait {this.state.interval}s to resend.</span>
              ) : (
                <Button variant='raised' onClick={() => this.sendEmail()}>
                  Resend
                </Button>
              )}
              <SnackBarCustom ref={instance => { this.child = instance }}/>
            </Paper>
          </div>
        )
    } else {
      return(<div></div>)
    }
  }
  sendEmail = async () => {
    this.startTimer()
    await this.props.sendLinkValidateEmailMutation({
      variables: {
      },
    })
    .then((result) => {
      const messageSnackBar = `Email sent successfully to ${result.data.sendLinkValidateEmail.email}!`
      this.child._openSnackBar(messageSnackBar)

    })
    .catch((e) => {
      this.child._openSnackBar(e.graphQLErrors[0].message)
    })
  }

  startTimer = () => {
    this.initTimer()
    let intervalId = setInterval(this.timer, 1000)
    this.setState({ intervalId })
  };
  timer = () => {
    if (this.state.interval > 0) {
      this.setState({ interval: this.state.interval -1 })
    } else {
      clearTimeout(this.state.intervalId)
    }
  }
  initTimer() {
    this.setState({ interval: 40 })
  }
}


const USER_QUERY = gql`
  query Me {
    me {
      id
      emailvalidated
    }
  }
`

const SEND_LINK_VALIDATE_EMAIL_MUTATION = gql`
  mutation sendLinkValidateEmailMutation {
    sendLinkValidateEmail {
      email
    }
  }
`

export default compose(
  graphql(USER_QUERY, {name: 'me'}),
  graphql(SEND_LINK_VALIDATE_EMAIL_MUTATION, { name: 'sendLinkValidateEmailMutation' }),
)(EmailValidated)
