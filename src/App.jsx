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

class Content extends React.Component {
    constructor(){
        super();
        this.state = {
            data: [],
            html: "",
            modules: []
        };
    }

    loadData() {
        fetch("https://api.github.com/repos/"+ config.homepage +"/contents")
        .then(response => response.json())
        .then(json => {
            for (var i in json){
                if(json[i].name === config.homepageFilename){
                    this.loadReadMe(json[i].download_url);
                }
            }
        });
    }

    loadReadMe(url){
        fetch(url)
        .then((response) => {
            return response.text();
        }).then((text) => {
            this.setState({
                html: this.convert(text)
            });
        });
    }

    loadSideNav(){
        for (var i in config.modules){
            console.log(config.modules[i]);
            fetch("https://api.github.com/repos/"+ config.modules[i])
            .then(response => response.json())
            .then(json => {
                this.getModuleContents(json.full_name, jsondir => {
                    var directories = [];

                    for(var j in jsondir){
                        if(jsondir[j].type === "dir"){
                            directories.push(jsondir[j]);
                        }
                    }

                    var arrayvar = this.state.modules.slice()
                    arrayvar.push({repo:json, dirs:directories})
                    this.setState({ modules: arrayvar })

                    console.log(directories);
                });
            });
        }
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
        var converted = converter.makeHtml(markdown);
        converted = converted.replace("class", "className")
        return converted;
    }

    render() {
        const self = this;

        function getSideButton(item, index) {
            return (
                <li class="nav-item">
                    <a class="nav-link" href={item.repo.html_url}>{item.repo.name}</a>
                    {self.state.modules[index].dirs.map((itemDir, index) => {
                        return <a class="nav-link nav-link-small" href={itemDir.html_url}>{itemDir.name}</a>
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
                        <div dangerouslySetInnerHTML={{ __html: this.convert(this.state.html) }} />
                    </main>
                </div>
            </div>
        );
    }
}

export default App;
