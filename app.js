const express = require("express");
const app = express();
const labo = require('./models/db.Laborant');
const rapor = require('./models/db.Rapor');
const sequelize = require('./config/db.Connect');
const port = process.env.PORT || 8080;
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require("path");
const User = require("./models/db.User");
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken'); // jwt paketini eklemeyi unutmayın
const cookieParser = require("cookie-parser");
const { StatusCodes } = require("http-status-codes");
const checkjwt = require("./auth");




const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Sadece resim yükleyin"));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 500000 },
});

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        success: 1,
        profile_url: `http://localhost:8080/profile/${req.file.filename}`
    });
});

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError || err.message === 'Sadece resim yükleyiniz') {
        res.json({
            success: 0,
            message: err.message
        });
    } else {
        next(err)
    }
}




app.use('/profile', express.static(path.join(__dirname, 'upload/images')));
app.use(errHandler);
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use(cookieParser());
sequelize.authenticate()
    .then(() => {
        console.log("Basarili Baglanti");
    })
    .catch((err) => {
        console.error("Hatali Giris");
    });

sequelize.sync(
    {
        force: true

    }
)
    .then(() => {
        console.log("VeriTabanına Girdiniz");
    })
    .catch((err) => {
        console.error("VeriTabanına Giremediniz", err);
    });

app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({
            username, password: hashedPassword, role
        });
        res.json({ message: 'Düzgünce oluşturuldu' });
    } catch (err) {
        res.status(400).json({ error: 'Kullanici oluşturulamadi' });
    }
});


app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;
    const user = await User.findOne({ where: { username } });
    await bcrypt.compare(password, user.password)
        .then(result => {
            const token = jwt.sign({
                username: username,
                password: password,
                role: role,
                ad: "Muhsin",
                exp: Math.floor(Date.now() / 1000) + 60,
            }, 'SECRET_KEY')
            res.status(200).send(token);
        })
        .catch(error => {
            res.status(404).send("Giriş basarisiz!");
        })
})
app.post("/posts", checkjwt, function (req, res, next) {

    res.send("Hoşgeldiniz Doktor")
})





app.post('/add', async (req, res) => {
    const reqBody = req.body;
    try {
        const hasta = await rapor.create(reqBody);
        res.status(200).send({ message: 'Hasta Eklendi', data: hasta });
    } catch (err) {
        console.error('Hasta Eklenemedi :', err);
        res.status(500).send(err);
    }
});

app.post("/labo", async (req, res) => {
    const reqbody = req.body;
    try {
        await labo.create(reqbody);
        res.send("Laborant Oluştu");
    } catch (error) {
        res.send("Hata ", error);
    }
});

app.get("/labo/:Id", async (req, res) => {
    const { Id } = req.params;
    try {
        const adam = await labo.findByPk(Id);
        res.send(adam);
    } catch (error) {
        res.send(error);
    }
})

app.get("/rapor", async (req, res) => {
    try {
        const raporlar = await rapor.findAll();
        res.send(raporlar);
    } catch (error) {
        res.send(error);
    }
});

app.get("/rapor/:RaporId", async (req, res) => {
    const { RaporId } = req.params;
    try {
        const adam = await rapor.findByPk(RaporId);
        if (!adam) {
            return res.status(404).json({ error: "Rapor bulunamadi" });
        }

        res.json(adam);
    } catch (error) {
        res.send(error);
    }
});
app.get('/rapor/HastaAd/:HastaAd', async (req, res) => {
    const { HastaAd } = req.params;
    try {
        const hasta = await rapor.findAll({
            where: {
                HastaAd: {
                    [Op.like]: `%${HastaAd}%`
                }
            }
        });
        res.json(hasta);
    } catch (error) {
        console.log("Hata", err);

    }
});


app.get("/labo/:Id", async (req, res) => {
    const { Id } = req.params;
    try {
        const adam = await labo.findByPk(Id);
        res.send(adam);
    } catch (error) {
        res.send(error);
    }
});
app.put("/rapor/:RaporId", checkjwt, async (req, res) => {

    const { RaporId } = req.params;
    const reqbody = req.body;

    try {

        const rapord = await rapor.findByPk(RaporId);

        if (rapord) {

            await rapord.update(reqbody);
            res.status(200).send("Güncellendi");
        } else {

            res.status(404).send("Rapor bulunamadı, güncellenemedi");
        }
    } catch (error) {

        res.status(500).json({ error: error.message });
    }
});
app.put("/rapor/:RaporId", upload.single("image"), async (req, res) => {
    const { RaporId } = req.params;
    const reqbody = req.body;
    try {
        const adam = await rapor.findByPk(RaporId);
        if (adam) {
            await adam.update(reqbody);
            res.status(200).send("Güncellendi");
        } else {
            res.status(404).send("Güncellenmedi");
        }
    } catch (error) {
        res.status(500).send("Hata", error);
    }
});




app.delete('/rapor/:RaporId', async (req, res) => {
    const { RaporId } = req.params;

    try {
        const sil = await rapor.findByPk(RaporId);
        if (sil) {
            await rapor.destroy({
                where: {
                    RaporId: RaporId
                }
            });
            res.status(200).send('Rapor başariyla silindi');
        } else {
            res.status(404).send('Rapor bulunamadi');
        }
    } catch (err) {
        console.error('Raporu silerken hata oluştu', err);
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log("İstenilen port çalıştı", port);
});
