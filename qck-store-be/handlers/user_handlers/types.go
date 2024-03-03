package user_handlers

type UserResponse struct {
	Id        int    `json:"id"`
	Role      string `json:"role"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type RegistrationResponse struct {
	Id         int  `json:"id"`
	EmailInUse bool `json:"emailInUse"`
	NameInUse  bool `json:"nameInUse"`
}

type LoginCommand struct {
	Identifier string
	Password   string
}

type RegistrationCommand struct {
	Email     string
	Username  string
	FirstName string
	LastName  string
	Password  string
}
