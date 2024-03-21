/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contrato'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {
  let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    });

  it('Deve validar contrato de usuários', () => {
      cy.request('usuarios').then(response => {
        return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
        cy.request({
          method: 'GET',
          url: 'usuarios'
      }).then((response) => {
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('usuarios')
      })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    cy.cadastrarUsuario(faker.person.fullName(), faker.internet.email(), 'teste', 'true')
    .then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.cadastrarUsuario(faker.person.fullName(), 'josi_qa@qa.com.br', 'teste', 'true')
    .then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.equal('Este email já está sendo usado')
  })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let nome = faker.person.fullName() + Math.floor(Math.random() * 1000000000)
    cy.cadastrarUsuario(nome, faker.internet.email(), 'teste', 'true')
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'PUT', 
                url: `usuarios/${id}`,
                headers: {authorization: token},
                body: {
                  "nome": nome,
                  "email": faker.internet.email(),
                  "password": "teste",
                  "administrador": "true"
                }
            }).should(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
                expect(response.status).to.equal(200)
            })
    })
    
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let nome = faker.person.fullName() + Math.floor(Math.random() * 1000000000)
    cy.cadastrarUsuario(nome, faker.internet.email(), 'teste', 'true')
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE', 
                url: `usuarios/${id}`,
                headers: {authorization: token},
            }).then(response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
    })
  });

});
