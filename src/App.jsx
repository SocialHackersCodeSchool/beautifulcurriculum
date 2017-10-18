import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import showdown from 'showdown'

class App extends Component {
    render() {
        return (
            <div>
                <Nav />
                <Content />
            </div>
        );
    }
}

class Nav extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <a className="navbar-brand" href="#">Dashboard</a>
                <button className="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Settings</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Profile</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Help</a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

class Content extends React.Component {
    constructor(){
        super();
        this.state = {
            data: [],
            html: ""
        };
    }

    loadData() {
        fetch("https://api.github.com/repos/HackYourFuture/curriculum/contents")
        .then(response => response.json())
        .then(json => {
            console.log(json);
            this.setState({
                data: json
            });
        });
    }

    loadReadMe(){
        fetch("https://raw.githubusercontent.com/HackYourFuture/curriculum/master/README.md")
        .then((response) => {
            return response.text();
        }).then((text) => {
            console.log(text);
            var converted = this.convert(text);
            console.log(converted);
            this.setState({
                html: converted
            });
        });
    }

    componentDidMount() {
        this.loadReadMe()
    }

    convert(markdown){
        var converter = new showdown.Converter();
        var converted = converter.makeHtml(markdown);
        converted = converted.replace("class", "className")
        return converted;
    }

    render() {
        return (
            <div class="container-fluid">
                <div class="row">
                    <nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">
                        <ul class="nav nav-pills flex-column">
                            <li class="nav-item">
                                <a class="nav-link active" href="#">Overview <span class="sr-only">(current)</span></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Reports</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Analytics</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Export</a>
                            </li>
                        </ul>

                        <ul class="nav nav-pills flex-column">
                            <li class="nav-item">
                                <a class="nav-link" href="#">Nav item</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Nav item again</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">One more nav</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Another nav item</a>
                            </li>
                        </ul>

                        <ul class="nav nav-pills flex-column">
                            <li class="nav-item">
                                <a class="nav-link" href="#">Nav item again</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">One more nav</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Another nav item</a>
                            </li>
                        </ul>
                    </nav>

                    <main class="col-sm-9 ml-sm-auto col-md-10 pt-3" role="main">
                        <div dangerouslySetInnerHTML={{ __html: this.convert(this.state.html) }} />
                    </main>
                </div>
            </div>
        );
    }
}

export default App;
