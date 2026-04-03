const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const expect = chai.expect

chai.use(chaiHttp)

let token = ''
let planId = ''
let mealId = ''

describe('Nutrition Plan API Tests',()=>{

  //register and login to get token
  before(async()=>{
    const registerRes = await chai.request(app)
      .post('/api/auth/register')
      .send({
        name:'Test User',
        email:'testplan@example.com',
        password:'password123'
      })

    const loginRes = await chai.request(app)
      .post('/api/auth/login')
      .send({
        email: 'testplan@example.com',
        password: 'password123'
      })
    token = loginRes.body.token
  })

  describe('POST /api/plans', ()=>{
    it('should create a new nutrition plan', async()=>{
      const res = await chai.request(app)
        .post('/api/plans')
        .set('Authorization', `Bearer ${token}`)
        .send({
          planName:'My Diet Plan',
          description: 'Testing plan creation',
          goal:'weight_loss',
          targetCalories: 1800
        })
      expect(res).to.have.status(201)
      expect(res.body).to.have.property('planName','My Diet Plan')
      planId = res.body._id
    })

    it('should fail without auth token',async()=>{
      const res = await chai.request(app)
        .post('/api/plans')
        .send({planName:'No Auth Plan'})
      expect(res).to.have.status(401)
    })
  })

  describe('GET /api/plans',()=>{
    it('should get all plans for user',async()=>{
      const res = await chai.request(app)
        .get('/api/plans')
        .set('Authorization',`Bearer ${token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.be.greaterThan(0)
    })
  })

  describe('GET /api/plans/:id',()=>{
    it('should get single plan by id',async()=>{
      const res = await chai.request(app)
        .get(`/api/plans/${planId}`)
        .set('Authorization',`Bearer ${token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('_id',planId)
    })

    it('should return 404 for non existant plan', async()=>{
      const res = await chai.request(app)
        .get('/api/plans/64f1a2b3c4d5e6f7a8b9c0d1')
        .set('Authorization',`Bearer ${token}`)
      expect(res).to.have.status(404)
    })
  })

  describe('PUT /api/plans/:id',()=>{
    it('should update the plan',async ()=>{
      const res = await chai.request(app)
        .put(`/api/plans/${planId}`)
        .set('Authorization',`Bearer ${token}`)
        .send({planName:'Updated Diet Plan', status:'paused'})
      expect(res).to.have.status(200)
      expect(res.body.planName).to.equal('Updated Diet Plan')
    })
  })

  describe('POST /api/plans/:id/meals',()=>{
    it('should add a meal to the plan',async()=>{
      const res = await chai.request(app)
        .post(`/api/plans/${planId}/meals`)
        .set('Authorization',`Bearer ${token}`)
        .send({
          mealName:'Chicken Salad',
          mealType:'lunch',
          calories:450,
          protien: 35,
          carbs:20,
          fats: 15
        })
      expect(res).to.have.status(201)
      expect(res.body.meals.length).to.equal(1)
      mealId = res.body.meals[0]._id
    })
  })

  describe('DELETE /api/plans/:id/meals/:mealId',()=>{
    it('should remove meal from plan', async()=>{
      const res = await chai.request(app)
        .delete(`/api/plans/${planId}/meals/${mealId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res).to.have.status(200)
      expect(res.body.meals.length).to.equal(0)
    })
  })

  describe('DELETE /api/plans/:id',()=>{
    it('should delete the plan',async()=>{
      const res = await chai.request(app)
        .delete(`/api/plans/${planId}`)
        .set('Authorization',`Bearer ${token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('message')
    })
  })
})
