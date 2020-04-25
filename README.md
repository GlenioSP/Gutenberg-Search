## 1. Overview

This app is a replication of the [Gutenberg-Search app built by Patrick Triest](https://blog.patricktriest.com/text-search-docker-elasticsearch/). I basically tried to replicate the same app functionality. However, the implementation details and technologies used are different. Patrick has used Node.js (with Koa Framework) and Vue.js to develop the app. Here, I'm using Python (with Flask) and React.js. I also use Redux and Material-UI. Finally, as the Patrick's app, Docker is used as the deployment infrastructure.

This application is also heavily based on the [microblog app built by Miguel Grinberg](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world). The microblog application was built as a mega tutorial for Flask development (as it is called).

So, I must thank Patrick and Miguel for the great job. Their applications inspired me to build this one for learning purposes.

In resume, this application loads free eBooks from project [Gutenberg](https://www.gutenberg.org/) and make the eBooks available as a digital library with Full-text search through Elasticsearch. Check out Patrick's [tutorial](https://blog.patricktriest.com/text-search-docker-elasticsearch/) for a better description. He also made his application available [online](https://search.patricktriest.com/).

Besides the different technologies used by me to implement the Patrick's app, I've also implemented different mechanisms for the text search results pagination and error handling. You can run this app here and see by yourself, as for example, try stop the Elasticsearch service (through `docker stop elasticsearch_container_id`) and observe what happens to the application.

## 2. Run app

Simple run:

`docker-compose up -d`

or to always build the related images:

`docker-compose up --build -d`

### 3. Access app

Access `localhost` in the browser. It takes a couple of seconds until the API can connect to Elasticsearch and be available to the UI.

### 4. Load book

Patrick created a service inside the app to read a folder containing 100 links to .txt eBooks from Gutenberg's website and then download these books, read one by one and index them in Elasticsearch. Instead of doing this, I decided to expose a Flask endpoint to receive a book .txt url, download and index it in Elasticsearch. The idea is to implement a input/button functionality in the UI which someone can point to the book url and upload it to the application in the future. For now, you can load books into the application by calling the application as follows:

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"book_url":"https://www.gutenberg.org/files/1342/1342-0.txt"}' \
  http://localhost:5000/api/books/load
```

The `curl` command above will do a POST request to the `http://localhost:5000/api/books/load` endpoint with a URL link to the famous Pride and Prejudice book by Jane Austen.

### 7. Stop app

`docker-compose down`

or to remove all related images too,

`docker-compose down --rmi all`

## 6. Based on

- [Gutenberg-Search app](https://blog.patricktriest.com/text-search-docker-elasticsearch/)
- [Microblog app](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world)
- [Gutenberg project](https://www.gutenberg.org/)
