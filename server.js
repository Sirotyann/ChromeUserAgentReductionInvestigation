const express = require('express')
const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
    console.log("meta ::", req.headers)
    res.redirect('/meta.html')
})


app.get('/getHeaders', (req, res) => {
    console.log("getHeaders ::", req.headers)
    res.send(JSON.stringify(req.headers))
})

app.get('/accept', (req, res) => {
    console.log("with Accept-CH ::", req.headers)
    res.set('Accept-CH', 'Device-Memory, Viewport-Width')
    res.send(`
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <p id="board">Accept-CH</p>
        <p><b>${req.headers['device-memory']?'':'Please refresh page to get device memory and viewport width'}</b></p>
        <ul>
            ${Object.keys(req.headers).map(key => {
                return `<li><label>${key}:</label><span>${req.headers[key]}</span></li>`;
            }).join('')}
        </ul>
    </body>
</html>
    `)
})

app.get('/critical', (req, res) => {
    console.log("with Accept-CH and Critical-CH ::", req.headers)
    res.set('Accept-CH', 'Device-Memory, DPR, Viewport-Width')
    res.set('Critical-CH', 'Device-Memory')
    res.send(`
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <p id="board">Critical-CH</p>
        <ul>
            ${Object.keys(req.headers).map(key => {
                return `<li><label>${key}:</label><span>${req.headers[key]}</span></li>`;
            }).join('')}
        </ul>
    </body>
</html>
    `)
})

app.listen(3000)