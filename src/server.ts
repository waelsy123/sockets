import express from "express";
import crypto from 'crypto';


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
    const clientId = new Date().getTime().toString()
    const hash = clientId

    clients.push(ws)
    const clientReference = clients.length

    // we send {
    //     hash,
    //     ...data
    // }
    ws.on('message', function message(data: any) {
        console.log("🚀 ~ file: server.ts ~ line 35 ~ wss.on ~ data", data.toString())

        try {
            const str = data.toString()
            const json = JSON.parse(str)


            store[hash] = { ...json, hash, time: new Date().getTime() }

            // clients.forEach((ws: any) => {
            //     ws.send(JSON.stringify(json));
            // });
        } catch (e: any) { }

    });

    // send client all games every 2 seconds
    const sendAllGames = () => {
        const items = Object.values(store)
        items.map((item) => { ws.send(JSON.stringify(item)) })
    }
    sendAllGames()
    const intr = setInterval(() => {
        sendAllGames()
    }, 1000)

    ws.on('close', () => {
        delete clients[clientReference - 1];
        clearInterval(intr)
        console.log('Client disconnected')
    });
});


// clear old cache
setInterval(() => {
    const entrs = Object.entries(store).filter(([_key, value]: any) => {
        if (new Date().getTime() - value.time > 5 * 60 * 1000) { // 5 minutes
            return false
        }
        return true
    })

    store = Object.fromEntries(entrs);

}, 10000)
