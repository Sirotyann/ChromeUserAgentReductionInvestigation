const express = require('express')
const app = express()

app.use(express.static('public'))

let index = 0

app.get('/', (req, res) => {
    console.log("meta ::", req.headers)
    res.redirect('/meta.html')
})

app.get('/getHeaders', (req, res) => {
    console.log(`[${index++}] getHeaders ::`, req.headers)
    res.send(JSON.stringify(req.headers))
})

app.get('/accept', (req, res) => {
    console.log(`[${index++}] with Accept-CH ::`, req.headers)
    res.set('Accept-CH', 'Sec-CH-UA-Full-Version, Device-Memory, Viewport-Width, Sec-CH-UA-Model')
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
    console.log(`[${index++}] with Accept-CH and Critical-CH ::`, req.headers)
    res.set('Accept-CH', 'Sec-CH-UA-Full-Version, Device-Memory, Sec-CH-UA-Model')
    res.set('Critical-CH', 'Sec-CH-UA-Full-Version, Sec-CH-UA-Model')
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

app.get("/iframe_src_content", (req, res) => {
    console.log(`[${index++}] iframe_src_content ::`, req.headers)
    res.set('Accept-CH', 'Sec-CH-UA-Full-Version, Device-Memory, Sec-CH-UA-Model')
    res.send(`
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <h1>/iframe_src_content</h1>
        <script type="text/javascript">
            fetch('/getHeaders').then(resp => resp.json()).then(data => console.log(data));
        </script>
    </body>
</html>
    `)
})

app.get('/iframe', (req, res) => {
    console.log(`[${index++}] Iframe::`, req.headers)
    res.set('Accept-CH', 'Sec-CH-UA-Full-Version')
    res.set('Critical-CH', 'Sec-CH-UA-Full-Version')
    res.send(`
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <p id="board">Iframe Accept-CH at srcdoc, doesn't work</p>
        <iframe allow="ch-ua-full-version" srcdoc="<!DOCTYPE html><head><meta http-equiv='Accept-CH' content='Sec-CH-UA-Full-Version' /><meta http-equiv='Critical-CH' content='Sec-CH-UA-Model' /></head><html><body><p id='board'>Iframe</p>
        <script type='text/javascript'>
            fetch('/getHeaders').then(resp => resp.json()).then(data => console.log(data));
        </script></body></html>"></iframe>
    </body>
</html>
    `)
})

app.listen(3000)