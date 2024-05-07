package handlers

import "time"

func FormatDate(inputDate string) (string, error) {
	format := "2006-01-02T15:04:05Z"
	t, err := time.Parse(format, inputDate)
	if err != nil {
		return "", err
	}
	return t.Format("02/01/2006 15:04:05"), nil
}
