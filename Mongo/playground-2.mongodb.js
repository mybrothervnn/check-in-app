// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('blj_order_demo');

// Create a new document in the collection.
db.getCollection('customers').insertOne({
    name: 'Thanh',
    phone: '070044',
    visits: 4,
    lastCheckIn: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
});
