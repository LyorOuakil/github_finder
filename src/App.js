import React, {Component, Fragment} from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Users from './components/users/Users'
import User from './components/users/User'
import Search from './components/users/Search'
import Alert from './components/layout/Alert'
import About from './components/pages/About'

import axios from 'axios'

import './App.css';

class App extends Component {
	state = {
		users: [],
		user: {},
		repos: [],
		loading: false,
		alert: null
	}

	// Search github users
	searchUsers = async (text) => {
		this.setState({loading : true});
		const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.SECRET}`);
		this.setState({users : res.data.items, loading : false});
	}

	// Get single github user
	getUser = async (username) => {
		this.setState({loading : true});
		const res = await axios.get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.SECRET}`);
		this.setState({user: res.data, loading: false});
	}

	// Get user repos
	getUserRepos = async (username) => {
		this.setState({loading : true});
		const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.SECRET}`);
		console.log(res.data)
		this.setState({repos: res.data, loading: false});
	}

	// clear users from state
	clearUsers = () => this.setState({users: [], loading: false})

	// Set alert
	
	setAlert = (msg, type) => {
		this.setState({alert : {msg, type} })		

		setTimeout(() => {
			this.setState({alert: null})
		}, 5000)
	}

	render() {
		const {users, loading, alert, user, repos} = this.state
		return (
			<Router>
			<div className="App">
				<Navbar></Navbar>
				<div className="container">
					<Alert alert={alert}></Alert>
					<Switch>
						<Route exact path='/' render={props => (
							<Fragment>
								<Search searchUsers={this.searchUsers} clearUsers={this.clearUsers} showClear={users.length > 0 ? true : false} setAlert={this.setAlert}/>
								<Users loading={loading} users={users}></Users>
							</Fragment>
						)}>
						</Route>
						<Route exact path="/about" component={About}></Route>
						<Route exact path='/user/:login' render={props => (
							<User {...props} getUser={this.getUser} user={user} loading={loading} getUserRepos={this.getUserRepos} repos={repos}></User>
						)}>

						</Route>
					</Switch>

				</div>
			</div>
			</Router>
		  );
	}
}

export default App;
