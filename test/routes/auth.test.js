const auth = require("../../controllers/auth");
const authRoutes = require("../../routes/auth");
const app = require("../../app");

// test('check' , () =>{
//     console.log(expect(authRoutes.getSignup));
// })
const express = require("express"); // import express

const request = require("supertest"); // supertest is a framework that allows to easily test web apis
// const app = express();

app.use("/", authRoutes); //routes

describe("testing-server-routes", () => {
  it("GET /states - success", async () => {
    const { body } = await request(app).get("/login").expect(200);
  });
  it("GET /states - success", async () => {
    const { body } = await request(app).get("/signup").expect(200);
  });
  it("GET /states - success", async () => {
    const { body } = await request(app).get("/groups").expect(200);
  });
});
describe('POST /users', function() {
  it('responds with json', function(done) {
    request(app)
      .post('/login')
      .send({email: 'yaminikabra2001@gmail.com', password: '12345678'})
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
  });
});
// const request = supertest(authRoutes);
// app.use("/", app1); //routes
// describe("testing-auth-routes", () => {
//   it("GET /login - success", async () => {
//     const  body  = await request(app).get("/"); //uses the request function that calls on express app instance
//     // console.log(body.statusCode);
//     // expect(body.statusCode).toBe(200);
//     body.expect(200).end((err,res)=>{
//         expect(res.text).toBe("<h1>Page not found1</h1>");

//     });
//   });
// });

// beforeAll(async () => await new Promise(f => setTimeout(f,1000)));
// test("hehe" , () => {
//     request(app)
//     .get("http://localhost:8000/check")
//     .expect(200)
//     .end((err,res) =>{
//         expect(res.text).toBe("hey");
//     })
// });

// describe('Set Profile Image', () => {
//     it('Set Profile Image', async() => {
//       const res = await request(app)
//         .get('/login')
        
//       expect(res.status).toBe(200)
//     })
//   });
// it('gets the test endpoint', async done => {
//     const response = await request.get('/login')
  
//     expect(response.status).toBe(200)
    
//     done()
//   })