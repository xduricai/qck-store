package directory_handlers

type DirectoryResponse struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type FileResponse struct {
	Id       int    `json:"id"`
	Size     int    `json:"size"`
	Name     string `json:"name"`
	Modified string `json:"modified"`
	Created  string `json:"created"`
}
