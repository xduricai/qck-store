package user_handlers

type UserResponse struct {
	Id        int
	Role      string
	FirstName string
	LastName  string
}

type RegistrationResponse struct {
	Id         int
	EmailInUse bool
	NameInUse  bool
}

type LoginCommand struct {
	Email    string
	Username string
	Password string
}

type RegistrationCommand struct {
	Email     string
	Username  string
	FirstName string
	LastName  string
	Password  string
}
