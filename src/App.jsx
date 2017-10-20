import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import showdown from 'showdown'
import config from './config.json';
import EmojiConvertor from 'emoji-js';
import * as linkify from 'linkifyjs';
import linkifyHtml from 'linkifyjs/html';

class App extends Component {
    componentDidMount() {
        this.setFavicon();
    }

    setFavicon() {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = 'http://s2.googleusercontent.com/s2/favicons?domain_url=' + config.website;
        document.getElementsByTagName('head')[0].appendChild(link);
    }

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
            modules: [],
            content: {}
        };
    }

    isRepository(pathname){
        return pathname.split("/").length === 3;
    }

    getPath(){
        var path = window.location.pathname;

        if(path.substr(path.length-1) === "/"){
            path = path.substring(0, path.length-1);
        }

        return path;
    }

    getPathForContent(pathname){
        if(pathname === "/" || pathname === ""){
            return "https://raw.githubusercontent.com" + config.homepage + "/master/" + config.homepageFilename;
        }

        if(this.isRepository(pathname)){
            return "https://api.github.com/repos"+ pathname + "/contents";
        } else {
            var split = pathname.split("/");
            var pathHold = pathname.replace("/" + split[1] + "/" + split[2], "");
            return "https://raw.githubusercontent.com" + "/" + split[1] + "/" + split[2] + "/master" + pathHold
        }
    }

    isFile(pathname) {
        return pathname.split('/').pop().indexOf('.') > -1;
    }

    loadData() {
        var pathname = this.getPath();

        if(this.isRepository(pathname)){
            fetch(this.getPathForContent(pathname))
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
        } else {
            this.fetchMarkdownAsHtml(this.getPathForContent(pathname), html =>{
                this.setState({
                    html: html
                });
            });
        }
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

                    var arrayvar = this.state.modules.slice();
                    arrayvar.push({repo:json, dirs:directories});
                    this.setState({ modules: arrayvar });
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
        converted = this.convertInternalLinks(converted);
        converted = this.replaceEmojis(converted);

        converted = linkifyHtml(converted, {
          defaultProtocol: 'https'
        });

        return converted;
    }

    replaceEmojis(html){
        var emoji = new EmojiConvertor();
        html = emoji.replace_colons(html);
        return html;
    }

    convertUrl(url){
        var newUrl = url.replace("https://github.com/", "");
        newUrl = newUrl.replace("/blob/master", "");
        newUrl = newUrl.replace("/master", "");
        newUrl = newUrl.replace("/tree", "");
        newUrl = "/" + newUrl;
        return newUrl;
    }

    convertInternalLinks(html){
        var matches = this.findUrls(html);
        if(matches !== null){
            matches.forEach(match => {
                config.modules.forEach(moduleName => {
                    if(match.indexOf(moduleName) !== -1){
                        html = html.replace(match, this.convertUrl(match));
                    }
                });
            });
        }

        return html;
    }

    findUrls( text ){
        var source = (text || '').toString();
        var urlArray = [];
        var url;
        var matchArray;

        // Regular expression to find FTP, HTTP(S) and email URLs.
        var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

        // Iterate through any URLs in the text.
        while( (matchArray = regexToken.exec( source )) !== null ){
            var token = matchArray[0];
            urlArray.push( token );
        }

        return urlArray;
    }

    render() {
        // I feel like this definetly isn't the right way to do this
        const self = this;

        function fetchContentForDirection(url, callback){
            fetch(url)
            .then(response => response.json())
            .then(json => {
                callback(json);
            });
        }

        function getDirectoryContents(itemDir){
            if(self.state.content[itemDir.sha] === undefined){
                fetchContentForDirection(itemDir.url, json => {
                    var content = self.state.content;
                    content[itemDir.sha] = json;
                    self.setState({ content });
                })
            }
        }

        function convertUrl(url){
            var newUrl = url.replace("https://github.com/", "");
            newUrl = newUrl.replace("/blob/master", "");
            newUrl = newUrl.replace("/master", "");
            newUrl = newUrl.replace("/tree", "");
            newUrl = "/" + newUrl;
            return newUrl;
        }

        function convertName(name){
            var newName = name;

            config.importantFiles.forEach(item => {
                    if(item.filename.toLowerCase() === name.toLowerCase()){
                        console.log(item.title);
                        newName = item.title;
                    }
            })

            return newName;
        }

        function getContent(itemDir){
            var html = []

            if(self.state.content !== undefined && self.state.content[itemDir.sha] !== undefined){
                self.state.content[itemDir.sha].map((content, index) => {
                    html.push(<li><a class='nav-link nav-link-smallest' href={convertUrl(content.html_url)}>{convertName(content.name)}</a></li>)
                })
            }

            return html
        }

        function getSideButton(item, index) {
            return (
                <li class="nav-item">
                    <a class="nav-link" href={"/" + item.repo.full_name}>{item.repo.name}</a>
                    {self.state.modules[index].dirs.map((itemDir, index) => {
                        return <li>
                            <a href="#" onClick={() => getDirectoryContents(itemDir)} data-toggle="collapse" data-target={"#toggle" + itemDir.sha} data-parent="#sidenav01" class="nav-link nav-link-small collapsed">
                                {itemDir.name}
                            </a>
                            <div class="collapse" id={"toggle" + itemDir.sha} style={{height: "0px"}}>
                                <ul>
                                    {getContent(itemDir)}
                                </ul>
                            </div>
                        </li>
                    })}
                </li>
            )
        }

        return (
            <div class="container-fluid">
                <div class="row">
                    <nav class="col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar">
                        <ul class="nav nav-pills flex-column">
                            <a class="nav-link" href="/">Home</a>
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
