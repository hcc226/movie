var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser')


var app = express();

mongoose.connect('mongodb://localhost:27017/movie')
app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))
app.listen(port);
console.log('start port' + port)

app.get('/',function (req,res) {
    Movie.fetch(function (err,movies) {
        if(err){
            console.log(err)
        }
    res.render('index',{
        title:"movie 首页",
        movies:movies
    })
    })
})

app.get('/movie/:id',function (req,res) {//:id 通过requestparam获取
    var id = req.params.id;
    console.log(id)
    Movie.findById(id,function (err,movie) {
        console.log(movie)
        res.render('detail',{

            title:"movie "+movie.title,
            movies:[movie]
        })
    })

})

app.get('/admin/movie',function (req,res) {
    res.render('admin',{
        title:"movie 后台录入页",
        movie:{
            doctor:'',
            country:'',
            title:'',
            year:'',
            poster:'',
            language:'',
            flash:'',
            summary:''
        }
    })
})
//admin update movie
app.get('/admin/update/:id',function (req,res) {
    var id = req.params.id;
    if(id){
        Movie.findById(id,function (err,movie) {
            res.render('admin',{
                title:"movie 后台更新页",
                movie:movie
            })
        })
    }
})
//admin post movie
app.post('/admin/movie/new',function (req,res) {
    console.log(req.body)
    let id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if(id !=='undefined'){

        Movie.findById(id,function (err,movie) {
            if(err) console.log(err);
            _.extend(movie,movieObj);
            _movie.save(function (err,movie) {
                if(err) console.log(err);
                res.redirect('/movie/'+movie._id)
            })
        })
    }
    else {
        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            flash:movieObj.flash,
            summary:movieObj.summary
        })
        _movie.save(function (err,movie) {
            if(err) console.log(err);
            console.log(movie._id)
            res.redirect('/movie/'+movie._id)
        })
    }
})
app.get('/admin/list',function (req,res) {
    Movie.fetch(function (err,movies) {
        if (err) {
            console.log(err)
        }
        res.render('list', {
            title: "movie 列表页",
            movies: movies
        })
    })
})

//admin delete page
app.delete('/admin/list',function (req,res) {
    var id = req.query.id;
    console.log(req)
    console.log(req.query)

    if(id){
        Movie.remove({_id: id},function (err,movie) {
            if(err) console.log(err)
            else{
                res.json({success:1})
            }
        })
    }
})