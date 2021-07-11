const handleRegister = (req, res, db, bcrypt) =>{
	const {email,name,password}=req.body;
	if(!email || !name || !password){
		return res.status(400).json('Please enter the fields');
	}
	const hash = bcrypt.hashSync(password);
	db.transaction(trs=>{
		trs.insert({
			hash:hash,
			email:email
		})
		.into('login')
		.returning('email')
		.then(loginemail=>{
			return trs('users')
	.returning('*')
	.insert({
		email:loginemail[0],
		name:name,
		joined:new Date()
	})
	.then(user=>{
		res.json(user[0]);
	})
	})
		.then(trs.commit)
		.catch(trs.rollback)
	})
	.catch(err=>res.status(400).res.json('unable to register'))

}
module.exports={
	handleRegister:handleRegister
}