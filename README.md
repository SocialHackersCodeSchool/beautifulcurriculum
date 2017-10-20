# BeautifulCurriculum

## What is the goal of this project?
Currently, the HackYourFuture curriculm is difficult to navigate between, fairly confusing when first approached and is not easy to use on mobile. With BeautifulCurriculum I (we) want to present the curriculum in an easy to digest way that promotes and encourage the reader to browse at their leisure.

Technically, the back end for the curriculum should only rely on the raw Markdown files in Github with all changes only made in CSS. Navigation structure for the BC should also follow the same struction as on Github e.g. beautifulcurriculum.com/HTML-CSS/Week1/README.md equates to github.com/HTML-CSS/Week1/README.md.

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
