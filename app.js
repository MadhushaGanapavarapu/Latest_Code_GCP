    const { Datastore } = require('@google-cloud/datastore');
const express = require('express');

const app = express();
const kind = 'Customer_Data'
const datastore = new Datastore({
    projectId: 'newsampleproject-245021',
    keyFilename: 'newSampleProject.json'
});

app.get('/getCustomers', function (request, response) {
        let query = datastore.createQuery(kind);
        query.run(function (error, custData) {
                return response
                    .status(200)
                    .send(custData);
        })
});


function isInteger(id) {
    return id % 1 === 0;
}

app.get('/getCustomer/:customer_id', function (request, response) {
        if (!isInteger(request.params.customer_id)) {
            return response
                .status(200)
                .json({ error: 'invalid ID !' })
        }
        else {
            const customerId = parseInt(request.params.customer_id);
            let query = datastore.createQuery(kind)
            query.run(function (error, data) {
                var item = data.find(item => item.customer_ID === customerId);
                if (!item) {
                    return response
                        .status(200)
                        .json({ error: 'No record found !' })
                }
                else {
                    return response
                        .status(200)
                        .send(item);
                }
            });
        }
    
});

app.get('/', function (request, response) {
    return response
        .status(200)
        .send('Change the API endpoints to "/getCustomers" for fetching customer list and "/getCustomer/id" for fetching customer specific details!');
});

const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
module.exports = app;
