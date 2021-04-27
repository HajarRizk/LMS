const Joi = require('joi');
const express = require('express');
const app = express();
var bodyParser =require('body-parser');

var urlencodedParser =bodyParser.urlencoded({extended:false})

app.use(express.json());

const courses = [
{id:1 , name: 'course1',code:'CSE142',description:'Elective Course'},

];
const students = [
{id:1 , name: 'Hajer Mohamed',code:'1601633'},
];

app.get('/web/students/create',(req,res) => {
	res.sendFile(__dirname + '//HTMLForm.html');
});
app.get('/web/courses/create',(req,res) => {
	res.sendFile(__dirname + '//HTMLForm2.html');
});
//read course
app.get('/api/courses',(req,res) => {
	res.send(courses);

});
//read students
app.get('/api/students',(req,res) => {
	res.send(students);

});
//read certain course
app.get('/api/courses/:id',(req,res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id) );
	if(!course) return res.status(404).send('The Course with the given ID was not found');
	res.send(course);

});
//read certain student
app.get('/api/students/:id',(req,res) => {
	const student = students.find(c => c.id === parseInt(req.params.id) );
	if(!student) return res.status(404).send('The Student with the given ID was not found');
	res.send(student);

});

//create course
app.post('/api/courses',(req,res) => { 
    const result = validateCourse(req.body);
	if(result.error)
	{
		res.status(400).send(result.error.details[0].message);
		return;
	}
	const course = {
		id: courses.length + 1,
		name: req.body.name,
		code: req.body.code,
		description: req.body.description
	};
	courses.push(course);
	res.send(course);

	
});

//create student
app.post('/api/students',(req,res) => { 
    const result = validateStudent(req.body);
	if(result.error)
	{
		res.status(400).send(result.error.details[0].message);
		return;
	}
	const student = {
		id: students.length + 1,
		name: req.body.name,
		code: req.body.code
		
	};
	students.push(student);
	res.send(student);

	
});
//create student with HTML
app.post('/web/students/create/StudentAdded',urlencodedParser,(req,res) => { 
    const result = validateStudent(req.body);
	if(result.error)
	{
		res.status(400).send(result.error.details[0].message);
		return;
	}
	const student = {
		id: students.length + 1,
		name: req.body.name,
		code: req.body.code
		
	};
	students.push(student);
	res.send(student);
	

	
});

//create course with HTML
app.post('/web/courses/create/courseAdded',urlencodedParser,(req,res) => { 
    const result = validateCourse(req.body);
	if(result.error)
	{
		res.status(400).send(result.error.details[0].message);
		return;
	}
	const course = {
		id: courses.length + 1,
		name: req.body.name,
		code: req.body.code,
		description: req.body.description
	};
	courses.push(course);
	res.send(course);
	

	
});


//update course
app.put('/api/courses/:id',(req,res) => {
	//Look up the course 
	//If not existing,retuen 404
	const course = courses.find(c => c.id === parseInt(req.params.id) );
	if(!course){
		res.status(404).send('The Course with the given ID was not found');
	    return;
	}
     
	//Validate
	//If invalid,retuen 400-Bad request
	const result = validateCourse(req.body);
	if(result.error)
	{
		res.status(400).send(result.error.details[0].message);
		return;
	}
	
	course.name=req.body.name;
	course.code=req.body.code;
	course.description=req.body.description;
	res.send(course);
     


});

//update student
app.put('/api/students/:id',(req,res) => {
	//Look up the course 
	//If not existing,retuen 404
	const student = students.find(c => c.id === parseInt(req.params.id) );
	if(!student){
		res.status(404).send('The Student with the given ID was not found');
	    return;
	}
     
	//Validate
	//If invalid,retuen 400-Bad request
	const result = validateStudent(req.body);
	if(result.error)
	{
		res.status(400).send(result.error.details[0].message);
		return;
	}
	
	student.name=req.body.name;
	student.code=req.body.code;
	res.send(student);
     


});

//validation function

function validateCourse(course)
{
	const schema = {
	name: Joi.string().min(5).required(),
	code:Joi.string().max(6).required(),
	description:Joi.string().max(200).optional()
	};
	return Joi.validate(course,schema);
}
//regex(/^[a-zA-Z,- ]*$/)
function validateStudent(student)
{
	const schema = {
	name: Joi.string().regex(/^[-a-zA-Z, ]*$/).required(),
	code:Joi.string().max(7).required()
	};
	return Joi.validate(student,schema);
}


//Delete course
app.delete('/api/courses/:id',(req,res) => {
	//Look up the course 
	//If not existing,retuen 404
	const course = courses.find(c => c.id === parseInt(req.params.id) );
	if(!course){
		res.status(404).send('The Course with the given ID was not found');
	    return;
	}
     
	//delete
	const index = courses.indexOf(course);
	courses.splice(index,1);
	
	
	res.send(course);
     


});
//Delete student
app.delete('/api/students/:id',(req,res) => {
	//Look up the course 
	//If not existing,retuen 404
	const student = students.find(c => c.id === parseInt(req.params.id) );
	if(!student){
		res.status(404).send('The Student with the given ID was not found');
	    return;
	}
     
	//delete
	const index = students.indexOf(student);
	students.splice(index,1);
	
	
	res.send(student);
     


});

//PORT
const port = process.env.PORT || 3000
app.listen(port,() => console.log(`Listening on port ${port}`))