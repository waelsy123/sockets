import express from "express";
const { Server } = require('ws');

const PORT = process.env.PORT || 8080;

const server = express()
    .use((req, res) => res.send('hi'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));


const wss = new Server({ server });

let store: any = {}
let clients: any = []

wss.on('connection', (ws: any) => {
    console.log('Client connected');
    clients.push(ws)
    const clientReference = clients.length

    // we send {
    //     id,
    //     ...data
    // }
    ws.on('message', function message(data: any) {
        console.log("🚀 ~ file: server.ts ~ line 35 ~ wss.on ~ data", data.toString())

        try {
            const json = JSON.parse(data.toString())

            store[json.id] = { ...json, time: new Date().getTime() }
            clients.forEach((ws: any) => {
                ws.send(JSON.stringify(json));
            });
        } catch (e: any) { }

    });


    const items = Object.values(store)
    items.map((item) => { ws.send(JSON.stringify(item)) })

    ws.on('close', () => {
        delete clients[clientReference - 1];
        console.log('Client disconnected')
    });
});



setInterval(() => {
    const entrs = Object.entries(store).filter(([key, value]: any) => {
        if (new Date().getTime() - value.time > 5 * 60 * 1000) { // 5 minutes
            return false
        }
        return true
    })

    store = Object.fromEntries(entrs);

}, 1000)

