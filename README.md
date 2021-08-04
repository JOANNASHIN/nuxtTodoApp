# Nuxt.js X todo web

- 작업기간: 2021-05 ~ 2021.06
- 프로그래밍언어: HTML5, SCSS, Javascript(ES6), Vue.js (Nuxt.js), Firebase
- 상세설명: 일정관리를 할 수 있는 웹페이지입니다. 추가, 수정, 완료 및 삭제가 가능하며 리스트로 보는 것과 달력으로 보는 것이 가능합니다. SPA방식이며, Firebase database를 사용하여 데이터를 DB에 저장할 수 있도록 하였습니다.

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```


**Mysql 연동 방법 (현재는 firebase database로 변경)
** nuxt & express & mysql 
참고: 
nuxt express 환경: https://blog.rhostem.com/posts/2018-10-28-nuxtjs-universal
vue express mysql 환경: https://marshmello.tistory.com/65?category=1158454

1. 설치 리스트
    mysql설치 
        여기참고 > https://marshmello.tistory.com/5?category=971973 
        여기가 다운로드 하는 곳 > https://dev.mysql.com/downloads/ 

    npm i express-generator
    npm i express
    npm i mysql --save


2. nuxt.config.js에서 설정
  serverMiddleware: [
    // <project root>/api/index.js 모듈을 미들웨어로 추가
    '~/api/index.js',
  ],


3. 루트폴더에 /api/index.js 생성

    기본:

        const express = require('express')

        const app = express() // express 인스턴스 생성

        // 실제로는 /api 라우트를 처리하는 메소드가 된다.
        app.get('/', function(req, res) {
            res.send('API root')
        })

        // 모듈로 사용할 수 있도록 export
        // 앱의 /api/* 라우트로 접근하는 모든 요청은 모두 app 인스턴스에게 전달된다.
        module.exports = {
            path: '/api',
            handler: app
        }

    mysql연동:
        const express = require("express");
        const app = express(); //express인스턴스 생성
        const mysql = require('mysql');

        // Connection 객체 생성 
        const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',   
        password: '7985Wldms*',
        database: 'movies'  
        });  

        // Connect
        connection.connect(function (err) {   
        if (err) {     
            console.error('mysql connection error');     
            console.error(err);     
            throw err;   
        } 
        });

        app.get('/', function (req, res) {
            connection.query('SELECT * FROM users', function (err, rows) {
            if (err) throw err;
            res.send(rows);
            });
        });

        module.exports = {
            path: "/api",
            handler: app
        }
    

4. 프론트에서 api연동
    async asyncData({ app, query }) {
        const user = await app.$axios.$get(`/`);
        return { user }   // 이렇게 하면 this.user로 접근가능.
    },
