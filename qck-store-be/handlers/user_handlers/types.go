package user_handlers

type UserResponse struct {
	Id        int
	Role      string
	FirstName string
	LastName  string
}

type LoginCommand struct {
	Email    string
	Username string
	Password string
}
