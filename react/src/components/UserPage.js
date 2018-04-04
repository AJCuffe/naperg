import React from 'react'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
// import ImageTemplate from '../components/ImageTemplate'
import Post from '../components/post/Post'
import { AUTH_TOKEN } from '../constants/constants'

class UserPage extends React.Component {
  state = {
    isEditMode: false,
    user:{
      name: '',
      email: '',
      role: '',
    },
  }

  componentWillReceiveProps(newProps){
    const { singleUser } = newProps.userQuery
      if(!newProps.userQuery.loading){
          this.setState({ user: singleUser })
      }
  }


  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    if (this.props.userQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <div>Loading (from {process.env.REACT_APP_GRAPHQL_ENDPOINT})</div>
        </div>
      )
    }

    let action = this._renderAction(this.state.user)
    return (
      <React.Fragment>
        <h1 className="f3 black-80 fw4 lh-solid">
        {this.state.user.name}{' '}
        <i className="fa fa-edit" onClick={e => this.setState({ isEditMode:!this.state.isEditMode })}></i>
        </h1>
        {this.state.isEditMode && (
          <input
          autoFocus
          className="w-100 pa2 mv2 br2 b--black-20 bw1"
          onChange={e => this.setState({ user:{ ...this.state.user, name: e.target.value} })}
          placeholder="name"
          type="text"
          value={this.state.user.name}
          />
        )}

        <p className="black-80 fw3">Email: {this.state.user.email}</p>
        {!this.state.isEditMode && (
          <p className="black-80 fw3">Role: {this.state.user.role}</p>
        )}
        {this.state.isEditMode && (
          <select
            className=""
            value={this.state.user.role}
            onChange={e => this.setState({ user:{ ...this.state.user, role: e.target.value} })}
            >
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        )}
        <br/>
        <br/>
        {action}
        <br/>
        <br/>
        {authToken && (
          <div className="f6 ba ph3 pv2 mb2 black">
            <h1>Posts from {this.state.user.name}</h1>
            {this.state.user.posts &&
              this.state.user.posts.map(post => (
                <Post
                  key={post.id}
                  post={post}
                />
              ))}
          </div>
        )}


      </React.Fragment>
    )
  }

  _renderAction = ({ id }) => {
      return (
        <React.Fragment>
        {this.state.isEditMode && (
        <div>
          <a
            className="f6 dim br1 ba ph3 pv2 mb2 dib black pointer"
            onClick={() => this.updateUser(id)}
          >
            Save
          </a>{' '}
          <a
            className="f6 dim br1 ba ph3 pv2 mb2 dib black pointer"
            onClick={() => this.deleteUser(id)}
          >
            Delete
          </a>
          </div>
        )}
      </React.Fragment>
    )
  }

  updateUser = async id => {
    const { name, email, role } = this.state.user
    await this.props.updateUser({
      variables: { id, name, email, role },
    })
    this.setState({isEditMode: false})
    // this.props.history.replace('/users')
  }



  deleteUser = async id => {
    await this.props.deleteUser({
      variables: { id },
    })
    this.props.history.replace('/users')
  }
}

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserMutation($id: ID!, $name: String!, $email: String!, $role: String!) {
    updateUser(id: $id, name: $name, email: $email, role: $role) {
      id
      name
      email
      role
    }
  }
`

const POST_QUERY = gql`
  query UserQuery($id: ID!) {
    singleUser(id: $id) {
      id
      email
      role
      name
      posts {
        id
        title
        text
        nameFile
      }
    }
  }
`



const DELETE_MUTATION = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`

export default compose(
  graphql(POST_QUERY, {
    name: 'userQuery',
    options: props => ({
      variables: {
        id: props.match.params.id,
      },
    }),
  }),
  graphql(UPDATE_USER_MUTATION, {
    name: 'updateUser',
  }),
  graphql(DELETE_MUTATION, {
    name: 'deleteUser',
  }),
  withRouter,
)(UserPage)
