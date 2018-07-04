import React, {Component} from 'react'
import FeedPage from '../../post/FeedPage'
import DraftsPage from '../../post/DraftsPage'
import CarsPage from '../../car/CarsPage'
import ChatsPage from '../../chat/ChatsPage'
import CreateCar from '../../car/CreateCar'
import CreatePage from '../../post/CreatePage'
import DetailPage from '../../post/DetailPage'
import DetailCar from '../../car/DetailCar'
import UsersPage from '../../user/UsersPage'
import UserPage from '../../user/UserPage'
import Api from '../../.../../api/Api'
import ForgetPassword from '../../user/auth/ForgetPassword'
import Login from '../../user/auth/Login'
import Signup from '../../user/auth/Signup'
import ResetPassword from '../../user/auth/ResetPassword'
import UpdatePassword from '../../user/auth/UpdatePassword'
import ValidateEmail from '../../user/auth/ValidateEmail'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import EmailValidated from '../../nav/EmailValidated'
import Header from '../../nav/layout/Header'
import NotFound from '../../nav/error/NotFound'
import SideBar from '../../nav/layout/SideBar'
import {SideBarContext} from './SideBarContext'

class App extends Component {
  state = {
    isSideBarOpen: false,
    variant: 'permanent',
    isMobile: false
  };

  toggleDrawer = (isSideBarOpen) => () => {
    if(!isSideBarOpen && !this.state.isMobile) {
      return
    }
    this.setState({
      isSideBarOpen: isSideBarOpen,
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize)
    let variant = this.isMobile() ? 'persistent' : 'permanent'
    this.setState({
      variant: variant,
      isMobile: this.isMobile()
    })
  }

  resize = () => {
    let isSideBarOpen = false
    if(!this.isMobile()) {
      isSideBarOpen = true
    }
    this.setState({
      isMobile: this.isMobile(),
      isSideBarOpen: isSideBarOpen
    })
  }

  isMobile = () => window.innerWidth < 600 ? true : false

  render() {
    return (
      <Router>
      <div>
        <SideBarContext.Provider
          value={{
            state: this.state,
            toggleDrawer: this.toggleDrawer
          }}>
          <SideBar />
          <div className='desktopMargin'>
            <Header />
            <EmailValidated/>
            <div>
              <Switch>
                <Route exact path='/' component={FeedPage} />
                <Route path='/car/create' component={CreateCar} />
                <Route path='/car/:id' component={DetailCar} />
                <Route path='/drafts' component={DraftsPage} />
                <Route path='/cars' component={CarsPage} />
                <Route path='/chats' component={ChatsPage} />
                <Route path='/users' component={UsersPage} />
                <Route path='/api' component={Api} />
                <Route path='/user/:id' component={UserPage} />
                <Route path='/create' component={CreatePage} />
                <Route path='/post/:id' component={DetailPage} />
                <Route path='/login' component={Login} />
                <Route path='/signup' component={Signup} />
                <Route path='/forgetPassword' component={ForgetPassword} />
                <Route path='/resetPassword' component={ResetPassword} />
                <Route path='/updatePassword' component={UpdatePassword} />
                <Route path='/validateEmail' component={ValidateEmail} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </SideBarContext.Provider>
      </div>
    </Router>
    )
  }
}

export default App
