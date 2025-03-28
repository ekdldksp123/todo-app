import { getDummyTodos } from '../../src/libs/utils'

describe('todos 데이터 및 검색 조건 초기화', () => {
  before(() => {
    cy.window().then((win) => {
      win.localStorage.clear() // ✅ 모든 localStorage 데이터 삭제
    })
  })

  it('localStorage가 초기화 되었는지 확인', () => {
    cy.window().then((win) => {
      expect(win.localStorage.getItem('todos')).to.be.null
    })
  })

  beforeEach(() => {
    cy.visit('/')
  })

  it('localStorage에 todos 데이터 insert', () => {
    const todos = getDummyTodos()

    cy.window().then((win) => {
      win.localStorage.setItem('todos', JSON.stringify(todos))
    })

    cy.window().then((win) => {
      const data = win.localStorage.getItem('todos')
      expect(data).to.be.not.null
      if (data) expect(JSON.parse(data)).to.have.length(50)
    })
  })

  it('GET API 호출해서 todos 데이터 확인', () => {
    cy.request('/api/todos').then((response) => {
      console.log(response)
      expect(response.status).to.eq(200)
    })
  })
})
