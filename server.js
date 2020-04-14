import xml from 'jsontoxml';
import express from 'express';
import covid19ImpactEstimator from './src/estimator';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

app.use(express.static(__dirname + '/public'));

const writeFile = fs.createWriteStream(
    path.join(__dirname, '/public/logs/server.log'), {
        flags :'a',
        encoding : 'utf8'
    }
)

const format = ':method\t:url\t:status\t:response-time';

app.use(morgan(format, {
    stream :{
        write(message) {
            const finalIndex = message.length - 1 ;
            const lastTabIndex = message.lastIndexOf('\t')
            const str = message.substring(lastTabIndex +  1 , finalIndex);
            let time =Math.ceil(parseFloat(str));
            if(time <10 ) {
                time = `0${time.toString()}`;
            } else {
                time = time.toString()
            }
            const msg = `${message.substring(0, lastTabIndex + 1)}${time}ms\n`;
            writeFile.write(msg);
        }
    }
}))

// const Logger = mongoose.model("Logger", LogSchema);

//  mongoose.connect(process.env.DB_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(data=> console.log('database conn successful')).catch(err=>console.log(err))

// app.use(morgan ({
//     collection : 'loggers',
//     connectionString:  process.env.DB_URL
// }))

app.use(express.json())

app.get('/', (req, res)=> {
    res.status(200).json({message:'index route of covid-19 estimator api'})
})

app.post('/api/v1/on-covid-19', async(req, res) => {
    try {
        let data = req.body;
        // console.log(data)
        let result = await covid19ImpactEstimator(data);
        // console.log(result)
        res.status(200).json({
            message: 'Results fetched Successfully',
            result
    })
    } catch(err) {
        res.status(400).json({message : err.message})
    }
})

app.post('/api/v1/on-covid-19/xml', async(req, res) => {
    try {
        let data = req.body;
        // console.log(data)
        let result = await covid19ImpactEstimator(data);
        // console.log(result)
        res.set('Content-Type', 'text/xml')
        res.send(xml(result))
    } catch(err) {
        res.status(400).json({message : err.message})
    }
})

app.get('/api/v1/on-covid-19/logs', async(req, res) => {
    try{
        res.set('Content-Type', 'text/plain');
        res.sendFile(__dirname + '/public/logs/server.log');
    } catch (err) {
        res.status(400).json({message :err.message})
    }
})

process.env.NODE_ENV === 'development'?
  app.listen(8080, ()=>console.log('app listening on port 8080'))
  :
  app.listen(process.env.PORT, process.env.IP, ()=> console.log(`app listening live on ${process.env.PORT}`))