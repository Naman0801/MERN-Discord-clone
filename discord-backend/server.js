import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import mongoData from './mongoData.js';
import Pusher from 'pusher';

// App config
const app = express();
const port = process.env.PORT || 8002;

const pusher = new Pusher({
    appId: "1110330",
    key: "02e95e8ca3685240313d",
    secret: "ba81f50c7e687c69a78f",
    cluster: "ap2",
    useTLS: true
});  

// Middleware
app.use(express.json());
app.use(cors());

// db config
const mongoURI = 'mongodb+srv://admin:fVWJ23Z52wqG6zcJ@cluster0.sghfd.mongodb.net/discordDB?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
    console.log('DB connected');

    const changeStream = mongoose.connection.collection('conversations').watch();

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            pusher.trigger("channels", "newChannel", {
                'change': change
            });
        } else if (change.operationType === 'update') {
            pusher.trigger("conversation", "newMessage", {
                'change': change
            });
        } else {
            console.log('Error triggering Pusher');
        }
    })
})

// api routes
app.get('/', (req, res) => res.status(200).send('Hello World!!!'));

app.post('/new/channel', (req, res) => {
    const dbData = req.body
    
    mongoData.create(dbData, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
});

app.get('/get/channelList', (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            let channels = [];

            data.map(channelData => {
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }
                channels.push(channelInfo);
            })

            res.status(200).send(channels);
        }
    })
})

app.post('/new/message', (req, res) => {
    const newMessage = req.body;

    mongoData.update(
        {_id: req.query.id},
        {$push: { conversation: newMessage }},
        (err, data) => {
            if (err) {
                console.log('error saving messages... ');
                console.log(err);

                res.status(500).send(err);
            } else {
                res.status(201).send(data);
            }
        }
    )
})

app.get('/get/conversation', (req, res) => {
    const id = req.query.id;

    mongoData.find({_id: id}, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
})

// Gets the whole data
app.get('/get/data', (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
})

// listner
app.listen(port, () => console.log(`listening on localHost: ${port}`));