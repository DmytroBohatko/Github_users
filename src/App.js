import React, {Component} from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: '',
            picture: '',
            id: 0,
            nameUser: '',
            companyName: [],
            display: [],
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddCart = this.handleAddCart.bind(this)
    }


    handleClick(event) {
        event.preventDefault();
        let name = '';
        let arr = [];
        //GET ALL USERS
        axios.get('https://api.github.com/users?access_token=07639ee7cae249ce87f3811bb9050cd01e8bb320')
            .then(result => {
                result.data.map(res => {
                    // FIND MATCHES
                    if (res.login.toLowerCase() === this.state.value.toLowerCase()) {
                        // GET USER PROFILE
                        axios.get(res.url + "?access_token=07639ee7cae249ce87f3811bb9050cd01e8bb320")
                            .then(user => {
                                // GET NAME
                                name = user.data.name;
                                // GET ALL ORGANIZATIONS
                                axios.get(user.data.organizations_url + "?access_token=07639ee7cae249ce87f3811bb9050cd01e8bb320")
                                    .then(organizations => {
                                        organizations.data.map(data => {
                                            //GET ORGANIZATION
                                            axios.get(data.url + "?access_token=07639ee7cae249ce87f3811bb9050cd01e8bb320")
                                                .then(url => {
                                                    if (url.data.name === undefined) {
                                                        arr.push(url.data.login.charAt(0).toUpperCase() + url.data.login.slice(1))
                                                    } else {
                                                        arr.push(url.data.name);
                                                    }
                                                    if (arr.length === organizations.data.length){
                                                        this.setState({
                                                            companyName: arr,
                                                            nameUser:name,
                                                            picture:user.data.avatar_url,
                                                            id: (this.state.id + 1)
                                                        });
                                                        this.handleAddCart()
                                                    }
                                                });
                                        });

                                    })
                            })
                    }
                })
            })
    }

    handleChange(e) {
        this.setState({value: e.target.value})
    }

    handleAddCart() {
        this.setState({
            display : [...this.state.display,
                <Display
                key={this.state.id}
                picture={this.state.picture}
                name={this.state.nameUser}
                companyName={this.state.companyName}
            />
            ]
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleClick}>
                    <input type="text" value={this.state.value} onChange={this.handleChange}
                           placeholder="Enter user login"/>
                    <input type="submit"
                           value="Add Cart"
                    />
                </form>
                {
                    this.state.display.map(user => {
                        return user
                    }
                    )
                }
            </div>
        );
    }
}

class Display extends Component {

    render() {
        const stylesH = {
            margin: 0
        };
        const styles = {
            display: (this.props.picture === '') ? 'none' : 'flex',
            margin: 10 + "px"
        };
        const stylesImg = {
            width: 100 + "px",
            height: 100 + "px"
        };
        const name = <h5>{this.props.name}</h5>;
        const companyName = this.props.companyName.length > 0 ? (this.props.companyName.map(
            res => <h5 style={stylesH} key={res}>{res}</h5>
        )) : '';

        return (
            <div style={styles}>
                <img style={stylesImg} src={this.props.picture}/>
                <div>
                    {name}
                    {companyName}
                </div>
            </div>
        )
    }
}


export default App;