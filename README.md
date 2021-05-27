Work &amp; Co Belgrade
# Weekly Code Challenge

## Setup

### Install dependencies
```
npm install
```

### Generate html page
```
npm start
``` 

### Watch for changes
```
npm run dev
```

## General

Data is in [data.yaml](https://github.com/Stanko/code-challenge/blob/master/data.yaml) file.
[The main script](https://github.com/Stanko/code-challenge/blob/master/index.js) just reads it and generate a static html file.

[Github action](https://github.com/Stanko/code-challenge/blob/master/.github/workflows/main.yml) builds everything and deploys it to `gh-pages` branch.
