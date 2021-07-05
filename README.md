# CMD CSV parser

## Clone project to folder
```bash 
$ git clone git@github.com:ginkenta/sellbery.git
```

## Install dependencies
```bash 
$ npm install
```

## Build

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run build
```

## Running the app

```bash
$ npm run parser -- <option>
```

## Support

List of possible option:
```bash
-d, --download <url>, "link to download csv file"
-t, --transform <name>, "transform specific file to json"
-l, --list, "list of all downloaded files"
```
