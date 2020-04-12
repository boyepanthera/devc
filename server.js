import xml from 'jsontoxml';
import express from 'express';
import covid19ImpactEstimator from './src/estimator';
const app = express();

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

process.env.NODE_ENV === 'development'?
  app.listen(8080, ()=>console.log('app listening on port 8080'))
  :
  app.listen(process.env.PORT, process.env.IP, ()=> console.log(`app listening live on ${process.env.PORT}`))