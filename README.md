# Coding challenge

This is a trial for Uber coding challenge.


## Links

- [Uber's tools team coding challenge](https://github.com/uber/coding-challenge-tools)
- [coding-challenge-tools/coding_challenge.md at master · uber/coding-challenge-tools · GitHub](https://github.com/uber/coding-challenge-tools/blob/master/coding_challenge.md)


## The sample app I selected: SF Movies

This sample site shows a map which shows movie locations with pins.
Users can filter locations by using a text filter with autocompletion function.

![capture](https://raw.githubusercontent.com/gh640/coding-challenge/master/assets/capture.png)


## Functions

- The site shows locations for a page on a map when the page is loaded.
- Users can filter locations by entering parts of movie titles in a textbox.
- The site shows movie titles which match the entered text below the textbox.
- Users can select one among suggested titles with either cursor keys or pointer.


## Technology stack used

- Backend
    - Python
    - [Flask](http://flask.pocoo.org/docs/)
- Frontend
    - JavaScript
        - [Vue.js](https://vuejs.org/)
        - [axios](https://github.com/axios/axios)
        - [Lodash](https://lodash.com/)
    - CSS
        - (nothing)
- Database
    - SQLite


## Usage

### Prerequisition

You need to prepare the following things to run this app in your environment.

- [Python 3](https://www.python.org/downloads/)
- [Pipenv](https://github.com/pypa/pipenv)
- [Google API key](https://developers.google.com/)

### Steps

After you've got ready, you can run the app with the following steps.

Clone this repository.

```bash
$ git clone https://github.com/gh640/coding-challenge
```

Install the dependencies with `pipenv` command.

```bash
$ cd coding-challenge/
$ pip install pipenv
$ pipenv install
```

See the page below for more information on `pipenv`.

- [Pipenv: Python Dev Workflow for Humans](https://docs.pipenv.org/)

Run `gunicorn` server.

```bash
cd src/
GOOGLE_API_KEY=[YOUR API KEY] pipenv run gunicorn app:app --log-file -
```

Change the `[YOUR API KEY]` to your Google API key.

If the command above runs successfully, you can see the app through the address displayed in the standard output like `Listening at: http://127.0.0.1:8000 (63838)`.


## TODOS

- Overall
    - Add tests.
- Backend
    - Organize views.
    - Change the granularity of files.
- Frontend
    - Split components out to different files.
    - Change the source of the libraries from CDN to the site.
    - Modernize the code using ESxxx features.
    - Improve the look with css.
    - Introduce SCSS.
    - Introduce a cache system for queries.
- DB
    - Normalize the tables (Split movie data and location data).
    - Migrate from SQLite to MySQL or something else.
