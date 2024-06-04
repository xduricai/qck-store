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
	ProfilePicture string `json:"profilePicture"`
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

func FormatEmail(email string) string {
	var at int
	var dot int

	for idx := range email {
		if (email[idx]) == '@' {
			at = idx
		}
		if (email[idx]) == '.' {
			dot = idx
			break
		}
	}
	return fmt.Sprint(string(email[0]), "****@", string(email[at+1]), "****", email[dot:])
}
