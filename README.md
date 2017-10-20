# BeautifulCurriculum

## Live Demo
[A live version of BeautifulCurriculum can be found here.](https://enigmatic-tundra-23218.herokuapp.com/)

This website is updated whenever code is pushed to master.

## What is the goal of this project?
Currently, the HackYourFuture curriculm is difficult to navigate between, fairly confusing when first approached and is not easy to use on mobile. With BeautifulCurriculum I (we) want to present the curriculum in an easy to digest way that promotes and encourage the reader to browse at their leisure.

Technically, the back end for the curriculum should only rely on the raw Markdown files in Github with all changes only made in CSS. Navigation structure for the BC should also follow the same struction as on Github e.g. *beautifulcurriculum.com/HTML-CSS/Week1/README.md* equates to *github.com/HTML-CSS/Week1/README.md*.

## How does this work?
Using the GitHub API the website queries the root repositiories of all of the included modules. When the user clicks on a link it will attempt to load the file requested. If the file is a Markdown file then it was convert the markdown into HTML tags and load them in the window. If the file is a directory then at the moment it will fail. In the future graceful handling of dictories is required.

This project uses react and node.

This project used [https://github.com/showdownjs/showdown](showdown) to convert markdown to HTML. It's worth looking into to tweak the settings that it works with as they might not be optimal right now.

## How can you help?
I'll try to keep the issues tab open with ongoing bugs and improvements. If you know Design, then please help me. Please.

Talk to me on Slack if you want to help!

## Installation
To install, pull the repository, navigate to the folder and type:
npm start

To change setup details for the project please edit the config file.

## Config File
### homepage and homepageFilename
The first page that the user sees what they go to the root directory. The homepageFilename MUST be in the root directory of the homepage repo.

### website
Used to pull the favicon and other details

### modules
Repositories that should be pulled in the curriculum. Please observes the lack of leading or follows slashes.

### importantFiles
Items placed in here will have their filename changed in the side panel but NOT in the url of the page. filename denotes the old name, title denotes the new one.
