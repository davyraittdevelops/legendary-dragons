describe('Register new user', () => {
  it('passes', () => {
    //arrange
    cy.visit('/register')
    let emailInput = cy.get("input[name=email]")
    let nameInput = cy.get("input[name=name]")
    let passwordInput = cy.get("input[name=password]")
    let confirmPasswordInput = cy.get("input[name=confirmPassword]")
    let registerForm = cy.get("form")

    //act
    emailInput.type("test@test.nl")
    nameInput.type("testNickName")
    passwordInput.type("verySecurePassw0rd!")
    confirmPasswordInput.type("verySecurePassw0rd!").blur()
    registerForm.submit()

    //assert
    cy.get("input[name=email]").should('contain.value', "test@test.nl")
    cy.get("input[name=name]").should('contain.value', "testNickName")
    cy.get("input[name=password]").should('contain.value', "verySecurePassw0rd!")
    cy.get("input[name=confirmPassword]").should('contain.value', "verySecurePassw0rd!")
  })
})

describe('Register new user with too short nickname', () => {
  it('passes', () => {
    //arrange
    cy.visit('/register')
    let emailInput = cy.get("input[name=email]")
    let nameInput = cy.get("input[name=name]")
    let passwordInput = cy.get("input[name=password]")
    let confirmPasswordInput = cy.get("input[name=confirmPassword]")
    let registerForm = cy.get("form")

    //act
    emailInput.type("test@test.nl")
    nameInput.type("ab")
    passwordInput.type("verySecurePassw0rd!")
    confirmPasswordInput.type("verySecurePassw0rd!").blur()
    registerForm.submit()

    //assert
    cy.get("input[name=email]").should('contain.value', "test@test.nl")
    cy.get("input[name=name]").should('contain.value', "ab")
    cy.get("input[name=password]").should('contain.value', "verySecurePassw0rd!")
    cy.get("input[name=confirmPassword]").should('contain.value', "verySecurePassw0rd!")

    cy.get("form").should('contain.text', 'Name must be at least 3 characters long.')
  })
})

describe('Register new user with too long nickname', () => {
  it('passes', () => {
    //arrange
    cy.visit('/register')
    let emailInput = cy.get("input[name=email]")
    let nameInput = cy.get("input[name=name]")
    let passwordInput = cy.get("input[name=password]")
    let confirmPasswordInput = cy.get("input[name=confirmPassword]")
    let registerForm = cy.get("form")

    //act
    emailInput.type("test@test.nl")
    nameInput.type("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    passwordInput.type("verySecurePassw0rd!")
    confirmPasswordInput.type("verySecurePassw0rd!").blur()
    registerForm.submit()

    //assert
    cy.get("input[name=email]").should('contain.value', "test@test.nl")
    cy.get("input[name=name]").should('contain.value', "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    cy.get("input[name=password]").should('contain.value', "verySecurePassw0rd!")
    cy.get("input[name=confirmPassword]").should('contain.value', "verySecurePassw0rd!")

    cy.get("form").should('contain.text', 'Name must be shorter than 75 characters.')
  })
})

describe("Register new user with already existing email", () => {
  it('passes', () => {
    //arrange
    cy.visit('/register')
    let emailInput = cy.get("input[name=email]")
    let nameInput = cy.get("input[name=name]")
    let passwordInput = cy.get("input[name=password]")
    let confirmPasswordInput = cy.get("input[name=confirmPassword]")
    let registerForm = cy.get("form")

    //act
    emailInput.type("oopamxicbrujagrfvi@tmmcv.com")
    nameInput.type("testNickName")
    passwordInput.type("verySecurePassw0rd!")
    confirmPasswordInput.type("verySecurePassw0rd!").blur()
    registerForm.submit()

    //assert
    cy.get("input[name=email]").should('contain.value', "oopamxicbrujagrfvi@tmmcv.com")
    cy.get("input[name=name]").should('contain.value', "testNickName")
    cy.get("input[name=password]").should('contain.value', "verySecurePassw0rd!")
    cy.get("input[name=confirmPassword]").should('contain.value', "verySecurePassw0rd!")

    cy.get("form").should('contain.text', 'An error has occurred! Please check the fields above.')
  })
})

describe("Register new user with incorrect password", () => {
  it('passes', () => {
    //arrange
    cy.visit('/register')
    let emailInput = cy.get("input[name=email]")
    let nameInput = cy.get("input[name=name]")
    let passwordInput = cy.get("input[name=password]")
    let confirmPasswordInput = cy.get("input[name=confirmPassword]")

    //act
    emailInput.type("test@test.nl")
    nameInput.type("testNickName")
    passwordInput.type("verySecurePassw0rd!")
    confirmPasswordInput.type("incorrectPassword").blur()

    //assert
    cy.get("input[name=email]").should('contain.value', "test@test.nl")
    cy.get("input[name=name]").should('contain.value', "testNickName")
    cy.get("input[name=password]").should('contain.value', "verySecurePassw0rd!")
    cy.get("input[name=confirmPassword]").should('contain.value', "incorrectPassword")

    cy.get("form").should('contain.text', 'The repeated password does not match.')
  })
})

describe("Register new user with incorrect password length", () => {
  it('passes', () => {
    //arrange
    cy.visit('/register')
    let emailInput = cy.get("input[name=email]")
    let nameInput = cy.get("input[name=name]")
    let passwordInput = cy.get("input[name=password]")
    let confirmPasswordInput = cy.get("input[name=confirmPassword]")

    //act
    emailInput.type("test@test.nl")
    nameInput.type("testNickName")
    passwordInput.type("sh0rt!")
    confirmPasswordInput.type("sh0rt!").blur()

    //assert
    cy.get("input[name=email]").should('contain.value', "test@test.nl")
    cy.get("input[name=name]").should('contain.value', "testNickName")
    cy.get("input[name=password]").should('contain.value', "sh0rt!")
    cy.get("input[name=confirmPassword]").should('contain.value', "sh0rt!")

    cy.get("form").should('contain.text', 'Password must be at least 10 characters long.')
  })
})

describe("Register new user with incorrect password format", () => {
  it('passes', () => {
    //arrange
    cy.visit('/register')
    let emailInput = cy.get("input[name=email]")
    let nameInput = cy.get("input[name=name]")
    let passwordInput = cy.get("input[name=password]")
    let confirmPasswordInput = cy.get("input[name=confirmPassword]")

    //act
    emailInput.type("test@test.nl")
    nameInput.type("testNickName")
    passwordInput.type("verySecurePassword")
    confirmPasswordInput.type("verySecurePassword").blur()

    //assert
    cy.get("input[name=email]").should('contain.value', "test@test.nl")
    cy.get("input[name=name]").should('contain.value', "testNickName")
    cy.get("input[name=password]").should('contain.value', "verySecurePassword")
    cy.get("input[name=confirmPassword]").should('contain.value', "verySecurePassword")

    cy.get("form").should('contain.text', 'Password must contain lowercase letters, uppercase letters, numbers and special characters.')
  })
})
