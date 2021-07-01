const express = require('express');
const router = express.Router();
const { Dbilia } = require('../models/Dbilia');
const multer = require('multer');

const { auth } = require('../middleware/auth');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		if (ext !== '.jpg' || ext !== '.png') {
			return cb(res.status(400).end('only jpg, png are allowed'), false);
		}
		cb(null, true);
	},
});

var upload = multer({ storage: storage }).single('file');

//=================================
//             Dbilia
//=================================

router.post('/uploadImage', auth, (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			return res.json({ success: false, err });
		}
		return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename });
	});
});

router.post('/uploadDbilia', auth, (req, res) => {
	//save all the data we got from the client into the DB
	const dbilia = new Dbilia(req.body);

	dbilia.save((err) => {
		if (err) return res.status(400).json({ success: false, err });
		return res.status(200).json({ success: true });
	});
});

// if (err) return res.status(400).json({ success: false });
// 		return res.status(200).json({ success: true });

router.get('/find', (req, res) => {
	const query = req.query;
	Dbilia.findOne(query, (err, doc) => {
		res.json({
			info: doc,
		});
	});
});

router.get('/getDbilias', (req, res) => {
	res.json({
		confirmation: 'success',
		data: 'you are here',
	});
});

router.get('/update', (req, res) => {
	const query = req.query;

	Dbilia.findOneAndUpdate(query).then((item) => {
		res.json({
			confirmation: 'success',
			data: item,
		});
	});
});


module.exports = router;
