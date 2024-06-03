package user_handlers

import "fmt"

type UserResponse struct {
	Id             int    `json:"-"`
	BytesUsed      int    `json:"bytesUsed"`
	BytesTotal     int    `json:"bytesTotal"`
	Role           string `json:"role"`
	Email          string `json:"email"`
	FirstName      string `json:"firstName"`
	LastName       string `json:"lastName"`
	ProfilePicture string `json:"ProfilePicture"`
}

type RegistrationResponse struct {
	Id         int  `json:"-"`
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

type UpdateUserCommand struct {
	UpdateEmail    bool
	UpdatePicture  bool
	Email          string
	FirstName      string
	LastName       string
	ProfilePicture string
}

type UpdatePasswordCommand struct {
	NewPassword string
	OldPassword string
}

func (user *UserResponse) FormatEmail() {
	var at int
	var dot int

	for idx := range user.Email {
		if (user.Email[idx]) == '@' {
			at = idx
		}
		if (user.Email[idx]) == '.' {
			dot = idx
			break
		}
	}
	user.Email = fmt.Sprint(string(user.Email[0]), "****@", string(user.Email[at+1]), "****", user.Email[dot:])
}
