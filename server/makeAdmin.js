require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user1 = await User.findOneAndUpdate(
            { email: 'insightastro5@gmail.com' }, 
            { role: 'admin' }, 
            { new: true }
        );
        const user2 = await User.findOneAndUpdate(
            { email: 'malvikparekh123@gmail.com' }, 
            { role: 'user' }, 
            { new: true }
        );
        if (user1) console.log('SUCCESS: Upgraded ' + user1.email + ' to admin.');
        else console.log('ERROR: New admin user not found in database.');
        
        if (user2) console.log('SUCCESS: Demoted ' + user2.email + ' to regular user.');
        else console.log('ERROR: Old admin user not found in database.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
makeAdmin();
