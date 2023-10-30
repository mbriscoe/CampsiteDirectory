if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/CampsiteDirectory';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected: ', dbUrl);
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// SEED CAMPGROUNDS
const userIDs = [
    '652d9be17d72a09a5475a26e',
    '652e71691e6748139247c337',
    '652e76d44610d8eb15b4eed8',
    '65311da7f0095c46f03e6bad',
];

const userReviews = [
    'Not the best holiday we ever had. The staff were very rude!',
    'We have had worse stays but not many compared to this one',
    'Not too bad at all. The decor was mediocre but passable.',
    'A good holiday all round. Two weeks of good sun and lots of sea time.',
    'What a great place! The whole family thoroughly enjoyed our stay here!!!!',
];

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});

    seedUsers();

    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: '653d390c1de4fe0028ebd64b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude],
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dqe5yeugm/image/upload/v1600060601/CampsiteDirectory/001.jpg',
                    filename: 'CampsiteDirectory/001',
                },
                {
                    url: 'https://res.cloudinary.com/dqe5yeugm/image/upload/v1600060601/CampsiteDirectory/002.jpg',
                    filename: 'CampsiteDirectory/002',
                },
            ],
        });
        // SEED REVIEWS FOR THIS
        const numReviews = Math.floor(Math.random() * 10);
        for (let i = 0; i < numReviews; i++) {
            let review = new Review();
            review.author = userIDs[Math.floor(Math.random() * 4)];
            review.rating = Math.floor(Math.random() * 5) + 1;
            review.body = userReviews[review.rating];
            camp.reviews.push(review);
            await review.save();
        }
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});

async function seedUsers() {
    await User.deleteMany({});

    let user = new User();
    user._id = '652d9be17d72a09a5475a26e';
    user.email = 'tim@tim.com';
    user.username = 'timwest';
    user.salt = '1e469e365437e50949a567dd6706e350cb81d993db2985d17773a405869f773a';
    user.hash =
        'efa194c71b6fe9de1b2d28a841fba3850731802f892e6f4067614910255ad38c9c81704e4a1d8cb999423ef1c3a09ea57ddfbdbdb8240043e1a41d9e2bad762e5a57d330bfcd9b5926319f1fab2f77965890aa965f4584e33b926787efe3c095120c06ae28377bba1c1a477b82e85f6274bfc473f1379b9188ef6c8a75cf16650aa19afec0734fdc6d64fa481d7128fe5eff8c1ab3a51bc2c628a473708081223c42450f934edd419511eed6859a983d69f6dfa0d5026fb47bfc2647515ebc705a6b3ee6cad9c0915fc52a36f4cc9ade314e9e7d8117fa44aa328226b7a9a03b7bbb8cc577268944f914d31ce0373171e0d3655ea7915623d97f1e4e7963ee47893728f6b75111c9e77db139933758256231a5e758689ec8d812859de414d9a99b8d613c9654b277ad633582e6fd026abc3701e717fa7129204a6965580067fad5b93e36b63cd4e01bddf077129ff9e7d7bab9b97c1396b6c0979b4ea37ff410ecd702b01d775c568410694d2e5937e65166b866ca21b8a8d07d99a41dec62893a0d5c2d160fee7aac880edb3acc1f3c05bcc628386334b9f6723b4d57dee183b54262fb182380dc562b351f8a0f3651e1d3d154964b19b7b5ec8617968762969d92a3d3223007368f7310c851f4e932179303a4c06d2664e7812dee585b21726d387495b073f723d4021aa14341d7f7c10816a9a2987f165b7acacd3aff80f5';
    await user.save();

    user = new User();
    user._id = '652e71691e6748139247c337';
    user.email = 'sallybb@brunt.com';
    user.username = 'sallybrunt';
    user.salt = '43e9f454382cd8820913356f0dc4b2ff580c432d2e2b3d92a454122156bb133d';
    user.hash =
        '63b3c9c096493b0315b1df28bd8c9ea44c165d31d4a2f66ac4679d81f89c966167ddbc54b7b5d378d0e1a4933087d3cdc0ea26e91e4cb031b50a1087a34c536ea95d97629ce48a57cfdbcd49e87f0b6fe7bf93ed2f7fafe4471e5c7458b9aecb72a1ba14c0610067fce0e58f9d7621cc62bfffc050aad7a52b850a2dacb3cc69a949281713cef6cf7b6c19d009234cb87d2d5ca9d8d177abe3d7882146eaf4b9594150bc6748c355d1f89b8cdd33d61d560c0a074756b1cb2254fc84774797df6a489754914ceb6033d62dbdf8e3784fafb173c672553e4a30b26e184ca18f223b14fe28c418bf74d0fa206637e7eb6202fdc11317fa3401d3049c563f138736d121ba76a6c1b360125bd4063ce59c9c753af4e30310af914047ce8ce8922a706d722a39cd9f63a6bf5c62448cd8a2c806a4c68386a40d78b37988dfc32803f710c01ea0253d6da9e2aba64982f881c7db4116b9767afa13f30e9043b99a26a764eb005a7aa673f0ba2b443b31b0e554860d1790b7667f8a0150f031647ba602f90334a47ffe4747716ddcda406a7adfc3ba8d7cacd0905912eb18f78b368ec76109761c3b262d602f1c8bd1cb43645d8544f4f6d38693a20e8d217e0a19836e7c82677b3c5843e11ffffe5ff25a3709a8ddc4482dd5b9220457a39ee32abefa73e59217c09f89deafbf57014dc38700afe64ba27066a9641b0343678d74b39d';
    await user.save();

    user = new User();
    user._id = '652e76d44610d8eb15b4eed8';
    user.email = 'test1@test.com';
    user.username = 'holidayfolk';
    user.salt = '9fa1d220d88f3c0c8a79f23424234cae5677b7e46e938e426f7073c6c07aadad';
    user.hash =
        '955097b8856bb2709a575b82f0a6fba345354bf06df1823e906b7a796e697aaf39418948571231cf2c5f2f8df91ab096c81e27af8784e5ea375e506bd4dc714c5c1d81b790c75d22f08bcc041d0440f6321d11ed7d7291bb706a59b5415aebb82fea25009048117888b708aa1f596b85ad85bf721488301569c71c5c0a619e66e011f3b45ab18133c1d671a512b4f03e80d2befd4d3e085690069426b7c85b9c12e2338f7c96e4dbdd50b80a26dc16ebd507496509efc483fac9227327d531482ee5cd3e23b9bcebc8efd41de4c3d65bb58f2362ac3a6eeff3f7d3e5bacd826305d855facc63572b20bbd44d4722c76ce1d1b40c4c645a2301c879f42b43d69ab0450925f70ab01ec690ce5cd488731c8bdc39d65d008e8ddca6f85f0391f08fa859e8227e63735654a31c6f12c1ba937e75abd373b5aa3e0b6fdfcb38d5827b8f414839996cb586fb3e9f00dccdc83fd81d7e020f9967aa5550cda014c60bb9eac3a7baf0423e6eb30a322275560e1f0fd319cfa35ec86bc6c69a4b9d66d8863346f230b953b7296ec7dcaca01b3381474f99501582c119c05ceccc1f1166158a0f28218526f33932ad70194e2146017f428766d7599387f43524014aba5bffb076e581989e14667d3804ee7adf6fb58feb2e6d306ea5a3b76060319945e1d742f68895b8e2ccef80621910412ef1cffe40379138e09ef9cf503eaa8141f610';
    await user.save();

    user = new User();
    user._id = '65311da7f0095c46f03e6bad';
    user.email = 'yg@young.com';
    user.username = 'youngguns';
    user.salt = '9a6bcd8c7fd750438ae8609a6ae71530953a6957361644871485d053d2e690e0';
    user.hash =
        '5383dcddcc2639ce923e039cd47bc505112273af2e05ce76ddee67a928cd512fd6af7d9df10803f0f4eb108fe7bf11b6b3095605063446473b241f66144d1de80da8b85717bc4d3569661e9218cc2f4b4168bfc59c18bdb67d4218e124ef9af8c1ee8b457d679341b847fdf977d091b77c71258fc31d3702b9779e7f2c926c8d0bd0779abaa017ff1767b4090f4265ade04a61b1636c8ac4d571d997712a552e2bc6a963095eba5f76a9fe3e1ea49ae7622d935fd11ba8a1639e400a6c194f500df4a8f03723e9862d153f74e119def9d9f4ccd67b9ea4776fd0795ba96fac2e09d3e83f6c0899f595a89cb2724f775d42830429b548660d4ec692674b40a70b0d5c0b3d55869d23e29a3854a1933546ef3704f9d05b74df79e9de86ad4f5fb6bc398b360e0f086c700a632e8c19974b8e12a6b627eccd5337d146e3672e2fcd4846fc54bf0f3d3e52a51b5497f13e70aa71ff725fc93a32d100cee1f5991c64c76793249f9db8f744190328f27e945c9024aa2a05c54182ceb708e903850f9e711ee24921db68e9be12f21735fe113beb75934f25358a10337215fd0d87d39ee2736e5014c427c2b83ae4a74c84b4d03191ceadf3741201fcfa26cc0eeb8f5d26d859ffa430e78eab46d13a315f3dafc0c1a1654f2dee50610d829650dcd04013c7d05acafa18642d38fdea4644340c9c96e0d4e807fe255b70e3a59977948c';
    await user.save();

    //GUEST USER
    user = new User();
    user._id = '653d390c1de4fe0028ebd64b';
    user.email = 'guest@guest.com';
    user.username = 'guest';
    user.salt = '1694cb4b3d18ca04b0c10d3fa6d48443d035b6f4aa6cf456a580c66ce8d27b1c';
    user.hash =
        '728f68e8e4cf6c5838c85d48cf2cfbf494351cbab290ea122a7c274645afed89a42caf7a4c83fadc22360810aa73c26225ce6490e2d79cefc1fcd0048dd34f768e08fa30f359c56c75477f255b5118ac78ea570029b1c9346c84bea5b03ea02ccd87d229a1f0de2a21fb5bb6dec8a1f263ad5a98cfc21a3756feb872845fa33ec587eb0ee586e1cf933ea4c48a1ef7d4bd005087fa8b58405eed48a7b87d7c8805f1eec822b85306a906a1e856b744fc8994df31066be10d5ee8e055a0a177480ebb0f6d118b45923ad79c825e2a6b2e083882425f9d0e83d9f4d8d52290b9e790d59658f8284f6a764be9a86ba03293002b8c05df061ebadca3a166655c3469eb846d69b810cbf352a4a43af0491dd2b24b8fd7e062d2ad4c3d421e1a820a522af1513e400a768f9013864d93f144482196426769e491d6d02c4dd137cc254209b990829e432156c7976664fbb6af51eb86f0b0eb055b044093bdf2b8affaad95a00484b139ec9c8fa22851e99fe363643d05b6dea8155dea7948e2e0154043859a4d201e573234fc95b64f8ac8de1cf016d7aa9dd0fa01e5be7953469e8da1ac83b43dbd5f00130318019aa9a23f8bc467ce5e39e5b2b83b71efa574138cc9a181b1a801662d2f59a29cfb305c0c331ffc0c7de5ab3f157b9e333a171d37b80bbd08f9d8839cdd30bbc758a3da71418287442435709d07b2280355f47ade53';
    await user.save();
}
