import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import showdown from 'showdown'
import config from './config.json';

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

class Content extends React.Component {
    constructor(){
        super();
        this.state = {
            html: "",
            modules: []
        };
    }

    loadData() {
        var pathname = window.location.pathname.substring(1);

        if(pathname === "/" || pathname === ""){
            pathname = config.homepage;
        }

        fetch("https://api.github.com/repos/"+ pathname + "/contents")
        .then(response => response.json())
        .then(json => {
            json.forEach( item => {
                if(item.name === config.homepageFilename){
                    this.fetchMarkdownAsHtml(item.download_url, html =>{
                        this.setState({
                            html: html
                        });
                    });
                }
            });
        });
    }

    fetchMarkdownAsHtml(url, callback){
        fetch(url)
        .then((response) => {
            return response.text();
        }).then((text) => {
            callback(this.convert(text));
        });
    }

    loadSideNav(){
        config.modules.forEach(module => {
            fetch("https://api.github.com/repos/"+ module)
            .then(response => response.json())
            .then(json => {
                this.getModuleContents(json.full_name, jsondir => {
                    var directories = [];

                    jsondir.forEach(item => {
                        if(item.type === "dir"){
                            directories.push(item);
                        }
                    })

                    var arrayvar = this.state.modules.slice()
                    arrayvar.push({repo:json, dirs:directories})
                    this.setState({ modules: arrayvar })

                    console.log(directories);
                });
            });
        });
    }

    getModuleContents(repoName, callback){
        fetch("https://api.github.com/repos/"+ repoName +"/contents")
        .then(response => response.json())
        .then(json => {
            callback(json);
        });
    }

    componentDidMount() {
        this.loadData()
        this.loadSideNav();
    }

    convert(markdown){
        var converter = new showdown.Converter();
        converter.setOption('tables', 'true');
        var converted = converter.makeHtml(markdown);
        converted = converted.replace("class", "className")
        return converted;
    }

    render() {
        // I feel like this definetly isn't the right way to do this
        const self = this;

        function getSideButton(item, index) {
            return (
                <li class="nav-item">
                    <a class="nav-link" href={"/" + item.repo.full_name}>{item.repo.name}</a>
                    {self.state.modules[index].dirs.map((itemDir, index) => {
                        return <a class="nav-link nav-link-small" href={"/" + item.repo.full_name + "/" + itemDir.path}>{itemDir.name}</a>
                    })}
                </li>
            )
        }

        return (
            <div class="container-fluid">
                <div class="row">
                    <nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">
                        <ul class="nav nav-pills flex-column">
                            {this.state.modules.map((item, index) => {
                                return getSideButton(item, index);
                            })}
                        </ul>
                    </nav>

                    <main class="col-sm-9 ml-sm-auto col-md-10 pt-3" role="main">
                        <div dangerouslySetInnerHTML={{ __html: this.state.html }} />
                    </main>
                </div>
            </div>
        );
    }
}

class Nav extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <a className="navbar-brand" href="#">{config.organisationName}</a>
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
                    </ul>
                </div>
            </nav>
        );
    }
}

export default App;
