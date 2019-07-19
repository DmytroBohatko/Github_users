import React, {Component} from 'react';
import './App.css';
import axios from 'axios'

const userList = [
    {login: "mojombo", id: 1},
    {login: "pjhyett", id: 3},
    {login: "wycats", id: 4},
    {login: "ezmobius", id: 5},
    {login: "ivey", id: 6},
    {login: "evanphx", id: 7},
    {login: "vanpelt", id: 17},
    {login: "wayneeseguin", id: 18},
    {login: "brynary", id: 19},
    {login: "kevinclark", id: 20},
    {login: "technoweenie", id: 21},
    {login: "macournoyer", id: 22},
    {login: "takeo", id: 23},
    {login: "caged", id: 25},
    {login: "topfunky", id: 26},
    {login: "anotherjesse", id: 27},
    {login: "roland", id: 28},
    {login: "lukas", id: 29},
    {login: "fanvsfan", id: 30},
    {login: "tomtt", id: 31},
    {login: "railsjitsu", id: 32},
    {login: "nitay", id: 34},
    {login: "kevwil", id: 35},
    {login: "KirinDave", id: 36},
    {login: "jamesgolick", id: 37},
    {login: "atmos", id: 38},
    {login: "errfree", id: 44},
    {login: "mojodna", id: 45},
    {login: "bmizerany", id: 46}
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            picture: '',
            id: 0,
            nameUser: '',
            companyName: [],
            display: [],
        };
    }


    handleClick = (event) => {
        event.preventDefault();
        let name = '';
        let arr = [];
        //GET ALL USERS
        axios.get('https://api.github.com/users')
            .then(result => {
                console.log(result);
                result.data.map(res => {
                    // FIND MATCHES
                    if (res.login.toLowerCase() === this.state.value.toLowerCase()) {
                        // GET USER PROFILE
                        axios.get(res.url)
                            .then(user => {
                                // GET NAME
                                name = user.data.name;
                                // GET ALL ORGANIZATIONS
                                axios.get(user.data.organizations_url)
                                    .then(organizations => {
                                        console.log(organizations.data.length);
                                        if (organizations.data.length === 0){
                                            this.setState({
                                                companyName: [],
                                                nameUser: name,
                                                picture: user.data.avatar_url,
                                                id: (this.state.id + 1)
                                            });
                                            this.handleAddCart()
                                        }
                                        organizations.data.map(data => {
                                            //GET ORGANIZATION
                                            axios.get(data.url)
                                                .then(url => {
                                                    if (url.data.name === undefined) {
                                                        arr.push(url.data.login.charAt(0).toUpperCase() + url.data.login.slice(1))
                                                    } else {
                                                        arr.push(url.data.name);
                                                    }
                                                    if (arr.length === organizations.data.length) {
                                                        this.setState({
                                                            companyName: arr,
                                                            nameUser: name,
                                                            picture: user.data.avatar_url,
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
    };

    handleChange = (e) => {
        this.setState({value: e.target.value})
    };

    handleAddCart = () => {
        this.setState({
            display: [...this.state.display,
                <Display
                    key={this.state.id}
                    picture={this.state.picture}
                    name={this.state.nameUser}
                    companyName={this.state.companyName}
                />
            ]
        });
    };

    render() {
        return (
            <div>
                <div style={{
                    display: "grid",
                    float: "left"
                }}>
                    {userList.map(user => {
                        return <span key={user.id + 100}>{user.login}</span>
                    })}
                </div>
                <form onSubmit={this.handleClick} style={{display: "inline-block"}}>
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